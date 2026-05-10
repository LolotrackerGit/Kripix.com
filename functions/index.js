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
    
    // Blocco 3: Impronta utente + tempo
    const timestamp = Date.now().toString();
    const uidSnippet = uid.substring(0, 2).toUpperCase(); // Prime 2 lettere dell'ID utente
    const timeSnippet = parseInt(timestamp.substring(timestamp.length - 4)).toString(32).toUpperCase().padStart(2, 'A');
    const block3 = (uidSnippet + timeSnippet).substring(0, 4);

    // Blocco 4: Salt casuale (3 char)
    let salt = "";
    for (let i = 0; i < 3; i++) salt += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    
    // Calcolo del CHECKSUM Matematico
    const rawKey = block1 + block2 + block3 + salt;
    let sum = 0;
    for (let i = 0; i < rawKey.length; i++) {
        sum += ALPHABET.indexOf(rawKey.charAt(i));
    }
    const checksumChar = ALPHABET.charAt(sum % 32); // Il resto della divisione per 32

    const block4 = salt + checksumChar;

    return `${block1}-${block2}-${block3}-${block4}`;
}

// LA FUNZIONE CHIAMATA DAL SITO QUANDO SI COMPRA UN GIOCO
exports.securePurchaseGame = functions.https.onCall(async (data, context) => {
    // 1. CANCELLO DI SICUREZZA: L'utente è loggato?
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Devi essere loggato per procedere.');
    }

    const uid = context.auth.uid;
    const gameId = data.gameId; // es. "harrow"

    if (gameId !== "harrow") {
        throw new functions.https.HttpsError('invalid-argument', 'Gioco non trovato nel database.');
    }

    const userRef = db.collection('users').doc(uid);
    const privateRef = userRef.collection('private').doc('dossier');

    // 2. CONTROLLO: Ha già il gioco?
    const userDoc = await userRef.get();
    if (userDoc.exists && userDoc.data().games && userDoc.data().games.includes(gameId)) {
        throw new functions.https.HttpsError('already-exists', 'Possiedi già questa licenza.');
    }

    // 3. SIMULAZIONE PAGAMENTO (Qui un domani inserirai Stripe API)
    // Se il pagamento fallisce, lanciamo un errore qui.
    
    // 4. GENERAZIONE CHIAVE SICURA
    const newKey = generateKripixKey(uid, "HW", "D"); // Harrow Deluxe

    // 5. SCRITTURA NEL DATABASE (Atomic Batch)
    const batch = db.batch();
    
    // Aggiorniamo i dati pubblici (mostra agli amici che ha il gioco)
    batch.update(userRef, {
        games: admin.firestore.FieldValue.arrayUnion(gameId)
    });

    // Scriviamo la chiave nel Caveau Privato (Nessun altro la vedrà)
    batch.set(privateRef, {
        [`keys.${gameId}`]: newKey
    }, { merge: true });

    await batch.commit();

    // 6. SUCCESSO!
    return { 
        status: "success", 
        message: "Licenza acquisita con successo.",
        game: gameId 
    };
});