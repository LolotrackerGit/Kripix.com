// ==========================================
// 0. IMPORTAZIONI E CONFIGURAZIONI GLOBALI
// ==========================================
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const crypto = require("crypto"); 

admin.initializeApp();
const db = admin.firestore();

const europeWest1 = { 
    region: "europe-west1", 
    cors: true
};

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

// ==========================================
// 1. FUNZIONI DI BASE & ACCOUNT
// ==========================================

exports.checkAuth = onCall(europeWest1, (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Test fallito.');
    return { status: 'success', message: `Autenticazione OK per UID: ${request.auth.uid}` };
});

exports.createUserAccount = onCall(europeWest1, async (request) => {
    try {
        const { email, password, username } = request.data;
        if (!email || !password || !username) throw new HttpsError('invalid-argument', 'Email, password e username sono richiesti.');

        const usernameLower = username.toLowerCase();
        const usernameRef = db.collection('usernames').doc(usernameLower);

        const usernameDoc = await usernameRef.get();
        if (usernameDoc.exists) throw new HttpsError('already-exists', 'Questo username è già stato scelto.');

        const userRecord = await admin.auth().createUser({ email, password, displayName: username });
        const { uid } = userRecord;

        const batch = db.batch();

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

        batch.set(db.collection('users').doc(uid).collection('private').doc('dossier'), {
            email: email,
            keys: {}
        });

        batch.set(usernameRef, { uid: uid });

        await batch.commit();
        return { status: 'success', uid: uid };

    } catch (error) {
        if (error.code === 'auth/email-already-exists') throw new HttpsError('already-exists', 'Questa email è già registrata.');
        if (error.code === 'auth/invalid-password') throw new HttpsError('invalid-argument', 'La password deve avere almeno 8 caratteri.');
        throw new HttpsError('internal', `Errore server: ${error.message}`);
    }
});

// ==========================================
// 2. FUNZIONI DELLA RETE OPERATIVA (AMICI)
// ==========================================

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

        // FIX: Evita i crash se gli array non esistono ancora nel DB
        const friendsList = targetData.friends || [];
        const requestsList = targetData.requests || [];

        if (friendsList.includes(senderUid)) throw new HttpsError('already-exists', 'Siete già connessi.');
        if (requestsList.includes(senderUid)) throw new HttpsError('already-exists', 'Richiesta già inviata in precedenza.');

        await targetUserRef.update({ requests: admin.firestore.FieldValue.arrayUnion(senderUid) });
        return { status: 'success' };
    } catch (error) {
        throw new HttpsError(error.code || 'internal', error.message);
    }
});

exports.acceptFriendRequest = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    const myUid = request.auth.uid;
    const senderUid = request.data.senderUid;

    const batch = db.batch();
    const myRef = db.collection('users').doc(myUid);
    const senderRef = db.collection('users').doc(senderUid);

    batch.update(myRef, { requests: admin.firestore.FieldValue.arrayRemove(senderUid), friends: admin.firestore.FieldValue.arrayUnion(senderUid) });
    batch.update(senderRef, { friends: admin.firestore.FieldValue.arrayUnion(myUid) });

    await batch.commit();
    return { status: 'success' };
});

exports.removeConnection = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    const myUid = request.auth.uid;
    const targetUid = request.data.targetUid;

    const batch = db.batch();
    const myRef = db.collection('users').doc(myUid);
    const targetRef = db.collection('users').doc(targetUid);

    batch.update(myRef, { friends: admin.firestore.FieldValue.arrayRemove(targetUid), requests: admin.firestore.FieldValue.arrayRemove(targetUid) });
    batch.update(targetRef, { friends: admin.firestore.FieldValue.arrayRemove(myUid), requests: admin.firestore.FieldValue.arrayRemove(myUid) });

    await batch.commit();
    return { status: 'success' };
});

// ==========================================
// 3. SISTEMA DI RISCATTO CHIAVI (ANTI-KEYGEN)
// ==========================================

