// ============================================================
//  TRANSLATOR.JS — Kripix Entertainment
//  Sistema di traduzione IT ↔ EN con supporto data-i18n
//  e fallback su text-node matching per retrocompatibilità.
// ============================================================


// ── DIZIONARIO IT → EN ──────────────────────────────────────

const dizionario_EN = {

    // ── Componenti globali (Navbar & Footer) ────────────────
    "Progetti": "Projects",
    "Chi Siamo": "About Us",
    "Contatti": "Contact",
    "Scarica App": "Download App",
    "Assistenza": "Support",
    "Centro assistenza": "Help center",
    "Torna in cima alla pagina": "Back to top of page",
    "Apri il menu": "Open the menu",
    "Apri contatti": "Open contacts",
    "ACCEDI": "LOGIN",
    "IL MIO PROFILO": "MY PROFILE",
    "Libreria Giochi": "Game Library",
    "Configurazione": "Settings",
    "Terminale Overseer": "Overseer Terminal",
    "Disconnetti": "Disconnect",
    "Scollegati (Errore Database)": "Disconnect (Database Error)",
    "ACCOUNT FANTASMA": "GHOST ACCOUNT",
    "Agente Operativo": "Field Agent",
    "← TORNA ALLA HOME": "← RETURN TO HOME",
    "← TORNA AL NETWORK": "← RETURN TO NETWORK",
    "← ANNULLA": "← CANCEL",
    "← TORNA AL CATALOGO": "← RETURN TO CATALOG",
    "← TORNA AL LOGIN": "← RETURN TO LOGIN",
    "← ESCI DAL TERMINALE": "← EXIT TERMINAL",
    "ANNULLA": "CANCEL",
    "CHIUDI": "CLOSE",
    "Sviluppato in Italia.": "Developed in Italy.",
    "NETWORK": "NETWORK",
    "Progetti & Giochi": "Projects & Games",
    "Lo Studio": "The Studio",
    "Kripix Launcher": "Kripix Launcher",
    "ARCHIVI": "ARCHIVES",
    "Dossier E.U.L.A.": "E.U.L.A. Dossier",
    "Privacy Policy": "Privacy Policy",
    "Policy DRM": "DRM Policy",
    "Domande Frequenti": "Frequently Asked Questions",
    "CONNESSIONI": "CONNECTIONS",
    "Discord Server": "Discord Server",
    "Twitter / X": "Twitter / X",
    "YouTube": "YouTube",
    "Tutti i diritti riservati.": "All rights reserved.",

    // ── Index (Home) ────────────────────────────────────────
    "I Nostri Giochi": "Our Games",
    "La Nostra Visione": "Our Vision",
    ">> Intercettazione segnali di rete...": ">> Intercepting network signals...",
    ">> Nessuna comunicazione attiva.": ">> No active communications.",

    // ── Studio (Chi Siamo) ──────────────────────────────────
    "LO STUDIO": "THE STUDIO",
    "LA NOSTRA MISSIONE": "OUR MISSION",
    "Da Kripix Entertainment, crediamo che i videogiochi siano la forma d'arte più potente del nostro tempo. Non creiamo semplici passatempi, ma mondi immersivi e atmosfere dense che sfidano l'intelletto.": "At Kripix Entertainment, we believe video games are the most powerful art form of our time. We don't create simple pastimes, but immersive worlds and dense atmospheres that challenge the intellect.",
    "I 4 PILASTRI": "THE 4 PILLARS",
    "01. ATMOSFERA È REGINA": "01. ATMOSPHERE IS QUEEN",
    "Non è un contorno, è il fondamento. Ogni ombra, ogni suono deve servire a costruire un mondo credibile.": "It is not a background element, it is the foundation. Every shadow, every sound must serve to build a credible world.",
    "02. IL GAMEPLAY HA UN SENSO": "02. GAMEPLAY HAS MEANING",
    "Rifiutiamo le meccaniche inutili. Le azioni del giocatore devono avere conseguenze tangibili.": "We reject pointless mechanics. The player's actions must have tangible consequences.",
    "03. NARRAZIONE INTERATTIVA": "03. INTERACTIVE NARRATIVE",
    "Non ci limitiamo a raccontare una storia; diamo al giocatore gli strumenti per scoprirla.": "We don't just tell a story; we give the player the tools to uncover it.",
    "04. QUALITÀ SULLA QUANTITÀ": "04. QUALITY OVER QUANTITY",
    "Preferiamo creare 10 ore indimenticabili piuttosto che 100 ore di contenuti ripetitivi.": "We prefer to create 10 unforgettable hours rather than 100 hours of repetitive content.",

    // ── Contatti ─────────────────────────────────────────────
    "PARLA CON NOI": "TALK TO US",
    "INFO": "INFO",
    "Siamo sempre alla ricerca di collaboratori, feedback o opportunità di publishing.": "We are always looking for collaborators, feedback, or publishing opportunities.",
    "NOME IN CODICE / NOME": "CODENAME / NAME",
    "Il tuo nome": "Your name",
    "EMAIL": "EMAIL",
    "latua@email.com": "your@email.com",
    "MESSAGGIO / DOSSIER": "MESSAGE / DOSSIER",
    "Scrivi qui il tuo feedback o richiesta...": "Write your feedback or request here...",
    "TRASMETTI DATI": "TRANSMIT DATA",
    "RISPOSTA IMMEDIATA": "INSTANT ANSWER",
    "Account, acquisti, chiavi e launcher: le domande più comuni hanno già una risposta pronta.": "Account, purchases, keys and launcher: the most common questions already have an answer waiting.",
    "VAI ALLE FAQ": "GO TO THE FAQ",

    // ── Progetti & Pagoda ───────────────────────────────────
    "CATALOGO PROGETTI": "PROJECT CATALOG",
    "IL FILO DEL DUBBIO": "A THREAD OF DOUBT",
    "IN SVILUPPO | PC | 2026": "IN DEVELOPMENT | PC | 2026",
    "Un thriller noir psicologico dove ogni fallimento investigativo rende i tuoi nemici più forti. Harrow ti aspetta.": "A psychological noir thriller where every investigative failure makes your enemies stronger. Harrow awaits.",
    "Edizione Standard": "Standard Edition",
    "MIGLIORE OFFERTA": "BEST VALUE",
    "Include DELUXE EDITION": "Includes DELUXE EDITION",
    "(Soundtrack + Artbook + Skin)": "(Soundtrack + Artbook + Skin)",
    "Acquista Ora": "Buy Now",
    "Key Steam Inclusa • 100% Supporto Sviluppatori": "Steam Key Included • 100% Developer Support",
    "ANNUNCIO": "ANNOUNCEMENT",
    "PROGETTO SEGRETO": "CLASSIFIED PROJECT",
    "PRE-PRODUZIONE": "PRE-PRODUCTION",
    "Un nuovo capitolo nell'universo Kripix.": "A new chapter in the Kripix universe.",
    "Realismo Sporco Noir": "Dirty Noir Realism",
    "1973. Harrow non è solo un'ambientazione, è un personaggio antagonista. Una città avvolta da pioggia incessante, nebbia e decadenza morale.": "1973. Harrow isn't just a setting, it's an antagonistic character. A city shrouded in relentless rain, fog, and moral decay.",
    "ACQUISICI LICENZA": "ACQUIRE LICENSE",
    "IL CERVELLO E I MUSCOLI": "BRAINS AND BRAWN",
    "Vestirai i panni di William Joshmite Holloway, un detective \"Double-Face\". Incredibilmente intelligente nelle deduzioni e nella manipolazione psicologica, ma goffo e disperato nel combattimento corpo a corpo. La tua mira trema, i pugni sono pesanti, ogni rissa può essere l'ultima.": "You will play as William Joshmite Holloway, a 'Two-Faced' detective. Incredibly intelligent in deductions and psychological manipulation, but clumsy and desperate in hand-to-hand combat. Your aim shakes, your punches are heavy, every brawl could be your last.",
    "L'IA DIRETTORE": "THE AI DIRECTOR",
    "Il gioco rifiuta le convenzioni arcade. Non esiste \"Detective Vision\". Se fallisci un minigioco deduttivo, il mondo reagisce: i nemici entrano in allerta, piazzano trappole sonore e ti braccano. L'IA impara il tuo stile: troppo stealth? Aggiungeranno telecamere. Troppo aggressivo? Arriveranno i Bruti.": "The game rejects arcade conventions. There is no 'Detective Vision'. If you fail a deductive minigame, the world reacts: enemies go on high alert, set sound traps, and hunt you down. The AI learns your style: too stealthy? They'll add cameras. Too aggressive? The Brutes will arrive.",
    "I LUOGOTENENTI DI RUSSO": "RUSSO'S LIEUTENANTS",
    "Quattro ostacoli mortali prima del Don.": "Four deadly obstacles before the Don.",
    "Il Macellaio": "The Butcher",
    "Forza Bruta": "Brute Force",
    "Sadico e spietato. Una lotta puramente viscerale nei sotterranei dei rulli trasportatori.": "Sadistic and ruthless. A purely visceral fight in the conveyor belt underground.",
    "Il Ragioniere": "The Accountant",
    "Intelletto Paranoico": "Paranoid Intellect",
    "Arthur Finch combatte con le trappole al buio. Per ucciderlo, dovrai distruggere il suo ego.": "Arthur Finch fights with traps in the dark. To kill him, you must destroy his ego.",
    "Il Fantasma": "The Ghost",
    "Perfezione Letale": "Lethal Perfection",
    "Angelo Conti. Un duello al buio basato sull'audio 3D. Un'arte marziale letale, una morte rispettosa.": "Angelo Conti. A duel in the dark based on 3D audio. A lethal martial art, a respectful death.",
    "Il Re del Passato": "The King of the Past",
    "Il Don. La resa dei conti sotto la pioggia nel fango, dove la verità sarà più letale dei proiettili.": "The Don. The showdown in the rain and mud, where the truth will be deadlier than bullets.",
    "LA CRITICA": "CRITICAL ACCLAIM",
    "Classificazione: Capolavoro Assoluto": "Classification: Absolute Masterpiece",
    ">> PROTOCOLLO DI SISTEMA RICHIESTO (PIXEL OTROS ENGINE)": ">> REQUIRED SYSTEM PROTOCOL (PIXEL OTROS ENGINE)",
    "MINIMI": "MINIMUM",
    "RACCOMANDATI": "RECOMMENDED",
    "[SSD NVMe OBBLIGATORIO]": "[NVMe SSD MANDATORY]",
    "[SSD Gen4 NVMe]": "[Gen4 NVMe SSD]",
    "IL FILO DEL DUBBIO - DELUXE EDITION": "A THREAD OF DOUBT - DELUXE EDITION",
    "Include OST Industrial Jazz e Artbook Digitale.": "Includes Industrial Jazz OST and Digital Artbook.",
    "(No DRM)": "(No DRM)",

    // ── Download ─────────────────────────────────────────────
    "KRIPIX LAUNCHER": "KRIPIX LAUNCHER",
    "Il tuo portale per Harrow e oltre.": "Your portal for Harrow and beyond.",
    "Rilevato": "Detected",
    "SCARICA .EXE": "DOWNLOAD .EXE",
    "SCARICA .DMG": "DOWNLOAD .DMG",
    "Grazie! Il download è iniziato.": "Thank you! The download has started.",
    "SCARICANDO...": "DOWNLOADING...",
    "GRAZIE!": "THANK YOU!",
    "Aggiornamenti Rapidi": "Fast Updates",
    "Ultima versione sempre disponibile.": "Latest version always available.",
    "Cloud Save": "Cloud Save",
    "Progressi al sicuro nel cloud.": "Progress safely stored in the cloud.",
    "Bonus Esclusivi": "Exclusive Bonuses",
    "Contenuti extra per gli utenti.": "Extra content for users.",
    "ACCESSO SVILUPPATORI": "DEVELOPER ACCESS",
    "FORGIARE LA REALTÀ": "FORGING REALITY",
    "Non cerchiamo creatori di giochi. Cerchiamo architetti di mondi. Scopri Pixel Otros, il nostro motore proprietario basato su streaming SSD e rendering Nanovoxel.": "We don't look for game creators. We look for world architects. Discover Pixel Otros, our proprietary engine based on SSD streaming and Nanovoxel rendering.",
    "ENTRA NEL PROGRAMMA DEV": "JOIN THE DEV PROGRAM",

    // ── Engine ───────────────────────────────────────────────
    "DEVELOPER KIT[ALPHA]": "DEVELOPER KIT[ALPHA]",
    "The Ultimate Storytelling Engine.": "The Ultimate Storytelling Engine.",
    "ATTENZIONE: ARCHITETTURA AD ALTO COSTO": "WARNING: HIGH-COST ARCHITECTURE",
    "Pixel Otros non è progettato per la scalabilità. Utilizza una tecnologia di Streaming SSD Diretto che bypassa la RAM di sistema per caricare texture non compresse. Questo motore è creato per un solo scopo: Iper-Realismo Narrativo.": "Pixel Otros is not designed for scalability. It uses Direct SSD Streaming technology that bypasses system RAM to load uncompressed textures. This engine is created for a single purpose: Narrative Hyper-Realism.",
    "Le texture vengono lette direttamente dall'NVMe.": "Textures are read directly from the NVMe.",
    "Geometria infinita. Niente più LOD.": "Infinite geometry. No more LODs.",
    "Raytracing pathtraced completo.": "Full path-traced raytracing.",
    "LICENZA D'USO": "END USER LICENSE AGREEMENT",
    "Leggi attentamente i termini. Pixel Otros è software proprietario.": "Read the terms carefully. Pixel Otros is proprietary software.",
    "Ho letto, compreso e accetto di sacrificare le mie prestazioni per il realismo.": "I have read, understood, and agree to sacrifice my performance for realism.",
    "SCARICA SDK (45 GB)": "DOWNLOAD SDK (45 GB)",
    "INIZIALIZZAZIONE...": "INITIALIZING...",
    "WORKSTATION RICHIESTA": "WORKSTATION REQUIRED",
    "Installazione non supportata su architettura mobile.": "Installation not supported on mobile architecture.",

    // ── Login, Register, Reset, Verify ──────────────────────
    "ACCESSO": "SYSTEM ACCESS",
    "E-MAIL": "E-MAIL",
    "PASSWORD": "PASSWORD",
    "Rimani connesso": "Stay connected",
    "Password dimenticata?": "Forgot password?",
    "VERIFICA CREDENZIALI": "VERIFY CREDENTIALS",
    "OPPURE": "OR",
    "Accedi con Google": "Sign in with Google",
    "Non possiedi un Kripix ID?": "Don't have a Kripix ID?",
    "CREA NUOVO ACCOUNT": "CREATE NEW ACCOUNT",
    "NUOVO AGENTE": "NEW AGENT",
    "INIZIALIZZAZIONE PROTOCOLLO CLOUD": "CLOUD PROTOCOL INITIALIZATION",
    "EMAIL OPERATIVA": "OPERATIONAL EMAIL",
    "NOME IN CODICE (USERNAME)": "CODENAME (USERNAME)",
    "PASSWORD (Min 8 car. + 1 Numero)": "PASSWORD (Min 8 char. + 1 Number)",
    "CONFERMA PASSWORD": "CONFIRM PASSWORD",
    "CREA ACCOUNT": "CREATE ACCOUNT",
    "Hai già un ID?": "Already have an ID?",
    "RIPRISTINO CHIAVE": "KEY RESTORATION",
    "Verifica del canale crittografato in corso...": "Verifying encrypted channel...",
    "Inserisci la tua email operativa. Ti invieremo un link crittografato per resettare la password.": "Enter your operational email. We will send an encrypted link to reset your password.",
    "NUOVA PASSWORD (Min 8 car. + 1 Numero)": "NEW PASSWORD (Min 8 char. + 1 Number)",
    "CONFERMA NUOVA PASSWORD": "CONFIRM NEW PASSWORD",
    "AGGIORNA CREDENZIALI": "UPDATE CREDENTIALS",
    "BENVENUTO, AGENTE": "WELCOME, AGENT",
    "Identità Google verificata. Scegli il tuo nome in codice per completare il reclutamento.": "Google identity verified. Choose your codename to complete recruitment.",
    "COMPLETA REGISTRAZIONE": "COMPLETE REGISTRATION",
    "VERIFICA IN CORSO": "VERIFICATION IN PROGRESS",
    ">> Decrittazione del token...": ">> Decrypting token...",
    "ACCEDI AL TERMINALE": "ACCESS TERMINAL",

    // ── Profilo ─────────────────────────────────────────────
    "Il mio Profilo": "My Profile",
    "LIVELLO 1": "LEVEL 1",
    "AGENTE": "AGENT",
    "ID DATABASE": "DATABASE ID",
    "STATO": "STATUS",
    "ATTIVO": "ACTIVE",
    "GIOCHI": "GAMES",
    "DATA REG.": "REG. DATE",
    "MODIFICA DATI & AVATAR": "EDIT DATA & AVATAR",
    "ESPERIENZA OPERATIVA": "OPERATIONAL EXPERIENCE",
    "MEDAGLIERE & OBIETTIVI": "AWARDS & OBJECTIVES",
    "RECLUTA": "RECRUIT",
    "DETECTIVE": "DETECTIVE",
    "BETA TESTER": "BETA TESTER",
    "GOLD MEMBER": "GOLD MEMBER",
    "RETE OPERATIVA": "OPERATIONAL NETWORK",
    "CERCA E INVIA": "SEARCH AND SEND",
    "PROGRAMMA PIXEL OTROS": "PIXEL OTROS PROGRAM",
    "> Accesso al motore grafico sperimentale.": "> Access to the experimental graphics engine.",
    "SCARICA DEV-KIT": "DOWNLOAD DEV-KIT",
    "LOG ATTIVITÀ RECENTI": "RECENT ACTIVITY LOG",
    ">  [OGGI] Accesso al terminale effettuato.": ">   [TODAY] Terminal access granted.",
    "> [SISTEMA] Acquisizione licenza \"Harrow\".": "> [SYSTEM] \"Harrow\" license acquired.",
    "> [SYSTEM] Profilo sincronizzato con il server centrale.": "> [SYSTEM] Profile synchronized with central server.",
    "INTERROMPI CONNESSIONE": "SEVER CONNECTION",
    "RIMUOVI": "REMOVE",
    "INTEGRAZIONE DISCORD": "DISCORD INTEGRATION",
    "> Sincronizza il tuo Dossier per ottenere i ruoli sul server.": "> Sync your Dossier to get roles on the server.",
    "COLLEGA ACCOUNT": "LINK ACCOUNT",
    "Collegato come: ": "Connected as: ",
    "> ATTIVO (ONLINE)": "> ACTIVE (ONLINE)",
    "Reclutamento completato con successo.": "Recruitment completed successfully.",
    "Stai per rimuovere l'Agente": "You are about to remove the Agent",
    "dalla tua rete.": "from your network.",
    "Questa azione è irreversibile.": "This action is irreversible.",
    "ACCETTA": "ACCEPT",
    "RIFIUTA": "DECLINE",
    "ANNULLA INVIO": "CANCEL REQUEST",
    ">> IN ATTESA DI RISPOSTA": ">> AWAITING RESPONSE",
    ">> RICHIESTA CONNESSIONE": ">> CONNECTION REQUEST",
    "FOTOREPORTER": "PHOTOREPORTER",
    // Chiave dedicata: "ACCEDI" nella navbar significa "LOGIN", qui è
    // il badge che apre il terminale. Due traduzioni, due chiavi.
    "profilo_badge_accedi": "ACCESS",

    // ── Impostazioni ────────────────────────────────────────
    "CONFIGURAZIONE": "CONFIGURATION",
    "PROFILO AGENTE": "AGENT PROFILE",
    "PRIVACY & DATI": "PRIVACY & DATA",
    "DOCUMENTAZIONE": "DOCUMENTATION",
    "IDENTITÀ AGENTE": "AGENT IDENTITY",
    "NOME IN CODICE": "CODENAME",
    "MODIFICA ID": "EDIT ID",
    "EMAIL REGISTRATA": "REGISTERED EMAIL",
    "AGGIORNA MAIL": "UPDATE MAIL",
    "ID VISIVO (AVATAR)": "VISUAL ID (AVATAR)",
    "LICENZE ESTERNE": "EXTERNAL LICENSES",
    "RISCATTO CODICE GIOCO": "REDEEM GAME CODE",
    "Attiva una licenza acquistata presso fornitori di terze parti (Steam, Retail).": "Activate a license purchased from third-party vendors (Steam, Retail).",
    "INSERISCI CHIAVE": "ENTER KEY",
    "SICUREZZA": "SECURITY",
    "CODICE D'ACCESSO": "ACCESS CODE",
    "MODIFICA PASSWORD": "CHANGE PASSWORD",
    "VERIFICA IN DUE PASSAGGI": "TWO-STEP VERIFICATION",
    "Aggiunge un secondo lucchetto all'account: oltre alla password serve un codice a 6 cifre generato dalla tua app di autenticazione, che cambia ogni 30 secondi.": "Adds a second lock to your account: on top of the password you need a 6-digit code from your authenticator app, refreshed every 30 seconds.",
    "ATTIVA PROTEZIONE": "TURN ON PROTECTION",
    "DISATTIVA": "TURN OFF",
    // "ATTIVA" / "NON ATTIVA" sono definite più sotto, nel blocco beta:
    // stessa parola, stesso significato, una sola voce per entrambi gli usi.
    "NON ATTIVA": "INACTIVE",
    "CONFERMA LA TUA IDENTITÀ": "CONFIRM YOUR IDENTITY",
    "Prima di aggiungere un secondo fattore dobbiamo essere sicuri che sia davvero tu.": "Before adding a second factor we need to be sure it is really you.",
    "Il tuo account usa l'accesso Google: si aprirà una finestra per confermare.": "Your account uses Google sign-in: a window will open for you to confirm.",
    "PROSEGUI": "CONTINUE",
    "COLLEGA L'APP": "CONNECT THE APP",
    "Non puoi inquadrarlo? Inserisci la chiave a mano:": "Can't scan it? Enter the key manually:",
    "HO COLLEGATO L'APP": "THE APP IS CONNECTED",
    "INSERISCI IL CODICE": "ENTER THE CODE",
    "Digita le 6 cifre che vedi nell'app. Cambiano ogni 30 secondi.": "Type the 6 digits shown in the app. They change every 30 seconds.",
    "PROTEZIONE ATTIVA": "PROTECTION ACTIVE",
    "Da adesso, a ogni accesso ti verrà chiesto il codice a 6 cifre.": "From now on, every sign-in will ask for the 6-digit code.",
    "Tieni l'app installata e, se puoi, salva la chiave in un posto sicuro: perdere il telefono senza backup significa perdere l'accesso all'account.": "Keep the app installed and, if you can, store the key somewhere safe: losing your phone without a backup means losing access to the account.",
    "HO CAPITO": "GOT IT",
    "DISATTIVA LA PROTEZIONE": "TURN OFF PROTECTION",
    "L'account tornerà protetto dalla sola password. Conferma la tua identità per procedere.": "The account will go back to password-only protection. Confirm your identity to continue.",
    "Inserisci il codice dell'app per confermare.": "Enter the code from your app to confirm.",
    "Apri la tua app di autenticazione e inserisci il codice a 6 cifre.": "Open your authenticator app and enter the 6-digit code.",
    "ZONA ROSSA": "RED ZONE",
    "L'eliminazione è irreversibile.": "Deletion is irreversible.",
    "ELIMINA ACCOUNT": "DELETE ACCOUNT",
    "CONTROLLO DATI & TELEMETRIA": "DATA & TELEMETRY CONTROL",
    "VISIBILITÀ RETE": "NETWORK VISIBILITY",
    "Permetti ad altri agenti di trovarti tramite la barra di ricerca.": "Allow other agents to find you via the search bar.",
    "MODALITÀ FANTASMA": "GHOST MODE",
    "Appari sempre offline a tutta la rete.": "Always appear offline to the entire network.",
    "CONDIVISIONE TELEMETRIA": "TELEMETRY SHARING",
    "Invia dati di crash e performance a Kripix.": "Send crash and performance data to Kripix.",
    "COMUNICAZIONI STUDIO": "STUDIO COMMUNICATIONS",
    "Ricevi aggiornamenti e inviti per le Beta via Email.": "Receive updates and Beta invites via Email.",
    "ARCHIVIO LEGALE": "LEGAL ARCHIVES",
    "Consulta le direttive operative e legali del Kripix Network.": "Consult the operational and legal directives of the Kripix Network.",
    "Gestione Cookie": "Cookie Management",
    "AGGIORNA ID AGENTE": "UPDATE AGENT ID",
    "AGGIORNA CANALE (EMAIL)": "UPDATE CHANNEL (EMAIL)",
    "INVIA VERIFICA": "SEND VERIFICATION",
    "AGGIORNA PASSWORD": "UPDATE PASSWORD",
    "AGGIORNA": "UPDATE",
    "CONFERMA ELIMINAZIONE": "CONFIRM DELETION",
    "CONFERMA": "CONFIRM",
    "OPERAZIONE RIUSCITA": "OPERATION SUCCESSFUL",
    "Dati aggiornati correttamente.": "Data updated successfully.",
    "ATTIVAZIONE LICENZA": "LICENSE ACTIVATION",
    "Inserisci il codice criptato a 16 o 20 cifre.": "Enter the 16 or 20 digit encrypted code.",
    "DECRIPTA CHIAVE": "DECRYPT KEY",

    // ── Libreria ────────────────────────────────────────────
    "ARCHIVIO PERSONALE": "PERSONAL ARCHIVE",
    "Licenze attive e software assegnato.": "Active licenses and assigned software.",
    "NESSUNA LICENZA TROVATA": "NO LICENSE FOUND",
    "Non hai ancora acquistato software Kripix.": "You haven't purchased Kripix software yet.",
    "VAI ALLO STORE": "GO TO STORE",
    "SCELTA PIATTAFORMA": "PLATFORM SELECTION",
    "Seleziona il sistema operativo per avviare il download.": "Select the operating system to start the download.",
    "● LICENZA ATTIVA": "● ACTIVE LICENSE",
    "INSTALLA": "INSTALL",
    "ACQUISTO COMPLETATO": "PURCHASE COMPLETED",
    "VAI ALLA LIBRERIA": "GO TO LIBRARY",
    "Resta Qui": "Stay Here",
    "SCARICA PDF": "DOWNLOAD PDF",
    "Visualizza Ricevuta": "View Receipt",
    "Copia Chiave": "Copy Key",

    // ── Admin ───────────────────────────────────────────────
    "TERMINALE OVERSEER": "OVERSEER TERMINAL",
    "Accesso di Livello 5. Autorizzazione concessa.": "Level 5 Access. Authorization granted.",
    "AGENTI REGISTRATI": "REGISTERED AGENTS",
    "LICENZE \"HARROW\"": "\"HARROW\" LICENSES",
    "CHIAVI VERGINI": "BLANK KEYS",
    "BROADCAST DI RETE": "NETWORK BROADCAST",
    "Priorità: NORMALE": "Priority: NORMAL",
    "Priorità: ALTA": "Priority: HIGH",
    "TRASMETTI NEL NETWORK": "BROADCAST TO NETWORK",
    "STORICO COMUNICAZIONI": "COMMUNICATIONS HISTORY",
    ">> VERIFICA CREDENZIALI OVERSEER IN CORSO...": ">> VERIFYING OVERSEER CREDENTIALS...",

    // ── 404 & Auth-Action ───────────────────────────────────
    "DOSSIER SCONOSCIUTO": "UNKNOWN DOSSIER",
    "Il percorso che stai cercando di seguire non esiste o è stato cancellato.": "The path you are trying to follow does not exist or has been deleted.",
    "Non c'è nulla da vedere qui, Agente.": "There's nothing to see here, Agent.",
    ">> ANALISI SEGNALE CRITTOGRAFATO IN CORSO...": ">> ANALYZING ENCRYPTED SIGNAL...",

    // ── Terminale ───────────────────────────────────────────
    "> CANALI CRITTOGRAFATI_": "> ENCRYPTED CHANNELS_",
    "Sincronizzazione contatti in corso...": "Syncing contacts...",
    "SELEZIONA UN CANALE OPERATIVO": "SELECT AN OPERATIVE CHANNEL",
    "Agente Sconosciuto": "Unknown Agent",
    "Stato Sconosciuto": "Unknown Status",
    "Scrivi un messaggio crittografato...": "Write an encrypted message...",
    "INVIA": "SEND",
    "[ PROTOCOLLO A SENSO UNICO ] Impossibile trasmettere al livello 5.": "[ ONE-WAY PROTOCOL ] Cannot transmit to level 5.",
    "Nessun contatto disponibile.": "No contacts available.",
    "Canale Diretto": "Direct Channel",
    "Online": "Online",
    "Offline": "Offline",
    "[ INIZIO TRASMISSIONE SECURA ]": "[ SECURE TRANSMISSION START ]",
    "> CONSEGNATO": "> DELIVERED",
    "> LETTO": "> READ",
    "Adesso": "Now",

    // ── FAQ / Centro Assistenza ─────────────────────────────
    "CENTRO ASSISTENZA": "HELP CENTER",
    "Domande frequenti, guide rapide e istruzioni operative.": "FAQs, quick guides and operational instructions.",
    "PRIMI PASSI": "FIRST STEPS",
    "Guide rapide": "Quick guides",
    "ARCHIVIO RISPOSTE": "ANSWER ARCHIVE",
    "Domande frequenti": "Frequently asked questions",

    // Guide rapide
    "Creare un account": "Create an account",
    "Apri la pagina di registrazione e inserisci la tua email.": "Open the registration page and enter your email.",
    "Scegli un Nome in Codice unico, senza spazi.": "Pick a unique Codename, with no spaces.",
    "Imposta una password di almeno 8 caratteri con un numero.": "Set a password of at least 8 characters including a number.",
    "Conferma il link di verifica che ricevi via email e accedi.": "Confirm the verification link you receive by email, then log in.",
    "Crea il tuo Kripix ID →": "Create your Kripix ID →",
    "Acquistare un gioco": "Buy a game",
    "Accedi con il tuo Kripix ID: la licenza viene legata all'account.": "Sign in with your Kripix ID: the license is tied to the account.",
    "Apri il catalogo e scegli l'edizione che preferisci.": "Open the catalog and choose the edition you prefer.",
    "Completa il pagamento sul terminale protetto da Stripe.": "Complete the payment on the terminal secured by Stripe.",
    "Trovi subito gioco e chiave nella tua Libreria.": "Game and key appear in your Library right away.",
    "Vai al catalogo →": "Go to the catalog →",
    "Installare il launcher": "Install the launcher",
    "Vai alla pagina di download: il sistema operativo viene riconosciuto da solo.": "Go to the download page: your operating system is detected automatically.",
    "Scarica il file .exe su Windows oppure .dmg su macOS.": "Download the .exe on Windows or the .dmg on macOS.",
    "Avvia l'installazione e apri il Kripix Launcher.": "Run the installer and open the Kripix Launcher.",
    "Accedi con il tuo Kripix ID: la libreria si sincronizza da sola.": "Sign in with your Kripix ID: your library syncs on its own.",
    "Scarica il launcher →": "Download the launcher →",
    "Riscattare una chiave": "Redeem a key",
    "Entra in Configurazione dal menu del tuo avatar.": "Open Settings from your avatar menu.",
    "Apri la sezione Licenze Esterne.": "Go to the External Licenses section.",
    "Premi Inserisci Chiave e digita il codice.": "Press Enter Key and type your code.",
    "Il gioco compare nella Libreria dopo la verifica.": "The game appears in your Library once verified.",
    "Apri la configurazione →": "Open settings →",
    "Proteggere l'account": "Protect your account",
    "In Configurazione apri la sezione Sicurezza.": "In Settings, open the Security section.",
    "Attiva la Verifica in Due Passaggi e conferma la password.": "Turn on Two-Step Verification and confirm your password.",
    "Inquadra il QR con la tua app di autenticazione.": "Scan the QR code with your authenticator app.",
    "Digita il codice a 6 cifre per completare l'attivazione.": "Type the 6-digit code to finish activation.",
    "Attiva la 2FA →": "Turn on 2FA →",
    "Recuperare l'accesso": "Recover your access",
    "Nella pagina di accesso premi Password dimenticata.": "On the login page press Forgot password.",
    "Inserisci l'email con cui ti sei registrato.": "Enter the email you registered with.",
    "Apri il link che ricevi, controllando anche lo Spam.": "Open the link you receive, checking your Spam folder too.",
    "Imposta la nuova password e rientra nel network.": "Set the new password and get back on the network.",
    "Recupera la password →": "Reset your password →",

    // Ricerca e filtri
    "Cerca una risposta...": "Search for an answer...",
    "Tutte": "All",
    "Account": "Account",
    "Acquisti": "Purchases",
    "Launcher": "Launcher",
    "Tecnico": "Technical",
    ">> NESSUN RISULTATO NELL'ARCHIVIO": ">> NO RESULTS IN THE ARCHIVE",
    "Prova con parole diverse oppure scrivici: rispondiamo noi.": "Try different words, or just write to us: we answer personally.",
    "Non hai trovato la risposta?": "Didn't find your answer?",
    "Nessun problema: scrivici e ti rispondiamo direttamente.": "No problem: get in touch and we'll answer you directly.",
    "Chiedi su Discord": "Ask on Discord",
    "Scrivi allo studio": "Write to the studio",

    // Domande
    "Come creo un account Kripix?": "How do I create a Kripix account?",
    "Ho dimenticato la password, cosa faccio?": "I forgot my password, what now?",
    "Posso cambiare Nome in Codice o email?": "Can I change my Codename or email?",
    "Non ricevo l'email di verifica.": "I'm not receiving the verification email.",
    "Come elimino definitivamente il mio account?": "How do I permanently delete my account?",
    "Come acquisto un gioco sul Kripix Store?": "How do I buy a game on the Kripix Store?",
    "Quali metodi di pagamento sono accettati?": "Which payment methods do you accept?",
    "Che differenza c'è tra comprare qui e su Steam?": "What's the difference between buying here and on Steam?",
    "Dove trovo la mia chiave e la ricevuta?": "Where do I find my key and receipt?",
    "Ho una chiave comprata altrove: come la attivo?": "I have a key bought elsewhere: how do I activate it?",
    "Posso chiedere un rimborso?": "Can I request a refund?",
    "Come installo il Kripix Launcher?": "How do I install the Kripix Launcher?",
    "Il sistema dice che l'app non è verificata.": "My system says the app is not verified.",
    "I miei salvataggi sono al sicuro?": "Are my saves safe?",
    "Il launcher è disponibile per Linux o mobile?": "Is the launcher available for Linux or mobile?",
    "Quali sono i requisiti di sistema?": "What are the system requirements?",
    "Quali dati raccogliete su di me?": "What data do you collect about me?",
    "Come contatto il supporto?": "How do I contact support?",
    "Come attivo la verifica in due passaggi?": "How do I turn on two-step verification?",
    "Ho perso il telefono con l'app di autenticazione.": "I lost the phone with my authenticator app.",

    // Risposte (contengono markup: vedi data-i18n-html)
    "faq_a_crea_account": "Go to <a href=\"register.html\">Create new account</a>, enter your email, pick a unique Codename (no spaces) and a password of at least 8 characters including a number. A verification email will arrive: until you confirm it, access stays locked.",
    "faq_a_crea_account_2": "You can also use <strong>Sign in with Google</strong>. Even then you will be asked to choose a Codename to complete recruitment: skip that step and the account stays incomplete, so you won't be able to get in.",
    "faq_a_password": "On the <a href=\"login.html\">login</a> page press <strong>Forgot password?</strong> and enter your email: you will receive a link to set a new one. If you don't see it within a few minutes, check your Spam or Promotions folder.",
    "faq_a_modifica_id": "Yes. Open <a href=\"impostazioni.html\">Settings</a> and go to <strong>Agent Identity</strong>. The Codename must be unique on the network and cannot contain spaces. If you change your email, a new verification is sent to the new address.",
    "faq_a_verifica_mail": "Check Spam and Promotions first: automated messages often end up there. If nothing arrives after a few minutes, try logging in again — the system resends the verification email automatically. If it still fails, write to us and we will activate it by hand.",
    "faq_a_elimina_account": "From <a href=\"impostazioni.html\">Settings</a> → <strong>Red Zone</strong> → Delete Account. Your current password will be requested as confirmation.",
    "faq_a_elimina_account_2": "The action cannot be undone: profile, purchased licenses, keys and contact network are all wiped. If you need your receipts, download them as PDF from the Library first.",
    "faq_a_acquisto": "Sign in with your Kripix ID, open the <a href=\"progetti.html\">catalog</a>, pick a game and press <strong>Buy now</strong>. You will be taken to the payment terminal secured by Stripe.",
    "faq_a_acquisto_2": "Once the payment goes through, the license is assigned immediately: you will find it in your <a href=\"libreria.html\">Library</a> along with the activation key and the receipt.",
    "faq_a_pagamenti": "Payments run through Stripe and accept credit and debit cards, Apple Pay, Google Pay and PayPal. Displayed prices already include VAT. Your card details never pass through our servers.",
    "faq_a_store_vs_steam": "The price is the same, but on the Kripix Store you get the <strong>Deluxe Edition</strong> — digital artbook, dossier and extra filters — and the full revenue stays with the studio. Steam carries the standard edition.",
    "faq_a_chiave": "Both live in your <a href=\"libreria.html\">Library</a>, on the game card: the key icon copies the code to your clipboard, the document icon opens the receipt, which you can also download as a PDF.",
    "faq_a_riscatto": "Open <a href=\"impostazioni.html\">Settings</a> → <strong>External Licenses</strong> → Enter key. The format is <code>KRPX-XXXX-XXXX-XXXX</code>. After verification the game shows up in your Library: each key can be redeemed only once.",
    "faq_a_rimborso": "Write to <a href=\"mailto:info@kripix.com\">info@kripix.com</a> with your account email and the purchase date. We review every request within the limits of European law on the right of withdrawal for digital content: a key that has already been redeemed cannot be refunded.",
    "faq_a_installa_launcher": "From the <a href=\"download.html\">Download App</a> page: the site detects your system and highlights the right build. Grab the <code>.exe</code> on Windows or the <code>.dmg</code> on macOS, finish the install and open the launcher.",
    "faq_a_installa_launcher_2": "On first launch, sign in with the same Kripix ID you use on the site: your library and licenses sync by themselves.",
    "faq_a_app_non_verificata": "This happens with software from independent studios until it gathers enough downloads. On Windows press <strong>More info → Run anyway</strong>; on macOS right-click the app and choose <strong>Open</strong>.",
    "faq_a_app_non_verificata_2": "Only download the launcher from the official page: we do not distribute the program through third-party sites.",
    "faq_a_salvataggi": "Yes. While you are online, progress is uploaded to the cloud and tied to your Kripix ID, so you find it again on any computer. If you play offline the save stays local and syncs the next time you connect.",
    "faq_a_linux": "Not at the moment. The launcher runs on 64-bit Windows 10 and 11 and on macOS (Apple Silicon and Intel). There is no phone or tablet version: our games need a workstation.",
    "faq_a_requisiti": "Every game lists minimum and recommended requirements on its own page. The one hard rule is the <strong>NVMe SSD</strong>: the Pixel Otros engine streams textures straight off the drive, so on a mechanical hard disk the game will not run properly.",
    "faq_a_privacy": "Only what the account needs in order to work: email, Codename, licenses and contact list. Crash and performance telemetry is optional and can be switched off in <a href=\"impostazioni.html\">Settings</a> → Privacy &amp; Data. Full details are in the <a href=\"cookies.html\">Privacy Dossier</a>.",
    "faq_a_supporto": "The fastest channel is our <a href=\"https://discord.gg/FwwuYJ4Dn3\" target=\"_blank\" rel=\"noopener noreferrer\">Discord server</a>, where we usually reply the same day. Otherwise use the form on the <a href=\"contatti.html\">Contact</a> page or write to <a href=\"mailto:info@kripix.com\">info@kripix.com</a>.",
    "faq_a_2fa": "Open <a href=\"impostazioni.html#sicurezza\">Settings → Security</a> and press <strong>Turn on protection</strong>. Once you confirm your password we show you a QR code: scan it with your authenticator app (Google Authenticator, Authy, 1Password and Bitwarden all work) and type the 6-digit code it displays.",
    "faq_a_2fa_2": "From then on, every sign-in asks for the code as well as the password. The code changes every 30 seconds and is generated on your phone: we never send it by email or SMS.",
    "faq_a_2fa_perso": "If you saved the key we showed you during setup, enter it in a new authenticator app and it will start producing valid codes again.",
    "faq_a_2fa_perso_2": "Without that key it takes a manual check: write to <a href=\"mailto:info@kripix.com\">info@kripix.com</a> <strong>from the account's email address</strong>. We verify your identity before removing the second factor, so expect a few days.",

    // ── Accessi beta & Kripix AI ────────────────────────────
    "ACCESSI BETA": "BETA ACCESS",
    "> Programmi sperimentali riservati agli agenti selezionati.": "> Experimental programs reserved for selected agents.",
    "APRI ELENCO": "OPEN LIST",
    "Funzioni in prova, aperte a pochi agenti per volta.": "Features under test, opened to a few agents at a time.",
    "RICHIEDI ACCESSO": "REQUEST ACCESS",
    "ATTIVA": "ACTIVE",
    "IN ATTESA": "PENDING",
    "NON ACCOLTA": "DECLINED",
    "NON RICHIESTA": "NOT REQUESTED",
    "Accesso concesso. La trovi già attiva dove è prevista.": "Access granted. It is already live wherever it applies.",
    "Richiesta inviata. Ti avvisiamo nel Terminale appena viene valutata.": "Request sent. We'll notify you in the Terminal as soon as it is reviewed.",
    "Questa richiesta non è stata accolta. Puoi riprovare più avanti.": "This request was not accepted. You can try again later.",
    "Candidature chiuse per questo programma.": "Applications are closed for this program.",
    "Assistente di supporto conversazionale": "Conversational support assistant",

    "KRIPIX AI": "KRIPIX AI",
    "RICHIEDI L'ACCESSO": "REQUEST ACCESS",
    "Un assistente che conosce il Network e ti accompagna nel problema. È in beta chiusa: accedi per vedere se hai l'accesso.": "An assistant that knows the Network and walks you through the problem. It is in closed beta: sign in to see whether you have access.",
    "Un assistente che conosce il Network e ti accompagna nel problema. In questo momento è aperto a un gruppo ristretto di agenti.": "An assistant that knows the Network and walks you through the problem. Right now it is open to a small group of agents.",
    "Hai accesso alla beta: trovi l'assistente nel pulsante in basso a destra, su qualsiasi pagina.": "You have beta access: the assistant lives in the button at the bottom right, on any page.",
    "La tua richiesta di accesso è in valutazione. Ti avvisiamo nel Terminale appena viene decisa.": "Your access request is under review. We'll notify you in the Terminal once it is decided.",

    // Widget fluttuante
    "Apri Kripix AI": "Open Kripix AI",
    "Chiudi Kripix AI": "Close Kripix AI",
    "Chiudi": "Close",
    "Messaggio": "Message",
    "Invia": "Send",
    "Scrivi il tuo problema...": "Describe your problem...",
    "Ho perso il telefono con l'app di autenticazione": "I lost the phone with my authenticator app",
    "Il launcher non parte": "The launcher won't start",
    "Non trovo la chiave del gioco": "I can't find my game key",

    // ── Cookie banner ───────────────────────────────────────
    "cookie_title": "> COOKIE INITIALIZATION",
    "cookie_text": "The Kripix Operative Network uses essential tracking packets (Cookies) to keep the connection stable and save your preferences. We do not sell your data to corporates. <br><br>You can read the <a href=\"cookies.html\">Privacy Dossier</a> for full details.",
    "ACCETTA TUTTI": "ACCEPT ALL",
    "SOLO ESSENZIALI": "ESSENTIALS ONLY",

    // ── Placeholder & Form ──────────────────────────────────
    "La tua email...": "Your email...",
    "••••••••": "••••••••",
    "nome@esempio.com": "name@example.com",
    "Scegli il tuo ID": "Choose your ID",
    "Crea password": "Create password",
    "Ripeti password": "Repeat password",
    "Nuova Password (Min 8 + Num)": "New Password (Min 8 + Num)",
    "Vecchia Password": "Old Password",
    "Conferma Nuova Password": "Confirm New Password",
    "Ricerca: Inserire Nome Agente...": "Search: Enter Agent Name...",
    "Nuovo Username...": "New Username...",
    "La tua password attuale...": "Your current password...",
    "La nuova email...": "The new email...",
    "Password attuale": "Current password",
    "Titolo Comunicazione...": "Communication Title...",
    "Testo del messaggio...": "Message text...",
    "URL Destinazione (Opzionale)": "Destination URL (Optional)",
    "KRPX-XXXX-XXXX-XXXX": "KRPX-XXXX-XXXX-XXXX",
    "Nome in Codice Unico...": "Unique Codename...",
    "Inserisci nuova password": "Enter new password",

    // ── Messaggi dinamici JS & Notifiche ────────────────────
    "VERIFICA NEL CLOUD...": "VERIFYING IN CLOUD...",
    "ACCESSO CONSENTITO": "ACCESS GRANTED",
    ">> ERRORE CLOUD: EMAIL O PASSWORD NON VALIDE": ">> CLOUD ERROR: INVALID EMAIL OR PASSWORD",
    ">> AUTORIZZAZIONE IN SOSPESO. Ti abbiamo re-inviato una mail di verifica.": ">> AUTHORIZATION PENDING. We re-sent a verification email.",
    ">> Inserisci un'email valida.": ">> Enter a valid email.",
    "INVIO IN CORSO...": "SENDING...",
    ">> PROTOCOLLO INVIATO. Controlla la casella email (anche nello Spam).": ">> PROTOCOL SENT. Check your email (including Spam).",
    "INVIATO": "SENT",
    ">> ERRORE: Email non trovata o formato non valido.": ">> ERROR: Email not found or invalid format.",
    "INVIA LINK": "SEND LINK",
    "ELABORAZIONE...": "PROCESSING...",
    "GIÀ NELLA LIBRERIA": "ALREADY IN LIBRARY",
    "ERRORE TRANSAZIONE": "TRANSACTION ERROR",
    ">> FASE 1: Creazione dossier nel Cloud...": ">> PHASE 1: Creating dossier in Cloud...",
    ">> FASE 2: Connessione per l'invio mail...": ">> PHASE 2: Connecting for email dispatch...",
    ">> FASE 3: Trasmissione mail di sistema Firebase in corso...": ">> PHASE 3: Firebase system email transmission in progress...",
    ">> PROTOCOLLO COMPLETATO! Controlla la tua casella email (anche nello Spam).": ">> PROTOCOL COMPLETED! Check your email (including Spam).",
    "REGISTRAZIONE COMPLETATA": "REGISTRATION COMPLETED",
    ">> Le password non coincidono.": ">> Passwords do not match.",
    ">> La password è troppo corta.": ">> Password is too short.",
    "ATTENZIONE: Devi completare la registrazione scegliendo un Nome in Codice.": "WARNING: You must complete registration by choosing a Codename.",
    "LICENZA ACQUISITA.\nIl download è stato aggiunto alla coda del tuo Kripix Launcher.": "LICENSE ACQUIRED.\nThe download has been added to your Kripix Launcher queue.",
    "ACCESSO NEGATO\n\nDevi identificarti come Developer registrato.": "ACCESS DENIED\n\nYou must identify yourself as a registered Developer.",
    ">> ERRORE: Il Nome in Codice non può contenere spazi.": ">> ERROR: Codename cannot contain spaces.",
    ">> Questo ID è già in uso nel Network.": ">> This ID is already in use on the Network.",
    "RIPRISTINO CONNESSIONE": "CONNECTION RESET",
    "TORNA AL LOGIN": "RETURN TO LOGIN",

    // ── Loading screen ──────────────────────────────────────
    "CONNESSIONE AL NETWORK...": "CONNECTING TO NETWORK...",
    "DECRITTAZIONE DATI...": "DECRYPTING DATA...",
    "SINCRONIZZAZIONE...": "SYNCHRONIZING...",
};


