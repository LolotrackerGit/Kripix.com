// NUOVA SINTASSI V2 - PIÙ STABILE
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Funzione KripixKey (Generatore di chiavi di gioco)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateKripixKey(uid, gameCode, editionCode) {
    const block1 = "KRPX", block2 = `${gameCode}${editionCode}A`, timestamp = Date.now().toString();
    const uidSnippet = uid.substring(0, 2).toUpperCase();
    const timeSnippet = parseInt(timestamp.substring(timestamp.length - 4)).toString(32).toUpperCase().padStart(2, 'A');
    const block3 = (uidSnippet + timeSnippet).substring(0, 4);
    let salt = "";
    for (let i = 0; i < 3; i++) salt += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    const rawKey = block1 + block2 + block3 + salt;
    let sum = 0;
    for (let i = 0; i < rawKey.length; i++) sum += ALPHABET.indexOf(rawKey.charAt(i));
    const checksumChar = ALPHABET.charAt(sum % 32), block4 = salt + checksumChar;
    return `${block1}-${block2}-${block3}-${block4}`;
}

// Impostiamo la regione una volta per tutte
const europeWest1 = { region: "europe-west1", cors: true };

// ==========================================
// 1. FUNZIONI DI BASE & ACCOUNT
// ==========================================

exports.checkAuth = onCall(europeWest1, (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Test fallito.');
    }
    return { status: 'success', message: `Autenticazione OK per UID: ${request.auth.uid}` };
});

exports.createUserAccount = onCall(europeWest1, async (request) => {
    try {
        console.log(">> REGISTRAZIONE: Inizio procedura.");
        const { email, password, username } = request.data;
        
        if (!email || !password || !username) {
            throw new HttpsError('invalid-argument', 'Email, password e username sono richiesti.');
        }

        const usernameLower = username.toLowerCase();
        const usernameRef = db.collection('usernames').doc(usernameLower);

        console.log(">> REGISTRAZIONE: Controllo se l'username esiste.");
        const usernameDoc = await usernameRef.get();
        if (usernameDoc.exists) {
            throw new HttpsError('already-exists', 'Questo username è già stato scelto.');
        }

        console.log(">> REGISTRAZIONE: Creo l'utente su Firebase Auth...");
        const userRecord = await admin.auth().createUser({ email, password, displayName: username });
        const { uid } = userRecord;
        console.log(`>> REGISTRAZIONE: Utente creato con UID: ${uid}. Preparo il batch per Firestore.`);

        const batch = db.batch();

        // 1. Creo il profilo PUBBLICO (SENZA EMAIL)
        batch.set(db.collection('users').doc(uid), {
            uid: uid,
            username: username,
            color: '#e3c66c',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            games: [],
            friends: [],
            requests:[],
            privacy: { visibility: true, telemetry: false, newsletter: false, invisible: false }
        });

        // 2. Creo il dossier PRIVATO (CON L'EMAIL)
        batch.set(db.collection('users').doc(uid).collection('private').doc('dossier'), {
            email: email,
            keys: {}
        });

        // 3. Creo il documento per la ricerca dell'username
        batch.set(usernameRef, { uid: uid });

        console.log(">> REGISTRAZIONE: Eseguo il commit del batch.");
        await batch.commit();
        
        console.log(">> REGISTRAZIONE: Procedura completata con successo.");
        return { status: 'success', uid: uid };

    } catch (error) {
        console.error(">> CRASH REGISTRAZIONE:", error);
        
        if (error.code === 'auth/email-already-exists') {
            throw new HttpsError('already-exists', 'Questa email è già registrata.');
        }
        if (error.code === 'auth/invalid-password') {
            throw new HttpsError('invalid-argument', 'La password deve avere almeno 6 caratteri.');
        }
        
        throw new HttpsError('internal', `Errore server: ${error.message}`);
    }
});

// ==========================================
// 2. FUNZIONI DELLO STORE (ACQUISTI)
// ==========================================

