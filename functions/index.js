const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// ALFABETO BASE32 (32 caratteri, rimosse I, O, 0, 1 per evitare confusione)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// IL GENERATORE DELL'ALGORITMO KRIPIX
function generateKripixKey(uid, gameCode, editionCode) {
    const block1 = "KRPX";
    const block2 = `${gameCode}${editionCode}A`; // Es: HW (Harrow) D (Deluxe) A (Lotto 1)
    
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

// ---------------- NUOVA FUNZIONE DI REGISTRAZIONE SICURA ----------------
exports.createUserAccount = functions.https.onCall(async (data, context) => {
    const { email, password, username } = data;

    // 1. Controlli di validazione base sul server
    if (!email || !password || !username) {
        throw new functions.https.HttpsError('invalid-argument', 'Email, password e username sono richiesti.');
    }
    if (username.length < 3) {
        throw new functions.https.HttpsError('invalid-argument', 'Username troppo corto.');
    }

    // 2. Controllo se l'username è già in uso (atomico e sicuro)
    const usernameRef = db.collection('usernames').doc(username.toLowerCase());
    const usernameDoc = await usernameRef.get();
    if (usernameDoc.exists) {
        throw new functions.https.HttpsError('already-exists', 'Questo username è già stato scelto.');
    }

    try {
        // 3. Creazione utente nel sistema di autenticazione di Firebase
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: username
        });
        
        // 4. Se la creazione ha successo, creiamo i documenti nel database
        const uid = userRecord.uid;
        const batch = db.batch();

        // Documento pubblico
        const userRef = db.collection('users').doc(uid);
        batch.set(userRef, {
            uid: uid,
            username: username,
            color: '#e3c66c',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            games: [],
            friends: [],
            requests: [],
            privacy: { visibility: true, telemetry: false, newsletter: false, invisible: false }
        });
        
        // Documento privato (il caveau)
        const privateRef = userRef.collection('private').doc('dossier');
        batch.set(privateRef, { email: email, keys: {} });

        // Documento per la ricerca dell'username
        batch.set(usernameRef, { uid: uid });

        await batch.commit();

        // 5. Invia email di verifica
        const verificationLink = await admin.auth().generateEmailVerificationLink(email);
        // (In un progetto reale, qui invieresti una email personalizzata tramite un servizio come SendGrid usando il link)
        
        return { status: 'success', uid: uid };

    } catch (error) {
        console.error("Errore creazione utente:", error);
        // Se qualcosa va storto, Firebase è abbastanza intelligente da non creare l'utente
        // o da permetterci di cancellarlo in caso di fallimento parziale.
        if (error.code === 'auth/email-already-exists') {
            throw new functions.https.HttpsError('already-exists', 'Questa email è già registrata.');
        }
        throw new functions.https.HttpsError('internal', 'Errore del server durante la creazione dell\'account.');
    }
});


// FUNZIONE DI ACQUISTO (invariata)
exports.securePurchaseGame = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Devi essere loggato per procedere.');
    }
    const uid = context.auth.uid;
    const gameId = data.gameId; 
    if (gameId !== "harrow") {
        throw new functions.https.HttpsError('invalid-argument', 'Gioco non trovato nel database.');
    }
    const userRef = db.collection('users').doc(uid);
    const privateRef = userRef.collection('private').doc('dossier');
    const userDoc = await userRef.get();
    if (userDoc.exists && userDoc.data().games && userDoc.data().games.includes(gameId)) {
        throw new functions.https.HttpsError('already-exists', 'Possiedi già questa licenza.');
    }
    const newKey = generateKripixKey(uid, "HW", "D");
    const batch = db.batch();
    batch.update(userRef, {
        games: admin.firestore.FieldValue.arrayUnion(gameId)
    });
    batch.set(privateRef, {
        [`keys.${gameId}`]: newKey
    }, { merge: true });
    await batch.commit();
    return { 
        status: "success", 
        message: "Licenza acquisita con successo.",
        game: gameId 
    };
});