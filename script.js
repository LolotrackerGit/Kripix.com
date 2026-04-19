// --- IMPORTAZIONE FIREBASE (Infrastruttura Cloud) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// INCOLLA QUI LA TUA CONFIGURAZIONE FIREBASE PRESA DALLA CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyCSCYzPprBLnd49x41WZ4jMBVyNDCOdJ64",
  authDomain: "kripix-ent.firebaseapp.com",
  projectId: "kripix-ent",
  storageBucket: "kripix-ent.firebasestorage.app",
  messagingSenderId: "778855676026",
  appId: "1:778855676026:web:0dc74f1108e2971f4da3c3"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log(">> FIREBASE CLOUD SYSTEM: CONNESSO.");

// ... qui sotto prosegue il tuo script.js normale (console.log Kripix System...)
console.log("Kripix System: Avvio Universale.");

// --- 1. GESTIONE HAMBURGER MENU ---
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if(hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
}

// --- 2. SISTEMA NOTIFICHE GLOBALI (TOAST UI) ---
document.addEventListener('DOMContentLoaded', () => {
    // Crea il contenitore per le notifiche se non esiste
    let toastContainer = document.getElementById('kripix-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'kripix-toast-container';
        document.body.appendChild(toastContainer);
    }

    // Funzione globale per mostrare notifiche
    window.kripixNotify = function(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'kripix-toast';
        
        let borderColor = 'var(--accent-gold)';
        if (type === 'success') borderColor = '#4caf50';
        if (type === 'error') borderColor = '#ff5555';
        
        toast.style.borderLeftColor = borderColor;

        toast.innerHTML = `
            <div class="kripix-toast-title" style="color: ${borderColor}">>> ${title}</div>
            <div>${message}</div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); 
        }, 5000);
    };

    // Il RADAR: Controlla in background se ci sono novità per l'utente loggato
    function checkBackgroundNotifications() {
        const currentUser = localStorage.getItem('kripix_user');
        if(!currentUser) return;
        
        const db = JSON.parse(localStorage.getItem('kripix_database')) || [];
        const me = db.find(u => u.username === currentUser);
        if(!me || !me.requests) return;

        const knownReqs = JSON.parse(localStorage.getItem('kripix_known_reqs')) || [];
        let updated = false;

        me.requests.forEach(req => {
            if(!knownReqs.includes(req)) {
                window.kripixNotify('RETE OPERATIVA', `L'Agente [${req}] ha richiesto l'accesso alla tua rete.`, 'info');
                knownReqs.push(req);
                updated = true;
            }
        });

        const cleanReqs = knownReqs.filter(r => me.requests.includes(r));
        if (updated || cleanReqs.length !== knownReqs.length) {
            localStorage.setItem('kripix_known_reqs', JSON.stringify(cleanReqs));
        }
    }
    
    // Attiva il Radar se sei loggato
    if (localStorage.getItem('kripix_user')) {
        setTimeout(checkBackgroundNotifications, 1000); 
        setInterval(checkBackgroundNotifications, 3000);
    }
});

// --- 3. GESTIONE ACCOUNT / LOGIN NELLA NAVBAR ---
document.addEventListener('DOMContentLoaded', () => {
    const navbarList = document.querySelector('.nav-menu') || document.querySelector('.nav-links');
    if (!navbarList) { console.error("ERRORE: Navbar non trovata su questa pagina."); return; }

    const dlBtnLi = navbarList.querySelector('.btn-launcher').closest('li'); // Trova l'elemento <li> del bottone "Scarica App"

    // Rimuovi vecchi elementi di autenticazione se presenti
    const oldAuth = document.getElementById('auth-item');
    if (oldAuth) oldAuth.remove();

    const li = document.createElement('li');
    li.id = 'auth-item';
    li.className = 'nav-user-container';

    // Funzione per aggiornare l'avatar nella navbar
    window.updateNavbarAvatarDisplay = function() {
        const user = localStorage.getItem('kripix_user');
        if (!user) {
            li.innerHTML = `<a href="login.html" class="btn-login-nav">ACCEDI</a>`;
            if (li.parentNode !== navbarList) navbarList.insertBefore(li, dlBtnLi);
            return;
        }

        let db = JSON.parse(localStorage.getItem('kripix_database')) || [];
        let me = db.find(u => u.username === user);
        let avatarHtmlContent = user.charAt(0).toUpperCase();
        let avatarBgColor = localStorage.getItem('kripix_color') || '#e3c66c';
        
        // CSS base per le lettere (sfondo colorato)
        let avatarStyle = `background-color: ${avatarBgColor};`;

        if (me && me.avatar_img) {
            // FIX: Se c'è un'immagine, nessun bordo oro. Sfondo trasparente.
            avatarHtmlContent = `<img src="${me.avatar_img}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            avatarStyle = `background-color: transparent; border: none;`; 
        } else if (me && me.color) {
            // Se c'è un colore custom salvato nel DB
            avatarBgColor = me.color;
            avatarStyle = `background-color: ${avatarBgColor};`;
        }
        
        li.innerHTML = `
            <div class="user-avatar" style="${avatarStyle}" title="${user}">
                ${avatarHtmlContent}
            </div>
            <div class="user-dropdown">
                <div class="user-header">
                    <span class="user-name">${user}</span>
                    <span class="user-role">Agente Operativo</span>
                </div>
                <a href="profilo.html">IL MIO PROFILO</a>
                <a href="libreria.html">Libreria Giochi</a>
                <a href="impostazioni.html">Configurazione</a>
                <a href="#" id="action-logout" style="color:#ff5555">Disconnetti</a>
            </div>
        `;

        // Assicurati che l'elemento sia nella navbar (solo una volta)
        if (li.parentNode !== navbarList) {
            navbarList.insertBefore(li, dlBtnLi);
        }

        // Rimuovi e riattacca i listener per evitare duplicati se l'HTML viene riscritto
        const currentAvatarElement = li.querySelector('.user-avatar');
        if (currentAvatarElement) {
            currentAvatarElement.onclick = (e) => {
                const dropdown = li.querySelector('.user-dropdown');
                if (dropdown) dropdown.classList.toggle('show');
                e.stopPropagation(); // Evita che il click si propaghi al document
            };
        }

        const logoutLink = li.querySelector('#action-logout');
        if (logoutLink) {
            logoutLink.onclick = (e) => {
                e.preventDefault();
                try { 
                    localStorage.removeItem('kripix_user'); 
                    localStorage.removeItem('kripix_color');
                    localStorage.removeItem('owned_game_harrow'); 
                    localStorage.removeItem('kripix_known_reqs'); // Pulisci notifiche richieste
                } catch(e){}
                window.location.href = 'index.html'; 
            };
        }
        
        // Chiudi dropdown cliccando fuori
        document.onclick = (e) => {
            const dropdown = li.querySelector('.user-dropdown');
            if (dropdown && !li.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        };
    };

    updateNavbarAvatarDisplay(); // Chiamata iniziale per renderizzare la navbar al caricamento della pagina
});