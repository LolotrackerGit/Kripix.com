// ==========================================
// 1. IMPORTAZIONI
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-check.js";

import { injectNavbar, injectFooter } from './components.js';
import { initTranslator, switchLanguage } from './translator.js'; // Assicurati che translator.js esista!

// ==========================================
// 2. INIZIALIZZAZIONE FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCSCYzPprBLnd49x41WZ4jMBVyNDCOdJ64",
    authDomain: "kripix-ent.firebaseapp.com",
    projectId: "kripix-ent",
    storageBucket: "kripix-ent.appspot.com",
    messagingSenderId: "778855676026",
    appId: "1:778855676026:web:0dc74f1108e2971f4da3c3"
};

export const app = initializeApp(firebaseConfig);

// Scudo Anti-Bot (App Check)
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6Lc3qOssAAAAACJLhU6erRnF8MrTObDnP5zoXJqn'),
  isTokenAutoRefreshEnabled: true
});

export const auth = getAuth(app);
export const db = getFirestore(app);

// ==========================================
// 3. ESECUZIONE PRINCIPALE (Al caricamento della pagina)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- A. INIEZIONE COMPONENTI (Deve essere la prima cosa!) ---
    injectNavbar();
    injectFooter();

    // --- B. MENU HAMBURGER E TRADUTTORE ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => { 
            hamburger.classList.toggle("active"); 
            navMenu.classList.toggle("active"); 
            document.body.classList.toggle("no-scroll", navMenu.classList.contains("active"));
        });
    }

    // Rendiamo il traduttore globale per i bottoni HTML
    initTranslator();
    window.cambiaLingua = switchLanguage;

    // --- C. SISTEMA DI NOTIFICHE GLOBALI ---
    let toastContainer = document.getElementById('kripix-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'kripix-toast-container';
        document.body.appendChild(toastContainer);
    }

    window.kripixNotify = function(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'kripix-toast';
        let borderColor = type === 'success' ? '#4caf50' : type === 'error' ? '#ff5555' : 'var(--accent-gold)';
        toast.style.borderLeftColor = borderColor;
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'kripix-toast-title';
        titleDiv.style.color = borderColor;
        titleDiv.textContent = `>> ${title}`;
        
        const msgDiv = document.createElement('div');
        msgDiv.textContent = message;

        toast.appendChild(titleDiv);
        toast.appendChild(msgDiv);
        
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 5000);
    };

    // --- D. LOGICA AVATAR NAVBAR E GHOST ACCOUNT ---
    // (Ora che la navbar è iniettata, possiamo cercare .nav-menu)
    const navbarList = document.querySelector('.nav-menu') || document.querySelector('.nav-links');
    
    // Se non siamo in una pagina con la navbar standard (es. Login), saltiamo questa parte
    if (!navbarList) return; 

    const dlBtnLi = navbarList.querySelector('.btn-launcher');
    const targetNode = dlBtnLi ? dlBtnLi.closest('li') : null;

    const li = document.createElement('li');
    li.id = 'auth-item';
    li.className = 'nav-user-container';

    window.updateNavbarAvatarDisplay = async function(user) {
        if (!user) {
            li.innerHTML = `<a href="login.html" class="btn-login-nav">ACCEDI</a>`;
            if (!document.getElementById('auth-item')) {
                if (targetNode) navbarList.insertBefore(li, targetNode); else navbarList.appendChild(li);
            }
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            // GHOST ACCOUNT FIX (Se chiude il popup di Google prima di registrarsi)
            if (!userSnap.exists()) {
                console.warn(">> PROTOCOLLO INCOMPLETO: Profilo database mancante.");
                if (!window.location.href.includes("login.html") && !window.location.href.includes("register.html")) {
                    alert("ATTENZIONE: Devi completare la registrazione scegliendo un Nome in Codice.");
                    await signOut(auth);
                    window.location.href = "login.html";
                    return;
                }
            }

            const me = userSnap.data();
            li.innerHTML = '';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'user-avatar';
            if(me.avatar_img) {
                avatarDiv.style.backgroundColor = 'transparent';
                avatarDiv.style.border = 'none';
                const img = document.createElement('img');
                img.src = me.avatar_img;
                img.style.width = '100%'; img.style.height = '100%'; 
                img.style.borderRadius = '50%'; img.style.objectFit = 'cover';
                avatarDiv.appendChild(img);
            } else {
                avatarDiv.style.backgroundColor = me.color || '#e3c66c';
                avatarDiv.style.border = 'none';
                avatarDiv.textContent = me.username.charAt(0).toUpperCase();
            }

            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            
            const header = document.createElement('div');
            header.className = 'user-header';
            
            const userNameSpan = document.createElement('span');
            userNameSpan.className = 'user-name';
            userNameSpan.textContent = me.username;
            
            const userRoleSpan = document.createElement('span');
            userRoleSpan.className = 'user-role';
            userRoleSpan.textContent = me.isAdmin ? 'OVERSEER' : 'Agente Operativo';
            
            header.appendChild(userNameSpan);
            header.appendChild(userRoleSpan);
            dropdown.appendChild(header);

            dropdown.insertAdjacentHTML('beforeend', `
                <a href="profilo.html">IL MIO PROFILO</a>
                <a href="libreria.html">Libreria Giochi</a>
                <a href="impostazioni.html">Configurazione</a>
                ${me.isAdmin ? '<a href="admin.html" style="color:var(--accent-gold)">Terminale Overseer</a>' : ''}
                <a href="#" id="action-logout" style="color:#ff5555">Disconnetti</a>
            `);

            li.appendChild(avatarDiv);
            li.appendChild(dropdown);

            if (!document.getElementById('auth-item')) {
                if (targetNode) navbarList.insertBefore(li, targetNode); else navbarList.appendChild(li);
            }

            const avatarBtn = li.querySelector('.user-avatar');
            if (avatarBtn) avatarBtn.onclick = (e) => { dropdown.classList.toggle('show'); e.stopPropagation(); };

            li.querySelector('#action-logout').onclick = async (e) => {
                e.preventDefault();
                await signOut(auth);
                window.location.href = 'index.html'; 
            };

            document.onclick = (e) => { if (dropdown && !li.contains(e.target)) dropdown.classList.remove('show'); };
            
        } catch (error) { console.error("Errore Auth State:", error); }
    };

    // --- E. ASCOLTATORE DI STATO ONLINE/OFFLINE ---
    onAuthStateChanged(auth, async (user) => {
        window.updateNavbarAvatarDisplay(user);

        if (user) {
            const userRef = doc(db, "users", user.uid);
            
            const goOnline = async () => {
                try {
                    const snap = await getDoc(userRef);
                    if (snap.exists() && (!snap.data().privacy || snap.data().privacy.invisible !== true)) {
                        await updateDoc(userRef, { onlineStatus: "online" });
                    }
                } catch(e) {}
            };

            const goOffline = () => {
                updateDoc(userRef, { onlineStatus: "offline" }).catch(()=>{});
            };

            goOnline();

            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') { goOnline(); } 
                else { goOffline(); }
            });

            window.addEventListener('beforeunload', () => { goOffline(); });
        }
    });

    // ==========================================
    // SISTEMA BANNER COOKIE (TERMINALE)
    // ==========================================
    // Controlliamo se l'utente ha già fatto la sua scelta
    if (!localStorage.getItem('kripix_cookie_consent')) {
        
        // Creiamo il div del banner
        const cookieBanner = document.createElement('div');
        cookieBanner.id = 'kripix-cookie-banner';
        
        // Inseriamo l'HTML formattato con le classi del tuo CSS
        cookieBanner.innerHTML = `
            <div class="cookie-title">> INIZIALIZZAZIONE COOKIE</div>
            <div class="cookie-text">
                Il Network Operativo Kripix utilizza pacchetti di tracciamento (Cookie) essenziali per mantenere la connessione stabile e salvare le tue preferenze. Non vendiamo i tuoi dati ai corporati. 
                <br><br>Puoi leggere il <a href="privacy.html">Dossier Privacy</a> per i dettagli completi.
            </div>
            <div class="cookie-buttons">
                <button id="btn-cookie-accept" class="btn-cookie btn-cookie-accept">ACCETTA TUTTI</button>
                <button id="btn-cookie-reject" class="btn-cookie btn-cookie-reject">SOLO ESSENZIALI</button>
            </div>
        `;

        // Lo aggiungiamo al body
        document.body.appendChild(cookieBanner);

        // Facciamo partire l'animazione di entrata (delay per fluidità)
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 500);

        // Logica dei bottoni
        document.getElementById('btn-cookie-accept').addEventListener('click', () => {
            localStorage.setItem('kripix_cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.remove(), 600);
            if(window.kripixNotify) window.kripixNotify("SISTEMA", "Tracciamento completo autorizzato.", "success");
        });

        document.getElementById('btn-cookie-reject').addEventListener('click', () => {
            localStorage.setItem('kripix_cookie_consent', 'rejected');
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.remove(), 600);
            if(window.kripixNotify) window.kripixNotify("SISTEMA", "Tracciamento limitato ai pacchetti essenziali.", "info");
        });
    }
});