exports.redeemKripixKey = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    const uid = request.auth.uid;
    const rawKey = request.data.gameKey; 
    
    if (!rawKey || rawKey.length < 10) throw new HttpsError('invalid-argument', 'Formato chiave non valido.');
    const formattedKey = rawKey.toUpperCase().trim();
    
    const keyRef = db.collection('game_keys').doc(formattedKey);
    const userRef = db.collection('users').doc(uid);
    const privateDossierRef = userRef.collection('private').doc('dossier');

    try {
        await db.runTransaction(async (transaction) => {
            const keyDoc = await transaction.get(keyRef);
            if (!keyDoc.exists) throw new Error("CODICE_INESISTENTE");
            
            const keyData = keyDoc.data();
            if (keyData.isUsed === true) throw new Error("CODICE_BRUCIATO");

            const userDoc = await transaction.get(userRef);
            const userGames = userDoc.exists ? (userDoc.data().games || []) :[];
            if (userGames.includes(keyData.gameId)) throw new Error("GIOCO_GIA_POSSEDUTO");

            transaction.update(keyRef, { isUsed: true, usedBy: uid, redeemedAt: admin.firestore.FieldValue.serverTimestamp() });
            transaction.update(userRef, { games: admin.firestore.FieldValue.arrayUnion(keyData.gameId) });
            transaction.set(privateDossierRef, { [`keys.${keyData.gameId}`]: formattedKey }, { merge: true });
        });
        return { status: "success", message: "Licenza acquisita." };
    } catch (error) {
        if (error.message === "CODICE_INESISTENTE") throw new HttpsError('not-found', 'Chiave non riconosciuta.');
        if (error.message === "CODICE_BRUCIATO") throw new HttpsError('already-exists', 'Licenza già rivendicata.');
        if (error.message === "GIOCO_GIA_POSSEDUTO") throw new HttpsError('failed-precondition', 'Possiedi già questa licenza.');
        throw new HttpsError('internal', 'Errore di sincronizzazione col server.');
    }
});

// ==========================================
// 4. KRIPIX OS - CONSOLE DEI COMANDI OVERSEER
// ==========================================

