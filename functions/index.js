const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateKripixKey(uid, gameCode, editionCode) {
    // ... (mantieni il tuo codice intatto qui)
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

// AGGIUNTA LA REGIONE A TUTTE LE FUNZIONI
exports.checkAuth = functions.region('europe-west1').https.onCall((data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Test fallito.');
    return { status: 'success', message: `Autenticazione OK per UID: ${context.auth.uid}` };
});

exports.createUserAccount = functions.region('europe-west1').https.onCall(async (data, context) => {
    // ... mantieni il tuo codice intatto
});

exports.securePurchaseGame = functions.region('europe-west1').https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Devi essere loggato.');
    const uid = context.auth.uid;
    const payload = data.data || data; 
    const gameId = payload.gameId;
    
    if (gameId !== "harrow") throw new functions.https.HttpsError('invalid-argument', 'Gioco non trovato.');
    
    const userRef = db.collection('users').doc(uid);
    const privateRef = userRef.collection('private').doc('dossier');
    const userDoc = await userRef.get();
    const userGames = userDoc.exists ? (userDoc.data().games || []) : [];
    
    if (userGames.includes(gameId)) throw new functions.https.HttpsError('already-exists', 'Possiedi già questa licenza.');
    
    const newKey = generateKripixKey(uid, "HW", "D");
    const batch = db.batch();
    
    batch.set(userRef, { games: admin.firestore.FieldValue.arrayUnion(gameId) }, { merge: true });
    batch.set(privateRef, {[`keys.${gameId}`]: newKey }, { merge: true });
    
    await batch.commit();
    return { status: "success" };
});