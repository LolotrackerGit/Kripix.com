// NUOVA SINTASSI V2 - PIÙ STABILE
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
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
// Aggiungi questo in alto nel tuo file index.js (se non c'è già)
const crypto = require("crypto"); 

// ==========================================
// 4. SISTEMA DI RISCATTO CHIAVI (ANTI-KEYGEN)
// ==========================================

exports.redeemKripixKey = onCall(europeWest1, async (request) => {
    // 1. Controllo Autenticazione
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Accesso negato. Agente non identificato.');
    }

    const uid = request.auth.uid;
    const rawKey = request.data.gameKey; // Es: KRPX-A1B2-C3D4-E5F6
    
    if (!rawKey || rawKey.length < 10) {
        throw new HttpsError('invalid-argument', 'Formato chiave non valido.');
    }

    // Normalizza la chiave (rimuove spazi, tutto maiuscolo)
    const formattedKey = rawKey.toUpperCase().trim();
    
    // Riferimenti al Database
    const keyRef = db.collection('game_keys').doc(formattedKey);
    const userRef = db.collection('users').doc(uid);
    const privateDossierRef = userRef.collection('private').doc('dossier');

    try {
        // Avviamo una TRANSAZIONE: blocca il documento finché non abbiamo finito
        // Questo impedisce i "Race Conditions" (es. attivazioni doppie simultanee)
        await db.runTransaction(async (transaction) => {
            const keyDoc = await transaction.get(keyRef);

            // 2. Controllo: La chiave esiste nel nostro database?
            if (!keyDoc.exists) {
                throw new Error("CODICE_INESISTENTE");
            }

            const keyData = keyDoc.data();

            // 3. Controllo: La chiave è già stata usata?
            if (keyData.isUsed === true) {
                throw new Error("CODICE_BRUCIATO");
            }

            // 4. Recupero i dati dell'utente per evitare che attivi un gioco che ha già
            const userDoc = await transaction.get(userRef);
            const userGames = userDoc.exists ? (userDoc.data().games || []) :[];

            if (userGames.includes(keyData.gameId)) {
                throw new Error("GIOCO_GIA_POSSEDUTO");
            }

            // 5. TUTTO OK! PROCEDIAMO ALL'ATTIVAZIONE (SOVRASCRITTURA DATI)
            
            // A) Bruciamo la chiave
            transaction.update(keyRef, { 
                isUsed: true, 
                usedBy: uid, 
                redeemedAt: admin.firestore.FieldValue.serverTimestamp() 
            });

            // B) Aggiungiamo il gioco al profilo pubblico dell'utente
            transaction.update(userRef, { 
                games: admin.firestore.FieldValue.arrayUnion(keyData.gameId) 
            });

            // C) Salviamo la chiave nel suo dossier privato per la Libreria
            transaction.set(privateDossierRef, { 
                [`keys.${keyData.gameId}`]: formattedKey 
            }, { merge: true });
        });

        return { status: "success", message: "Licenza acquisita e registrata." };

    } catch (error) {
        console.error(`[SECURITY ALERT] Tentativo riscatto fallito UID ${uid}:`, error.message);
        
        // Traduciamo gli errori del server in messaggi utente
        if (error.message === "CODICE_INESISTENTE") {
            throw new HttpsError('not-found', 'Chiave crittografica non riconosciuta dal Network.');
        }
        if (error.message === "CODICE_BRUCIATO") {
            throw new HttpsError('already-exists', 'Questa licenza è già stata rivendicata da un altro Agente.');
        }
        if (error.message === "GIOCO_GIA_POSSEDUTO") {
            throw new HttpsError('failed-precondition', 'Il tuo account possiede già questa licenza.');
        }
        
        throw new HttpsError('internal', 'Errore di sincronizzazione col server.');
    }
});
// ==========================================
// 5. KRIPIX OS - CONSOLE DEI COMANDI OVERSEER
// ==========================================