// ── LINGUA ATTIVA ───────────────────────────────────────────

let currentDict = {};
let currentLang = 'it';


// ── FUNZIONE: Traduci un singolo nodo DOM ───────────────────

function translateNode(node) {
    if (!currentDict || Object.keys(currentDict).length === 0) return;

    // Nodo di testo puro
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim();
        if (text && currentDict[text] && text !== currentDict[text]) {
            node.nodeValue = node.nodeValue.replace(text, currentDict[text]);
        }
        return;
    }

    // Nodo elemento
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.classList.contains('no-translate')) return;

    // 1) Attributo data-i18n (priorità massima)
    const i18nKey = node.getAttribute('data-i18n');
    if (i18nKey && currentDict[i18nKey]) {
        if (node.hasAttribute('data-i18n-html')) {
            // Traduzione che contiene markup (link, <strong>, <br>...).
            // I valori arrivano solo dal dizionario interno, mai dall'utente.
            node.innerHTML = currentDict[i18nKey];
            return;
        }
        if (node.children.length === 0) {
            node.textContent = currentDict[i18nKey];
        } else {
            // Conserva i figli, traduci solo il testo diretto
            node.childNodes.forEach(translateNode);
        }
    }

    // 2) Placeholder degli input
    if (node.hasAttribute('placeholder')) {
        const ph = node.getAttribute('placeholder').trim();
        if (currentDict[ph] && ph !== currentDict[ph]) {
            node.setAttribute('placeholder', currentDict[ph]);
        }
    }

    // 3) Attributo title
    if (node.hasAttribute('title')) {
        const t = node.getAttribute('title').trim();
        if (currentDict[t] && t !== currentDict[t]) {
            node.setAttribute('title', currentDict[t]);
        }
    }

    // 4) data-tooltip (usato nei badge profilo)
    if (node.hasAttribute('data-tooltip')) {
        const tt = node.getAttribute('data-tooltip').trim();
        if (currentDict[tt] && tt !== currentDict[tt]) {
            node.setAttribute('data-tooltip', currentDict[tt]);
        }
    }

    // 5) aria-label: è il testo che leggono gli screen reader,
    //    va tradotto come tutto il resto
    if (node.hasAttribute('aria-label')) {
        const al = node.getAttribute('aria-label').trim();
        if (currentDict[al] && al !== currentDict[al]) {
            node.setAttribute('aria-label', currentDict[al]);
        }
    }

    // Ricorsione sui figli
    node.childNodes.forEach(translateNode);
}


