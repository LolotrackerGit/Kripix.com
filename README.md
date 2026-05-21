# 🖥️ KRIPIX ENTERTAINMENT — Network Portal (v2.0.4)

> **"A different way to see pixels."**  
> Benvenuto nel Terminale Operativo di Kripix Entertainment. Questo archivio ospita l'infrastruttura web, il portale degli Agenti e la console di amministrazione Overseer OS.

---

## 👁️ Panoramica del Progetto

Questo portale è il nucleo centrale dell'ecosistema Kripix. Non è una semplice vetrina, ma un'applicazione web interattiva e crittografata che simula un sistema operativo noir/cyber-investigativo. Permette agli utenti (Agenti) di gestire licenze, comunicare in tempo reale e interagire con l'infrastruttura dello studio.

---

## 🛡️ Caratteristiche Principali

*   **Kripix OS (Console Overseer):** Un vero terminale a riga di comando per gli amministratori (Livello 5) che permette di monitorare la telemetria, revocare/concedere licenze, sospendere account e inviare direttive di sistema crittografate.
*   **Terminale Comunicazioni (Chat Live):** Sistema di chat 1-a-1 in tempo reale a bassissima latenza con indicatori di stato dinamici (Online/Offline istantanei) e spunte di lettura (`> CONSEGNATO` / `> LETTO`) che si auto-nascondono alla risposta dell'interlocutore.
*   **Direttive di Sistema Unilaterali:** Gli amministratori possono inviare comunicazioni d'emergenza rosse ("Kripix Admin") tramite la Shell, bloccando l'input di risposta dell'utente per scopi narrativi o di moderazione.
*   **Integrazione Discord OAuth2:** Protocollo di sincronizzazione che collega il Dossier dell'utente al server Discord ufficiale, assegnando automaticamente ruoli di sicurezza (Verificato, Detective, Overseer).
*   **Stripe Gateway & Anti-Keygen:** Processo di acquisto sicuro per la Deluxe Edition di *Il Filo del Dubbio*. I webhook di Stripe generano e iniettano nel database chiavi crittografiche univoche non clonabili.
*   **Dossier PDF:** Generazione lato client di ricevute d'acquisto formattate in stile dossier crittografato tramite vettorializzazione jsPDF nativa.
*   **Scudo Anti-Bot:** Implementazione di Firebase App Check accoppiato a Google reCAPTCHA Enterprise per la protezione dell'infrastruttura API.

---

## 🛠️ Tech Stack

*   **Frontend:** HTML5 (Semantic), CSS3 (Custom Variables, Flexbox, Grid), Vanilla JavaScript (ES6 Modules).
*   **Backend (Serverless):** Firebase Cloud Functions v2 (Node.js runtime).
*   **Database & Auth:** Firebase Firestore (NoSQL, real-time listeners), Firebase Authentication.
*   **Integrazioni:** Stripe API, Discord Developer Portal, EmailJS, jsPDF.

---

## 🚀 Installazione e Sviluppo Locale

### 1. Prerequisiti
Assicurati di aver installato [Node.js](https://nodejs.org/) e la [Firebase CLI](https://firebase.google.com/docs/cli).

### 2. Clonare la Repository
```bash
git clone https://github.com/tuo-username/Kripix.com.git
cd Kripix.com