exports.overseerCommand = onCall(europeWest1, async (request) => {
    if (!request.auth) return { status: 'error', output: 'ACCESSO NEGATO.' };
    const uid = request.auth.uid;
    const adminDoc = await db.collection('users').doc(uid).get();

    if (!adminDoc.exists || adminDoc.data().isAdmin !== true) return { status: 'error', output: 'ACCESSO NEGATO: Privilegi insufficienti.' };

    const cmdString = request.data.command || "";
    const args = cmdString.trim().split(/\s+/); 
    const action = args[0].toLowerCase();

    try {
        if (action === 'find') {
            const flag = args[1]; const target = args[2]; let targetUid = null;
            if (!flag || !target) return { status: 'error', output: 'Sintassi errata. Uso: find -u [username] o find -e [email]' };
            if (flag === '-u') {
                const unDoc = await db.collection('usernames').doc(target.toLowerCase()).get();
                if (!unDoc.exists) return { status: 'error', output: `Nessun Agente trovato: ${target}` };
                targetUid = unDoc.data().uid;
            } else if (flag === '-e') {
                try {
                    const userRecord = await admin.auth().getUserByEmail(target);
                    targetUid = userRecord.uid;
                } catch(e) { return { status: 'error', output: `Nessun account associato all'email: ${target}` }; }
            } else return { status: 'error', output: 'Flag sconosciuto.' };

            const uDoc = await db.collection('users').doc(targetUid).get();
            const pDoc = await db.collection('users').doc(targetUid).collection('private').doc('dossier').get();
            const uData = uDoc.exists ? uDoc.data() : {}; const pData = pDoc.exists ? pDoc.data() : {};
            
            let output = `--- DOSSIER AGENTE DECRIPTATO ---\nUID      : ${targetUid}\nUSERNAME : ${uData.username}\nEMAIL    : ${pData.email || '[NON DISPONIBILE]'}\nSTATUS   : ${uData.onlineStatus ? uData.onlineStatus.toUpperCase() : 'OFFLINE'}\nVISIBILE : ${uData.privacy && uData.privacy.invisible ? 'FALSO (FANTASMA)' : 'VERO'}\nLICENZE  : ${uData.games && uData.games.length > 0 ? uData.games.join(', ').toUpperCase() : 'NESSUNA'}`;
            return { status: 'success', output: output };
        }

        // ==========================================
        // COMANDO: msg (Invia Direttiva da Overseer)
        // ==========================================
        if (action === 'msg') {
            const targetUsername = args[1];
            const messageText = args.slice(2).join(' ');

            if (!targetUsername || !messageText) return { status: 'error', output: 'Sintassi errata. Uso: msg [username] [testo]' };

            const unDoc = await db.collection('usernames').doc(targetUsername.toLowerCase()).get();
            if (!unDoc.exists) return { status: 'error', output: `Agente non trovato: ${targetUsername}` };
            
            const targetUid = unDoc.data().uid;
            
            // ID di sistema fittizio per far capire al frontend che è Kripix Admin
            const systemId = "KRIPX_OVERSEER_SYSTEM";
            const chatId = `SYSTEM_${targetUid}`; 

            const batch = db.batch();

            const msgRef = db.collection('chats').doc(chatId).collection('messages').doc();
            batch.set(msgRef, {
                sender: systemId,
                text: messageText,
                isSystemDirective: true,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            const chatRef = db.collection('chats').doc(chatId);
            batch.set(chatRef, {
                isSystemChat: true, // Questo flag aiuta il frontend
                lastMessage: messageText,
                lastMessageTime: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                participants: [systemId, targetUid, uid], // Mettiamo te (uid admin) per farti leggere le risposte!
                [`unread_${targetUid}`]: true,
                [`unread_${uid}`]: false
            }, { merge: true });

            await batch.commit();
            return { status: 'success', output: `[DIRETTIVA TRASMESSA] a ${targetUsername.toUpperCase()}.` };
        }
        
        if (action === 'license') {
            const subAction = args[1]; const targetUid = args[2]; const gameId = args[3];
            if (!subAction || !targetUid || !gameId) return { status: 'error', output: 'Sintassi errata. Uso: license grant/revoke [uid] [game_id]' };
            const userRef = db.collection('users').doc(targetUid);
            const dossierRef = userRef.collection('private').doc('dossier');

            if (subAction === 'grant') {
                await userRef.update({ games: admin.firestore.FieldValue.arrayUnion(gameId) });
                await dossierRef.set({ [`keys.${gameId}`]: "OVERSEER_DIRECT_GRANT" }, { merge: true });
                return { status: 'success', output: `[SUCCESSO] Licenza concessa.` };
            } else if (subAction === 'revoke') {
                await userRef.update({ games: admin.firestore.FieldValue.arrayRemove(gameId) });
                await dossierRef.update({ [`keys.${gameId}`]: admin.firestore.FieldValue.delete() });
                return { status: 'success', output: `[SUCCESSO] Licenza revocata.` };
            }
        }

        if (action === 'network') {
            const subAction = args[1]; const targetUid = args[2]; const reason = args.slice(3).join(' ') || "Nessun motivo specificato.";
            if (!subAction || !targetUid) return { status: 'error', output: 'Sintassi errata. Uso: network [azione] [uid] (motivo)' };
            const userRef = db.collection('users').doc(targetUid);
            switch (subAction) {
                case 'ban': await admin.auth().updateUser(targetUid, { disabled: true }); await userRef.set({ accountStatus: { isBanned: true, reason: reason } }, { merge: true }); return { status: 'success', output: `Agente bannato.` };
                case 'unban': await admin.auth().updateUser(targetUid, { disabled: false }); await userRef.update({ 'accountStatus.isBanned': false }); return { status: 'success', output: `Agente riabilitato.` };
                case 'suspend': await userRef.set({ accountStatus: { isSuspended: true, reason: reason } }, { merge: true }); return { status: 'success', output: `Agente sospeso.` };
                case 'unsuspend': await userRef.update({ accountStatus: admin.firestore.FieldValue.delete() }); return { status: 'success', output: `Sospensione revocata.` };
            }
        }

        if (action === 'keys' && args[1] === 'purge') {
            const snapshot = await db.collection('game_keys').where('isUsed', '==', false).get();
            if (snapshot.empty) return { status: 'success', output: "Nessuna chiave vergine trovata." };
            const batch = db.batch(); let count = 0;
            snapshot.docs.forEach((doc) => { batch.delete(doc.ref); count++; });
            await batch.commit(); 
            return { status: 'success', output: `Distrutte ${count} chiavi.` };
        }

        return { status: 'error', output: `Comando non riconosciuto.` };
    } catch (error) { return { status: 'error', output: `Errore: ${error.message}` }; }
});

// ==========================================
// 5. PROTOCOLLO SINCRONIZZAZIONE DISCORD
// ==========================================

// Variabili Discord (Hardcoded, niente .env)
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_REDIRECT_URI = "https://europe-west1-kripix-ent.cloudfunctions.net/discordCallback";

const GUILD_ID = "1503069828439740618";
const ROLE_VERIFIED = "1503076001729744987";
const ROLE_DETECTIVE = "1504131716443541615";
const ROLE_OVERSEER = "1503075406402687159";
const ROLE_UNVERIFIED = "1503075622698614915";

exports.getDiscordAuthUrl = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    const uid = request.auth.uid;
    const state = crypto.randomBytes(16).toString("hex");
    await db.collection("discord_states").doc(state).set({ uid: uid, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify&state=${state}`;
    return { status: 'success', url: url };
});

exports.unlinkDiscord = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    const uid = request.auth.uid;

    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists || !userDoc.data().discordId) {
        throw new HttpsError('not-found', 'Nessun account Discord collegato.');
    }

    const discordId = userDoc.data().discordId;

    try {
        // 1. CHIAMATA A DISCORD PER RIMUOVERE TUTTI I RUOLI KRIPIX
        // Usiamo il metodo PATCH per SOVRASCRIVERE completamente la lista dei ruoli dell'utente
        // Gli assegniamo solo il ruolo "ROLE_UNVERIFIED" (se non lo hai, passa un array vuoto: roles: [] )
        
        await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roles: [ROLE_UNVERIFIED] // Rimuove Overseer, Detective, Verificato ecc...
            })
        });

        // 2. PULIZIA DATABASE FIREBASE
        await userRef.update({
            discordId: admin.firestore.FieldValue.delete(),
            discordUsername: admin.firestore.FieldValue.delete()
        });

        return { status: 'success' };

    } catch (error) {
        console.error("[CRASH UNLINK DISCORD]:", error);
        throw new HttpsError('internal', 'Errore durante la revoca dei permessi su Discord.');
    }
});

exports.discordCallback = onRequest(europeWest1, async (req, res) => {
   
   const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const DISCORD_REDIRECT_URI = "https://europe-west1-kripix-ent.cloudfunctions.net/discordCallback";

    const code = req.query.code; const state = req.query.state;
    if (!code || !state) return res.status(400).send("Parametri mancanti.");

    try {
        const stateDocRef = db.collection("discord_states").doc(state);
        const stateDoc = await stateDocRef.get();
        if (!stateDoc.exists) return res.status(403).send("Sessione scaduta.");
        const uid = stateDoc.data().uid;

        const tokenParams = new URLSearchParams();
        tokenParams.append('client_id', DISCORD_CLIENT_ID);
        tokenParams.append('client_secret', DISCORD_CLIENT_SECRET);
        tokenParams.append('grant_type', 'authorization_code');
        tokenParams.append('code', code);
        tokenParams.append('redirect_uri', DISCORD_REDIRECT_URI);

        const tokenRes = await fetch('https://discord.com/api/oauth2/token', { method: 'POST', body: tokenParams, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        const tokenData = await tokenRes.json();
        
        if (!tokenData.access_token) return res.status(400).send("Accesso rifiutato da Discord.");

        const userRes = await fetch('https://discord.com/api/users/@me', { headers: { 'Authorization': `Bearer ${tokenData.access_token}` } });
        const discordUser = await userRes.json();

        const kripixUserDoc = await db.collection("users").doc(uid).get();
        const kripixData = kripixUserDoc.exists ? kripixUserDoc.data() : {};

        const rolesToAdd = [ROLE_VERIFIED]; 
        if (kripixData.games && kripixData.games.includes("harrow")) rolesToAdd.push(ROLE_DETECTIVE);
        if (kripixData.isAdmin === true) rolesToAdd.push(ROLE_OVERSEER);

        for (const roleId of rolesToAdd) {
            await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordUser.id}/roles/${roleId}`, {
                method: 'PUT', headers: { 'Authorization': `Bot ${DISCORD_BOT_TOKEN}`, 'Content-Length': '0' }
            });
        }

        await kripixUserDoc.ref.update({ discordId: discordUser.id, discordUsername: discordUser.username });
        await stateDocRef.delete();

        res.redirect('https://kripix.netlify.app/profilo.html?sync=success');

    } catch (error) {
        console.error("[CRASH OAUTH]:", error);
        res.status(500).send("Errore critico durante l'interfacciamento.");
    }
    
});

