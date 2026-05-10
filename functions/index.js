// NUOVA SINTASSI V2 - PIÙ STABILE
const { onCall } = require("firebase-functions/v2/https");
const { HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Funzione KripixKey (invariata)
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

// ---- NUOVA SINTASSI PER LE FUNZIONI ----
// Impostiamo la regione una volta per tutte, così il frontend la troverà sempre.
const europeWest1 = { region: "europe-west1" };

exports.checkAuth = onCall(europeWest1, (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Test fallito.');
    }
    return { status: 'success', message: `Autenticazione OK per UID: ${request.auth.uid}` };
});

exports.createUserAccount = onCall(europeWest1, async (request) => {
    const { email, password, username } = request.data;
    if (!email || !password || !username) throw new HttpsError('invalid-argument', 'Email, password e username sono richiesti.');
    const usernameRef = db.collection('usernames').doc(username.toLowerCase());
    if ((await usernameRef.get()).exists) throw new HttpsError('already-exists', 'Questo username è già stato scelto.');
    try {
        const userRecord = await admin.auth().createUser({ email, password, displayName: username });
        const { uid } = userRecord, batch = db.batch();
        batch.set(db.collection('users').doc(uid), { uid, username, color: '#e3c66c', createdAt: admin.firestore.FieldValue.serverTimestamp(), games:[], friends:[], requests:[], privacy: { visibility: true, telemetry: false, newsletter: false, invisible: false } });
        batch.set(db.collection('users').doc(uid).collection('private').doc('dossier'), { email, keys: {} });
        batch.set(usernameRef, { uid });
        await batch.commit();
        return { status: 'success', uid };
    } catch (error) {
        if (error.code === 'auth/email-already-exists') throw new HttpsError('already-exists', 'Questa email è già registrata.');
        throw new HttpsError('internal', 'Errore server durante la creazione account.');
    }
});

exports.securePurchaseGame = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Devi essere loggato.');
    const uid = request.auth.uid, gameId = request.data.gameId;
    if (gameId !== "harrow") throw new HttpsError('invalid-argument', 'Gioco non trovato.');
    const userRef = db.collection('users').doc(uid), privateRef = userRef.collection('private').doc('dossier');
    const userDoc = await userRef.get();
    const userGames = userDoc.exists() ? (userDoc.data().games || []) :[];
    if (userGames.includes(gameId)) throw new HttpsError('already-exists', 'Possiedi già questa licenza.');
    const newKey = generateKripixKey(uid, "HW", "D");
    const batch = db.batch();
    batch.update(userRef, { games: admin.firestore.FieldValue.arrayUnion(gameId) });
    batch.set(privateRef, {[`keys.${gameId}`]: newKey }, { merge: true });
    await batch.commit();
    return { status: "success" };
});