// ── FUNZIONE: Evidenzia lingua attiva nel selettore ─────────

function updateLanguageIndicator() {
    // Allinea anche l'attributo lang del documento: serve agli screen
    // reader per pronunciare i testi con la fonetica giusta.
    document.documentElement.lang = currentLang;

    document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
        const isCurrent = (btn.dataset.lang || btn.textContent.trim().toLowerCase()) === currentLang;
        btn.classList.toggle('active', isCurrent);
        btn.setAttribute('aria-pressed', String(isCurrent));
    });
}


// ── EXPORT: Inizializza il traduttore ───────────────────────

export function initTranslator() {
    currentLang = localStorage.getItem('kripix_lang') || 'it';

    if (currentLang === 'it') {
        currentDict = {};
        updateLanguageIndicator();
        return;
    }

    currentDict = currentLang === 'en' ? dizionario_EN : {};

    // Traduci tutto il body
    translateNode(document.body);

    // Evidenzia la lingua attiva
    updateLanguageIndicator();

    // MutationObserver per contenuto aggiunto dinamicamente (modali, notifiche, ecc.)
    const observer = new MutationObserver((mutations) => {
        observer.disconnect();
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => translateNode(node));
            }
            if (mutation.type === 'characterData') {
                const text = mutation.target.nodeValue.trim();
                if (text && currentDict[text] && text !== currentDict[text]) {
                    mutation.target.nodeValue = currentDict[text];
                }
            }
        });
        startObserver();
    });

    function startObserver() {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false
        });
    }

    startObserver();
}


// ── EXPORT: Cambia lingua ───────────────────────────────────

export function switchLanguage(lang) {
    localStorage.setItem('kripix_lang', lang);

    // NOTA: le versioni inglesi separate delle pagine legali
    // (eula-eng.html, dmr-eng.html, privacy-eng.html) non esistono ancora.
    // Finché non ci sono, ricaricare la pagina è meglio di un 404.
    location.reload();
}


// ── EXPORT: Traduci una stringa a runtime (per uso JS) ──────

export function t(key) {
    if (currentLang === 'it' || !currentDict[key]) return key;
    return currentDict[key];
}