// ==========================================
// 6. CREAZIONE SESSIONE STRIPE CHECKOUT
// ==========================================
exports.createPaymentIntent = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const uid = request.auth.uid;
    const gameId = request.data.gameId;

    if (gameId !== "harrow") throw new HttpsError('invalid-argument', 'Gioco non valido.');

    try {
        // --- INIZIO FIX DI SICUREZZA ---
        // Controlliamo se l'utente ha già il gioco nel profilo pubblico O nel dossier privato
        const userDoc = await db.collection('users').doc(uid).get();
        const dossierDoc = await db.collection('users').doc(uid).collection('private').doc('dossier').get();
        
        const hasGameInProfile = userDoc.exists && userDoc.data().games && userDoc.data().games.includes(gameId);
        const hasGameInDossier = dossierDoc.exists && dossierDoc.data().keys && dossierDoc.data().keys[gameId];

        if (hasGameInProfile || hasGameInDossier) {
            // Se lo possiede già, lanciamo un errore specifico e blocchiamo Stripe
            throw new HttpsError('already-exists', 'GIOCO_GIA_POSSEDUTO');
        }
        // --- FINE FIX DI SICUREZZA ---

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1999, // 19.99 Euro
            currency: 'eur',
            automatic_payment_methods: { enabled: true }, 
            metadata: { firebaseUID: uid, gameId: gameId }
        });
        return { status: 'success', clientSecret: paymentIntent.client_secret };
    } catch (error) {
        console.error("Errore Stripe Intent:", error);
        // Passiamo l'errore personalizzato al frontend per farglielo leggere
        if (error.code === 'already-exists') throw error;
        throw new HttpsError('internal', 'Errore durante l\'inizializzazione del terminale bancario.');
    }
});

