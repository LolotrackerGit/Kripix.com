// translator.js

// IL TUO DIZIONARIO (Aggiungi qui le frasi esatte che vuoi tradurre)
const dizionario_EN = {
    // ==========================================
    // NAVBAR & COMUNI
    // ==========================================
    "Progetti": "Projects",
    "Chi Siamo": "About Us",
    "Contatti": "Contact",
    "Scarica App": "Download App",
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
    "ANNULLA": "CANCEL",
    "CHIUDI": "CLOSE",

    // ==========================================
    // INDEX.HTML (Home)
    // ==========================================
    "A different way to see pixels.": "A different way to see pixels.",
    "I Nostri Giochi": "Our Games",
    "La Nostra Visione": "Our Vision",
    ">> Intercettazione segnali di rete...": ">> Intercepting network signals...",
    ">> Nessuna comunicazione attiva.": ">> No active communications.",

    // ==========================================
    // STUDIO.HTML (Chi Siamo)
    // ==========================================
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

    // ==========================================
    // PROGETTI.HTML & HARROW.HTML
    // ==========================================
    "CATALOGO PROGETTI": "PROJECT CATALOG",
    "IL FILO DEL DUBBIO": "A THREAD OF DOUBT",
    "IN SVILUPPO | PC | 2025": "IN DEVELOPMENT | PC | 2025",
    "Un thriller noir psicologico dove ogni fallimento investigativo rende i tuoi nemici più forti. Harrow ti aspetta.": "A psychological noir thriller where every investigative failure makes your enemies stronger. Harrow awaits.",
    "Edizione Standard": "Standard Edition",
    "MIGLIORE OFFERTA": "BEST VALUE",
    "★ Include DELUXE EDITION": "★ Includes DELUXE EDITION",
    "(Soundtrack + Artbook + Skin)": "(Soundtrack + Artbook + Skin)",
    "Acquista Ora": "Buy Now",
    "Key Steam Inclusa • 100% Supporto Sviluppatori": "Steam Key Included • 100% Developer Support",
    "ANNUNCIO": "ANNOUNCEMENT",
    "PROGETTO SEGRETO": "CLASSIFIED PROJECT",
    "PRE-PRODUZIONE": "PRE-PRODUCTION",
    "Un nuovo capitolo nell'universo Kripix.": "A new chapter in the Kripix universe.",
    
    // Harrow (Pagina Gioco)
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

    // ==========================================
    // LOGIN, REGISTER, RESET
    // ==========================================
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
    "TORNA AL LOGIN": "RETURN TO LOGIN",
    "RIPRISTINO CHIAVE": "KEY RESTORATION",
    "NUOVA PASSWORD (Min 8 car. + 1 Numero)": "NEW PASSWORD (Min 8 char. + 1 Number)",
    "CONFERMA NUOVA PASSWORD": "CONFIRM NEW PASSWORD",
    "AGGIORNA CREDENZIALI": "UPDATE CREDENTIALS",
    "BENVENUTO, AGENTE": "WELCOME, AGENT",
    "COMPLETA REGISTRAZIONE": "COMPLETE REGISTRATION",
    "VERIFICA IN CORSO": "VERIFICATION IN PROGRESS",

    // ==========================================
    // PROFILO.HTML
    // ==========================================
    "IL MIO PROFILO": "My Profile",
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
    ">[OGGI] Accesso al terminale effettuato.": ">[TODAY] Terminal access granted.",
    "> [SISTEMA] Acquisizione licenza \"Harrow\".": "> [SYSTEM] \"Harrow\" license acquired.",
    "> [SYSTEM] Profilo sincronizzato con il server centrale.": "> [SYSTEM] Profile synchronized with central server.",
    "⚠ INTERROMPI CONNESSIONE": "⚠ SEVER CONNECTION",
    "RIMUOVI": "REMOVE",

    // ==========================================
    // IMPOSTAZIONI.HTML
    // ==========================================
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
    "SICUREZZA": "SECURITY",
    "CODICE D'ACCESSO": "ACCESS CODE",
    "MODIFICA PASSWORD": "CHANGE PASSWORD",
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
    "Dossier E.U.L.A.": "E.U.L.A. Dossier",
    "Policy DRM": "DRM Policy",
    "Gestione Cookie": "Cookie Management",
    "AGGIORNA ID AGENTE": "UPDATE AGENT ID",
    "AGGIORNA CANALE (EMAIL)": "UPDATE CHANNEL (EMAIL)",
    "INVIA VERIFICA": "SEND VERIFICATION",
    "AGGIORNA PASSWORD": "UPDATE PASSWORD",
    "AGGIORNA": "UPDATE",
    "⚠ CONFERMA ELIMINAZIONE": "⚠ CONFIRM DELETION",
    "CONFERMA": "CONFIRM",
    "OPERAZIONE RIUSCITA": "OPERATION SUCCESSFUL",

    // ==========================================
    // LIBRERIA & DOWNLOAD
    // ==========================================
    "ARCHIVIO PERSONALE": "PERSONAL ARCHIVE",
    "Licenze attive e software assegnato.": "Active licenses and assigned software.",
    "NESSUNA LICENZA TROVATA": "NO LICENSE FOUND",
    "Non hai ancora acquistato software Kripix.": "You haven't purchased Kripix software yet.",
    "VAI ALLO STORE": "GO TO STORE",
    "SCELTA PIATTAFORMA": "PLATFORM SELECTION",
    "Seleziona il sistema operativo per avviare il download.": "Select the operating system to start the download.",
    "SCARICA .EXE": "DOWNLOAD .EXE",
    "SCARICA .DMG": "DOWNLOAD .DMG",
    "● LICENZA ATTIVA": "● ACTIVE LICENSE",
    "INSTALLA": "INSTALL",
    "ACQUISTO COMPLETATO": "PURCHASE COMPLETED",
    "VAI ALLA LIBRERIA": "GO TO LIBRARY",
    "Resta Qui": "Stay Here",
    "KRIPIX LAUNCHER": "KRIPIX LAUNCHER",
    "Il tuo portale per Harrow e oltre.": "Your portal for Harrow and beyond.",
    "Rilevato": "Detected",
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

    // ==========================================
    // ADMIN (OVERSEER TERMINAL)
    // ==========================================
    "TERMINALE OVERSEER": "OVERSEER TERMINAL",
    "Accesso di Livello 5. Autorizzazione concessa.": "Level 5 Access. Authorization granted.",
    "AGENTI TOTALI REGISTRATI": "TOTAL REGISTERED AGENTS",
    "LICENZE \"HARROW\" VENDUTE": "SOLD \"HARROW\" LICENSES",
    "ISCRITTI ALLA NEWSLETTER": "NEWSLETTER SUBSCRIBERS",
    "DATABASE AGENTI": "AGENTS DATABASE",
    "USERNAME": "USERNAME",
    "EMAIL": "EMAIL",
    "LICENZA GIOCO": "GAME LICENSE",
    "LIVELLO": "LEVEL",
    "BROADCAST DI RETE (NEWS)": "NETWORK BROADCAST (NEWS)",
    "Priorità: NORMALE": "Priority: NORMAL",
    "Priorità: ALTA": "Priority: HIGH",
    "TRASMETTI": "BROADCAST",
    "STORICO COMUNICAZIONI": "COMMUNICATIONS HISTORY",
    "TITOLO": "TITLE",
    "DATA": "DATE",
    "PRIORITÀ": "PRIORITY",
    "AZIONE": "ACTION",
    "DISTRUGGI": "DESTROY",

    // ==========================================
    // ENGINE.HTML
    // ==========================================
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

    // ==========================================
    // CONTATTI & 404
    // ==========================================
    "PARLA CON NOI": "TALK TO US",
    "INFO": "INFO",
    "Siamo sempre alla ricerca di collaboratori, feedback o opportunità di publishing.": "We are always looking for collaborators, feedback, or publishing opportunities.",
    "MESSAGGIO / DOSSIER": "MESSAGE / DOSSIER",
    "TRASMETTI DATI": "TRANSMIT DATA",
    "DOSSIER SCONOSCIUTO": "UNKNOWN DOSSIER",
    "Il percorso che stai cercando di seguire non esiste o è stato cancellato.": "The path you are trying to follow does not exist or has been deleted.",
    "Non c'è nulla da vedere qui, Agente.": "There's nothing to see here, Agent.",

    // ==========================================
    // SEZIONE PLACEHOLDER INPUT (Form)
    // ==========================================
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
    // ==========================================
    // MESSAGGI DINAMICI JS & CLOUD FUNCTIONS
    // ==========================================
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
    ">> La password è troppo corta.": ">> Password is too short."
};

