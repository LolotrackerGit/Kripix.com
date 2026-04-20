// ==========================================
// 1. INIZIALIZZAZIONE FIREBASE CLOUD
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// LA TUA CONFIGURAZIONE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCSCYzPprBLnd49x41WZ4jMBVyNDCOdJ64",
    authDomain: "kripix-ent.firebaseapp.com",
    projectId: "kripix-ent",
    storageBucket: "kripix-ent.firebasestorage.app",
    messagingSenderId: "778855676026",
    appId: "1:778855676026:web:0dc74f1108e2971f4da3c3"
};

// Avvio istanze Firebase (esportate per essere usate negli altri file)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log(">> KRIPIX SYSTEM: Server Cloud Connesso.");


// ==========================================
// 2. MENU MOBILE (HAMBURGER)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }
});


// ==========================================
// 3. SISTEMA DI NOTIFICHE (TOAST UI)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Crea il contenitore delle notifiche se non esiste già
    let toastContainer = document.getElementById('kripix-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'kripix-toast-container';
        document.body.appendChild(toastContainer);
    }

    // Funzione globale richiamabile da ovunque per mostrare gli avvisi
    window.kripixNotify = function(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'kripix-toast';
        
        let borderColor = 'var(--accent-gold)'; // Info (Giallo/Oro)
        if (type === 'success') borderColor = '#4caf50'; // Verde
        if (type === 'error') borderColor = '#ff5555';   // Rosso
        
        toast.style.borderLeftColor = borderColor;

        toast.innerHTML = `
            <div class="kripix-toast-title" style="color: ${borderColor}">>> ${title}</div>
            <div>${message}</div>
        `;

        toastContainer.appendChild(toast);

        // Animazione di entrata
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Sparisce dopo 5 secondi
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); 
        }, 5000);
    };
});


// ==========================================
// 4. NAVBAR DINAMICA (AVATAR E LOGIN CLOUD)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const navbarList = document.querySelector('.nav-menu') || document.querySelector('.nav-links');
    if (!navbarList) return; // Se non c'è la navbar, fermati.

    // Troviamo dove inserire il blocco utente (prima del tasto "Scarica App")
    const dlBtnLi = navbarList.querySelector('.btn-launcher');
    const targetNode = dlBtnLi ? dlBtnLi.closest('li') : null;

    // Rimuoviamo eventuali vecchi blocchi di autenticazione per non duplicarli
    const oldAuth = document.getElementById('auth-item');
    if (oldAuth) oldAuth.remove();

    // Creiamo il nuovo contenitore per l'utente
    const li = document.createElement('li');
    li.id = 'auth-item';
    li.className = 'nav-user-container';

    // Rendiamo la funzione globale per poterla aggiornare da altre pagine
    window.updateNavbarAvatarDisplay = async function() {
        const username = localStorage.getItem('kripix_user');
        
        // CASO A: UTENTE NON LOGGATO
        if (!username) {
            li.innerHTML = `<a href="login.html" class="btn-login-nav">ACCEDI</a>`;
            if (targetNode) navbarList.insertBefore(li, targetNode);
            else navbarList.appendChild(li);
            return;
        }

        // CASO B: UTENTE LOGGATO - Inizializziamo valori di default
        let avatarHtmlContent = username.charAt(0).toUpperCase();
        let avatarStyle = `background-color: #e3c66c; border: none;`; 

        try {
            // Peschiamo i dati aggiornati dal Cloud!
            const userRef = doc(db, "users", username.toLowerCase());
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const me = userSnap.data();

                if (me.avatar_img) {
                    // Ha un'immagine profilo
                    avatarHtmlContent = `<img src="${me.avatar_img}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                    avatarStyle = `background-color: transparent; border: none;`; 
                } else if (me.color) {
                    // Usa il colore scelto
                    avatarStyle = `background-color: ${me.color}; border: none;`;
                }
            }
        } catch (error) {
            console.error("Errore fetch avatar Navbar:", error);
        }
        
        // Disegniamo l'HTML del Dropdown
        li.innerHTML = `
            <div class="user-avatar" style="${avatarStyle}" title="${username}">
                ${avatarHtmlContent}
            </div>
            <div class="user-dropdown">
                <div class="user-header">
                    <span class="user-name">${username}</span>
                    <span class="user-role">Agente Operativo</span>
                </div>
                <a href="profilo.html">IL MIO PROFILO</a>
                <a href="libreria.html">Libreria Giochi</a>
                <a href="impostazioni.html">Configurazione</a>
                <a href="#" id="action-logout" style="color:#ff5555">Disconnetti</a>
            </div>
        `;

        // Inseriamo nella Navbar
        if (li.parentNode !== navbarList) {
            if (targetNode) navbarList.insertBefore(li, targetNode);
            else navbarList.appendChild(li);
        }

        // ================= GESTIONE CLICK NAVBAR =================
        const avatarBtn = li.querySelector('.user-avatar');
        const dropdown = li.querySelector('.user-dropdown');
        const logoutBtn = li.querySelector('#action-logout');

        // Apri/Chiudi tendina
        if (avatarBtn) {
            avatarBtn.onclick = (e) => {
                dropdown.classList.toggle('show');
                e.stopPropagation(); // Evita che il click chiuda subito la tendina
            };
        }

        // Disconnessione
        if (logoutBtn) {
            logoutBtn.onclick = async (e) => {
                e.preventDefault();
                try {
                    // 1. Disconnette da Firebase
                    await signOut(auth);
                    // 2. Pulisce la memoria del browser
                    localStorage.clear(); 
                    // 3. Torna alla home
                    window.location.href = 'index.html'; 
                } catch(err) {
                    console.error("Errore Logout:", err);
                }
            };
        }
        
        // Chiudi tendina cliccando fuori
        document.onclick = (e) => {
            if (dropdown && !li.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        };
    };

    // Avvia la funzione appena carica la pagina
    updateNavbarAvatarDisplay();
});


// ==========================================
// 5. RADAR NOTIFICHE BACKGROUND (Amicizie)
// ==========================================
// Questa funzione gira ogni tot secondi per vedere se qualcuno ci ha aggiunto
async function checkBackgroundNotifications() {
    const currentUser = localStorage.getItem('kripix_user');
    if (!currentUser) return; // Se non sei loggato, non fa nulla
    
    try {
        const myRef = doc(db, "users", currentUser.toLowerCase());
        const mySnap = await getDoc(myRef);

        if (mySnap.exists()) {
            const me = mySnap.data();
            if (!me.requests) return;

            // Leggiamo la memoria locale per sapere quali notifiche abbiamo già mostrato
            const knownReqs = JSON.parse(localStorage.getItem('kripix_known_reqs')) || [];
            let updated = false;

            me.requests.forEach(req => {
                // Se c'è una richiesta nuova che non abbiamo mai visto
                if (!knownReqs.includes(req)) {
                    if (window.kripixNotify) {
                        window.kripixNotify('RETE OPERATIVA', `L'Agente [${req}] ha richiesto l'accesso.`, 'info');
                    }
                    knownReqs.push(req);
                    updated = true;
                }
            });

            // Se abbiamo mostrato nuove notifiche, aggiorniamo la memoria locale
            if (updated) {
                localStorage.setItem('kripix_known_reqs', JSON.stringify(knownReqs));
            }
        }
    } catch (error) {
        console.error("Errore Radar Background:", error);
    }
}

// Attiva il Radar se sei loggato (controlla ogni 5 secondi)
if (localStorage.getItem('kripix_user')) {
    setTimeout(checkBackgroundNotifications, 2000); 
    setInterval(checkBackgroundNotifications, 5000);
}