// ==========================================
// 7. WEBHOOK STRIPE (Ricezione Pagamento)
// ==========================================
const endpointSecret = "whsec_IIv1lLa5ZhcA7JqCjWKRiWIVV8NMybrH"; // <-- Il tuo segreto!

exports.stripeWebhook = onRequest(europeWest1, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const uid = paymentIntent.metadata.firebaseUID;
        const gameId = paymentIntent.metadata.gameId;

        if (uid && gameId) {
            const userRef = db.collection('users').doc(uid);
            const privateRef = userRef.collection('private').doc('dossier');
            const newKey = generateKripixKey(uid, "HW", "D");
            
            // Estrazione Dati Pagamento Migliorata!
            let pMethod = "STRIPE";
            let pLast4 = "****";

            try {
                // Recuperiamo i dettagli reali usando le API di Stripe
                if (paymentIntent.payment_method) {
                    const paymentMethodDetails = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
                    if (paymentMethodDetails.type === 'card') {
                        pMethod = paymentMethodDetails.card.brand.toUpperCase(); // VISA, MASTERCARD, ecc.
                        pLast4 = paymentMethodDetails.card.last4;
                    } else if (paymentMethodDetails.type === 'paypal') {
                        pMethod = "PAYPAL";
                    } else if (paymentMethodDetails.type === 'klarna') {
                        pMethod = "KLARNA";
                    }
                }
            } catch (e) {
                console.error("Non sono riuscito a estrarre il metodo di pagamento:", e);
            }
            
            const batch = db.batch();
            batch.set(userRef, { games: admin.firestore.FieldValue.arrayUnion(gameId) }, { merge: true });
            
            batch.set(privateRef, {
                [`keys.${gameId}`]: newKey,
                lastPurchase: { method: pMethod, last4: pLast4 }
            }, { merge: true });
            
            await batch.commit();
        }
    }

    res.json({received: true});
});
// ==========================================
// 8. TELEMETRIA E TRACCIAMENTO
// ==========================================
exports.logTelemetry = onCall(europeWest1, async (request) => {
    // 1. Cattura l'IP reale dell'utente dalla richiesta HTTP
    const ipAddress = request.rawRequest.headers['x-forwarded-for'] || request.rawRequest.socket.remoteAddress || "UNKNOWN";
    
    // 2. Prendi i dati che il frontend ci ha inviato
    const { consentLevel, deviceData, page } = request.data;
    const uid = request.auth ? request.auth.uid : "ANONYMOUS";
    
    // 3. Prepariamo il Dossier
    const logEntry = {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ip: ipAddress,
        uid: uid,
        page: page || "Unknown",
        consent: consentLevel // "accepted" o "rejected"
    };

    // 4. Se ha accettato tutto, aggiungiamo i dati avanzati del dispositivo
    if (consentLevel === "accepted" && deviceData) {
        logEntry.browser = deviceData.browser || "Unknown";
        logEntry.os = deviceData.os || "Unknown";
        logEntry.screen = deviceData.screen || "Unknown";
        logEntry.language = deviceData.language || "Unknown";
        logEntry.userAgent = deviceData.userAgent || "Unknown";
    }

    try {
        // Salviamo nella collezione 'telemetry'. 
        // Usiamo un ID autogenerato per mantenere uno storico di ogni sessione.
        await db.collection('telemetry').add(logEntry);
        
        // Se è loggato, aggiorniamo anche il suo profilo con l'ultimo IP noto (utile per la sicurezza)
        if (uid !== "ANONYMOUS") {
            await db.collection('users').doc(uid).update({
                lastKnownIp: ipAddress,
                lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        
        return { status: "success" };
    } catch (error) {
        console.error("Errore salvataggio telemetria:", error);
        throw new HttpsError('internal', 'Errore database telemetria.');
    }
});
// ==========================================
// 9. TERMINALE MESSAGGI (Chat In-Site)
// ==========================================
exports.sendMessage = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    const senderUid = request.auth.uid;
    const { targetUid, message } = request.data;

    if (!targetUid || !message || message.trim() === "") throw new HttpsError('invalid-argument', 'Dati incompleti.');

    const senderDoc = await db.collection('users').doc(senderUid).get();
    const isSenderOverseer = senderDoc.data().isAdmin === true;

    // Se stiamo scrivendo all'Admin di sistema, saltiamo il controllo amicizia
    if (!isSenderOverseer && targetUid !== "KRIPX_OVERSEER_SYSTEM") {
        const senderFriends = senderDoc.data().friends || [];
        if (!senderFriends.includes(targetUid)) {
            throw new HttpsError('permission-denied', 'Non sei autorizzato a contattare questo Agente.');
        }
    }

    // Creiamo un ID chat speciale se parliamo con il sistema
    let chatId;
    if (targetUid === "KRIPX_OVERSEER_SYSTEM") {
        chatId = `SYSTEM_${senderUid}`;
    } else {
        chatId = senderUid < targetUid ? `${senderUid}_${targetUid}` : `${targetUid}_${senderUid}`;
    }

    const messageData = {
        sender: senderUid,
        text: message.trim(),
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    try {
        const batch = db.batch();
        const newMsgRef = db.collection('chats').doc(chatId).collection('messages').doc();
        batch.set(newMsgRef, messageData);

        const chatRef = db.collection('chats').doc(chatId);
        const updateData = {
            lastMessage: message.trim(),
            lastMessageTime: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            [`unread_${targetUid}`]: true,
            [`unread_${senderUid}`]: false 
        };
        
        // Aggiorniamo i partecipanti solo se è una chat normale (per non sovrascrivere l'admin nel sistema)
        if (targetUid !== "KRIPX_OVERSEER_SYSTEM") {
            updateData.participants = [senderUid, targetUid];
        }

        batch.set(chatRef, updateData, { merge: true });

        await batch.commit();
        return { status: 'success' };
    } catch (error) {
        throw new HttpsError('internal', 'Impossibile inviare il messaggio.');
    }
});


// Aggiungiamo una funzione rapida per segnare i messaggi come letti quando apri la chat
exports.markChatAsRead = onCall(europeWest1, async (request) => {
    if (!request.auth) return { status: 'error' };
    const myUid = request.auth.uid;
    const { targetUid, isSystemChat } = request.data;
    
    let chatId;
    if (isSystemChat) {
        if (targetUid === "KRIPX_OVERSEER_SYSTEM") chatId = `SYSTEM_${myUid}`;
        else chatId = `SYSTEM_${targetUid}`;
    } else {
        chatId = myUid < targetUid ? `${myUid}_${targetUid}` : `${targetUid}_${myUid}`;
    }

    try {
        await db.collection('chats').doc(chatId).update({ [`unread_${myUid}`]: false });
        return { status: 'success' };
    } catch(e) { return { status: 'error' }; }
});