export function initTranslator() {
    const currentLang = localStorage.getItem('kripix_lang') || 'it';
    if (currentLang === 'it') return;
    
    const dict = currentLang === 'en' ? dizionario_EN : {};

    // 1. Funzione che traduce i nodi
    function translateNode(node) {
        // Se è un nodo di testo puro
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue.trim();
            if (text && dict[text]) {
                node.nodeValue = node.nodeValue.replace(text, dict[text]);
            }
        } 
        // Se è un elemento HTML (div, span, input...)
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // Ignoriamo gli script e il CSS
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;

            // Traduce i placeholder (es. caselle di input)
            if (node.hasAttribute('placeholder')) {
                const text = node.getAttribute('placeholder').trim();
                if (dict[text]) {
                    node.setAttribute('placeholder', dict[text]);
                }
            }
            // Ripete l'operazione per tutti i figli dentro questo elemento
            node.childNodes.forEach(translateNode);
        }
    }

    // 2. Prima passata: traduce tutto quello che è già nell'HTML base
    translateNode(document.body);

    // 3. LA MAGIA: Il "Cane da guardia" che ascolta i caricamenti di Firebase
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Se Firebase ha aggiunto un nuovo pezzo di HTML (Libreria, Profilo, Modali)
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    translateNode(node);
                });
            }
            // Se JavaScript ha cambiato solo un testo (es. "ELABORAZIONE...")
            if (mutation.type === 'characterData') {
                const text = mutation.target.nodeValue.trim();
                if (text && dict[text]) {
                    mutation.target.nodeValue = mutation.target.nodeValue.replace(text, dict[text]);
                }
            }
        });
    });

    // Accendiamo l'osservatore per monitorare l'intero sito in tempo reale
    observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        characterData: true 
    });
}

export function switchLanguage(lang) {
    localStorage.setItem('kripix_lang', lang);
    location.reload(); 
}