exports.overseerCommand = onCall(europeWest1, async (request) => {
    // 1. SCUDO DI SICUREZZA ASSOLUTO
    if (!request.auth) {
        return { status: 'error', output: 'ACCESSO NEGATO: Nessuna identificazione rilevata.' };
    }

    const uid = request.auth.uid;
    const adminDoc = await db.collection('users').doc(uid).get();

    // Verifichiamo direttamente dal server che l'utente sia admin
    if (!adminDoc.exists || adminDoc.data().isAdmin !== true) {
        console.error(`[SECURITY BREACH] L'Agente UID: ${uid} ha tentato di inviare un comando Admin.`);
        return { status: 'error', output: 'ACCESSO NEGATO: Privilegi insufficienti. L\'incidente è stato registrato.' };
    }

    // 2. PARSING DEL COMANDO
    const cmdString = request.data.command || "";
    // Divide la stringa in un array, ignorando gli spazi multipli
    const args = cmdString.trim().split(/\s+/); 
    const action = args[0].toLowerCase();

    try {
        // ==========================================
        // COMANDO: find (Ricerca Agenti)
        // Uso: find -u [username] oppure find -e [email]
        // ==========================================
        if (action === 'find') {
            const flag = args[1];
            const target = args[2];
            let targetUid = null;

            if (!flag || !target) return { status: 'error', output: 'Sintassi errata. Uso: find -u [username] o find -e [email]' };

            // Ricerca tramite Username
            if (flag === '-u') {
                const unDoc = await db.collection('usernames').doc(target.toLowerCase()).get();
                if (!unDoc.exists) return { status: 'error', output: `Nessun Agente trovato con il nome in codice: ${target}` };
                targetUid = unDoc.data().uid;
            } 
            // Ricerca tramite Email (usa l'Auth di Firebase)
            else if (flag === '-e') {
                try {
                    const userRecord = await admin.auth().getUserByEmail(target);
                    targetUid = userRecord.uid;
                } catch(e) {
                    return { status: 'error', output: `Nessun account associato all'email: ${target}` };
                }
            } else {
                return { status: 'error', output: 'Flag sconosciuto. Usa "-u" (username) o "-e" (email).' };
            }

            // Otteniamo il Dossier Pubblico e Privato
            const uDoc = await db.collection('users').doc(targetUid).get();
            const pDoc = await db.collection('users').doc(targetUid).collection('private').doc('dossier').get();
            
            const uData = uDoc.exists ? uDoc.data() : {};
            const pData = pDoc.exists ? pDoc.data() : {};
            
            // Creiamo l'output stile terminale
            let output = `--- DOSSIER AGENTE DECRIPTATO ---\n`;
            output += `UID      : ${targetUid}\n`;
            output += `USERNAME : ${uData.username}\n`;
            output += `EMAIL    : ${pData.email || '[NON DISPONIBILE]'}\n`;
            output += `STATUS   : ${uData.onlineStatus ? uData.onlineStatus.toUpperCase() : 'OFFLINE'}\n`;
            output += `VISIBILE : ${uData.privacy && uData.privacy.invisible ? 'FALSO (FANTASMA)' : 'VERO'}\n`;
            output += `LICENZE  : ${uData.games && uData.games.length > 0 ? uData.games.join(', ').toUpperCase() : 'NESSUNA'}`;
            
            return { status: 'success', output: output };
        }

        // ==========================================
        // COMANDO: license (Gestione Software)
        // Uso: license grant [uid] [id] oppure license revoke [uid] [id]
        // ==========================================
        if (action === 'license') {
            const subAction = args[1]; // 'grant' o 'revoke'
            const targetUid = args[2];
            const gameId = args[3]; // Es: 'harrow'

            if (!subAction || !targetUid || !gameId) return { status: 'error', output: 'Sintassi errata. Uso: license grant/revoke [uid] [game_id]' };

            const userRef = db.collection('users').doc(targetUid);
            const dossierRef = userRef.collection('private').doc('dossier');

            if (subAction === 'grant') {
                await userRef.update({ games: admin.firestore.FieldValue.arrayUnion(gameId) });
                // Inseriamo una chiave "fittizia" nel dossier privato per far capire che è un regalo admin
                await dossierRef.set({ [`keys.${gameId}`]: "OVERSEER_DIRECT_GRANT" }, { merge: true });
                return { status: 'success', output: `[SUCCESSO] Licenza '${gameId.toUpperCase()}' concessa manualmente all'UID: ${targetUid}` };
            } 
            else if (subAction === 'revoke') {
                await userRef.update({ games: admin.firestore.FieldValue.arrayRemove(gameId) });
                // Elimina la chiave dal dossier
                await dossierRef.update({ [`keys.${gameId}`]: admin.firestore.FieldValue.delete() });
                return { status: 'success', output: `[SUCCESSO] Licenza '${gameId.toUpperCase()}' revocata e rimossa dal profilo UID: ${targetUid}` };
            } 
            else {
                return { status: 'error', output: "Azione sconosciuta. Usa 'grant' o 'revoke'." };
            }
        }

        // ==========================================
        // COMANDO: keys purge (Pulizia Database)
        // Uso: keys purge
        // ==========================================
        if (action === 'keys' && args[1] === 'purge') {
            // Cerchiamo tutte le chiavi nel database in cui isUsed è false
            const snapshot = await db.collection('game_keys').where('isUsed', '==', false).get();
            
            if (snapshot.empty) {
                return { status: 'success', output: "Nessuna chiave vergine trovata. Il database è già pulito." };
            }

            // Usiamo il batch per cancellarle tutte in un colpo solo
            const batch = db.batch();
            let count = 0;
            
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
                count++;
            });
            
            await batch.commit(); 
            return { status: 'success', output: `[PROTOCOLLO PURGE COMPLETATO] Distrutte ${count} chiavi crittografiche non utilizzate.` };
        }

        // Se il comando non è riconosciuto
        return { status: 'error', output: `Comando non riconosciuto: ${action}. Digita 'help' per la sintassi corretta.` };

    } catch (error) {
        console.error(`[OVERSEER ERROR] Fallimento comando '${cmdString}':`, error);
        return { status: 'error', output: `Errore critico di sistema: ${error.message}` };
    }
});
// ==========================================
// 6. PROTOCOLLO SINCRONIZZAZIONE DISCORD
// ==========================================

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_REDIRECT_URI = "https://europe-west1-kripix-ent.cloudfunctions.net/discordCallback";