exports.securePurchaseGame = onCall(europeWest1, async (request) => {
    try {
        if (!request.auth) throw new Error("Utente non autenticato (Manca il Token).");
        
        const uid = request.auth.uid;
        const gameId = request.data.gameId;
        
        if (gameId !== "harrow") throw new Error("ID gioco non valido: " + gameId);
        
        const userRef = db.collection('users').doc(uid);
        const privateRef = userRef.collection('private').doc('dossier');
        
        const userDoc = await userRef.get();
        const userData = userDoc.exists ? userDoc.data() : {};
        const userGames = userData.games ||[];
        
        if (userGames.includes(gameId)) {
            throw new Error("Possiedi già questa licenza.");
        }
        
        const newKey = generateKripixKey(uid, "HW", "D");
        const batch = db.batch();
        
        batch.set(userRef, { games: admin.firestore.FieldValue.arrayUnion(gameId) }, { merge: true });
        batch.set(privateRef, {[`keys.${gameId}`]: newKey }, { merge: true });
        
        await batch.commit();
        
        return { status: "success" };
        
    } catch (error) {
        console.error("ERRORE TRANSAZIONE:", error);
        throw new HttpsError('aborted', "Causa del crash: " + error.message);
    }
});

// ==========================================
// 3. FUNZIONI DELLA RETE OPERATIVA (AMICI)
// ==========================================

// INVIA RICHIESTA DI AMICIZIA
exports.sendFriendRequest = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    
    const senderUid = request.auth.uid;
    const targetUsername = request.data.targetUsername.toLowerCase();

    try {
        const usernameDoc = await db.collection('usernames').doc(targetUsername).get();
        if (!usernameDoc.exists) throw new HttpsError('not-found', 'Agente non trovato.');
        
        const targetUid = usernameDoc.data().uid;
        if (senderUid === targetUid) throw new HttpsError('invalid-argument', 'Non puoi aggiungere te stesso.');

        const targetUserRef = db.collection('users').doc(targetUid);
        const targetUserDoc = await targetUserRef.get();
        const targetData = targetUserDoc.data();

        if (targetData.privacy && targetData.privacy.visibility === false) {
            throw new HttpsError('permission-denied', 'L\'Agente ha disattivato la rintracciabilità.');
        }
        if (targetData.friends && targetData.friends.includes(senderUid)) {
            throw new HttpsError('already-exists', 'Siete già connessi.');
        }
        if (targetData.requests && targetData.requests.includes(senderUid)) {
            throw new HttpsError('already-exists', 'Richiesta già inviata in precedenza.');
        }

        // Aggiunge l'UID del mittente alle richieste del target
        await targetUserRef.update({
            requests: admin.firestore.FieldValue.arrayUnion(senderUid)
        });

        return { status: 'success' };
    } catch (error) {
        throw new HttpsError(error.code || 'internal', error.message);
    }
});

// ACCETTA RICHIESTA DI AMICIZIA
exports.acceptFriendRequest = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    
    const myUid = request.auth.uid;
    const senderUid = request.data.senderUid;

    const batch = db.batch();
    const myRef = db.collection('users').doc(myUid);
    const senderRef = db.collection('users').doc(senderUid);

    // Rimuove la richiesta in sospeso e aggiunge agli amici per l'utente corrente
    batch.update(myRef, {
        requests: admin.firestore.FieldValue.arrayRemove(senderUid),
        friends: admin.firestore.FieldValue.arrayUnion(senderUid)
    });

    // Aggiunge l'utente corrente agli amici del mittente
    batch.update(senderRef, {
        friends: admin.firestore.FieldValue.arrayUnion(myUid)
    });

    await batch.commit();
    return { status: 'success' };
});

// RIMUOVI AMICO O ANNULLA RICHIESTA
exports.removeConnection = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    
    const myUid = request.auth.uid;
    const targetUid = request.data.targetUid;

    const batch = db.batch();
    const myRef = db.collection('users').doc(myUid);
    const targetRef = db.collection('users').doc(targetUid);

    // Rimuove da entrambe le parti, pulendo sia la lista amici che eventuali richieste pendenti
    batch.update(myRef, {
        friends: admin.firestore.FieldValue.arrayRemove(targetUid),
        requests: admin.firestore.FieldValue.arrayRemove(targetUid)
    });
    batch.update(targetRef, {
        friends: admin.firestore.FieldValue.arrayRemove(myUid),
        requests: admin.firestore.FieldValue.arrayRemove(myUid)
    });

    await batch.commit();
    return { status: 'success' };
});