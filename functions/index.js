const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateKripixKey(uid, gameCode, editionCode) {
    const block1 = "KRPX";
    const block2 = `${gameCode}${editionCode}A`; 
    
    const timestamp = Date.now().toString();
    const uidSnippet = uid.substring(0, 2).toUpperCase(); 
    const timeSnippet = parseInt(timestamp.substring(timestamp.length - 4)).toString(32).toUpperCase().padStart(2, 'A');
    const block3 = (uidSnippet + timeSnippet).substring(0, 4);

    let salt = "";
    for (let i = 0; i < 3; i++) salt += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    
    const rawKey = block1 + block2 + block3 + salt;
    let sum = 0;
    for (let i = 0; i < rawKey.length; i++) {
        sum += ALPHABET.indexOf(rawKey.charAt(i));
    }
    const checksumChar = ALPHABET.charAt(sum % 32); 

    const block4 = salt + checksumChar;

    return `${block1}-${block2}-${block3}-${block4}`;
}

exports.createUserAccount = functions.https.onCall(async (data, context) => {
    // Gestione sicura dei parametri
    const payload = data.data ? data.data : data;
    const { email, password, username } = payload;

    if (!email || !password || !username) {
        throw new functions.https.HttpsError('invalid-argument', 'Email, password e username sono richiesti.');
    }
    if (username.length < 3) {
        throw new functions.https.HttpsError('invalid-argument', 'Username troppo corto.');
    }

    const usernameRef = db.collection('usernames').doc(username.toLowerCase());
    const usernameDoc = await usernameRef.get();
    if (usernameDoc.exists) {
        throw new functions.https.HttpsError('already-exists', 'Questo username è già stato scelto.');
    }

    try {
        // Creazione Auth
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: username
        });
        
        const uid = userRecord.uid;
        const batch = db.batch();

        const userRef = db.collection('users').doc(uid);
        batch.set(userRef, {
            uid: uid,
            username: username,
            color: '#e3c66c',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            games:[],
            friends: [],
            requests:[],
            privacy: { visibility: true, telemetry: false, newsletter: false, invisible: false }
        });
        
        const privateRef = userRef.collection('private').doc('dossier');
        batch.set(privateRef, { email: email, keys: {} });
        batch.set(usernameRef, { uid: uid });

        await batch.commit();

        // RIGA PROBLEMATICA RIMOSSA. Ora il server risponde "success" immediatamente!
        return { status: 'success', uid: uid };

    } catch (error) {
        console.error("Errore creazione utente:", error);
        if (error.code === 'auth/email-already-exists') {
            throw new functions.https.HttpsError('already-exists', 'Questa email è già registrata.');
        }
        throw new functions.https.HttpsError('internal', 'Errore del server durante la creazione account.');
    }
});

// MANTIENI LA TUA FUNZIONE securePurchaseGame INVARIATA QUI SOTTO
exports.securePurchaseGame = functions.https.onCall(async (data, context) => {
    // 1. Controllo identità
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Devi essere loggato.');
    }
    
    const uid = context.auth.uid;
    const payload = data.data ? data.data : data;
    const gameId = payload.gameId; 

    if (gameId !== "harrow") {
        throw new functions.https.HttpsError('invalid-argument', 'Gioco non trovato.');
    }

    const userRef = db.collection('users').doc(uid);
    const privateRef = userRef.collection('private').doc('dossier');
    
    // 2. Lettura sicura (Previene i crash se l'utente è un "account fantasma")
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const userGames = userData.games ||[];

    if (userGames.includes(gameId)) {
        throw new functions.https.HttpsError('already-exists', 'Possiedi già questa licenza.');
    }

    // 3. Generazione Chiave
    const newKey = generateKripixKey(uid, "HW", "D");
    
    const batch = db.batch();
    
    // FIX SUPREMO: Usiamo "set" con "merge: true" al posto di "update".
    // Se il documento dell'utente è difettoso o manca, Firebase lo ripara al volo e non va in crash.
    batch.set(userRef, {
        games: admin.firestore.FieldValue.arrayUnion(gameId)
    }, { merge: true });

    batch.set(privateRef, {[`keys.${gameId}`]: newKey
    }, { merge: true });

    await batch.commit();

    return { status: "success" };
});