// Gli ID numerici del server non sono segreti, possono restare nel codice
const GUILD_ID = "1503069828439740618";
const ROLE_VERIFIED = "1503076001729744987";
const ROLE_DETECTIVE = "1504131716443541615";
const ROLE_OVERSEER = "1503075406402687159";

exports.getDiscordAuthUrl = onCall(europeWest1, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Accesso negato.');
    const uid = request.auth.uid;
    
    // Generiamo l'esagono di sicurezza
    const state = crypto.randomBytes(16).toString("hex");
    await db.collection("discord_states").doc(state).set({ uid: uid, createdAt: admin.firestore.FieldValue.serverTimestamp() });

    // Link autorizzazione Discord
    const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify&state=${state}`;
    return { status: 'success', url: url };
});

exports.discordCallback = onRequest(europeWest1, async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    if (!code || !state) return res.status(400).send("Protocollo Fallito: Parametri mancanti.");

    try {
        // 1. Verifica Sicurezza
        const stateDocRef = db.collection("discord_states").doc(state);
        const stateDoc = await stateDocRef.get();
        if (!stateDoc.exists) return res.status(403).send("Sessione scaduta o non valida.");
        const uid = stateDoc.data().uid;

        // 2. Acquisizione Token Utente
        const tokenParams = new URLSearchParams();
        tokenParams.append('client_id', DISCORD_CLIENT_ID);
        tokenParams.append('client_secret', DISCORD_CLIENT_SECRET);
        tokenParams.append('grant_type', 'authorization_code');
        tokenParams.append('code', code);
        tokenParams.append('redirect_uri', DISCORD_REDIRECT_URI);

        const tokenRes = await fetch('https://discord.com/api/oauth2/token', { method: 'POST', body: tokenParams, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) {
    console.error("ERRORE DISCORD SEGRETO:", tokenData);
    return res.status(400).send(`
        <body style="background:#05070a; color:white; font-family:monospace; padding:50px; text-align:center;">
            <h2 style="color:#ff5555;">ACCESSO NEGATO DA DISCORD</h2>
            <p>Discord ha rifiutato la stretta di mano. Ecco il vero motivo:</p>
            <pre style="background:#111; border:1px solid #e3c66c; color:#4caf50; padding:20px; text-align:left; display:inline-block;">${JSON.stringify(tokenData, null, 2)}</pre>
            <p style="margin-top:30px;">Mandami uno screenshot di questa scatola verde!</p>
        </body>
    `);
}

        // 3. ID Discord
        const userRes = await fetch('https://discord.com/api/users/@me', { headers: { 'Authorization': `Bearer ${tokenData.access_token}` } });
        const discordUser = await userRes.json();

        // 4. Leggiamo i dati dal Dossier Kripix (per sapere quali ruoli dargli)
        const kripixUserDoc = await db.collection("users").doc(uid).get();
        const kripixData = kripixUserDoc.exists ? kripixUserDoc.data() : {};

        // Prepariamo la lista dei ruoli da assegnare
        const rolesToAdd = [ROLE_VERIFIED]; // Ruolo base per tutti
        if (kripixData.games && kripixData.games.includes("harrow")) {
            rolesToAdd.push(ROLE_DETECTIVE);
        }
        if (kripixData.isAdmin === true) {
            rolesToAdd.push(ROLE_OVERSEER);
        }

        // 5. Assegniamo i ruoli fisicamente su Discord!
        for (const roleId of rolesToAdd) {
            await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordUser.id}/roles/${roleId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                    'Content-Length': '0' // API richiede un body vuoto per il PUT
                }
            });
        }

        // 6. Salviamo l'ID Discord su Firebase
        await kripixUserDoc.ref.update({
            discordId: discordUser.id,
            discordUsername: discordUser.username
        });

        await stateDocRef.delete();

        // 7. Ritorno alla base (Cambia il link con quello del tuo sito!)
        res.redirect('https://lolotrackergit.github.io/Kripix.com/profilo.html?sync=success');

    } catch (error) {
        console.error("[CRASH OAUTH]:", error);
        res.status(500).send("Errore critico durante l'interfacciamento col Kripix Network.");
    }
});