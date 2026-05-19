import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-check.js";

const firebaseConfig = {
    apiKey: "AIzaSyCSCYzPprBLnd49x41WZ4jMBVyNDCOdJ64",
    authDomain: "kripix-ent.firebaseapp.com",
    projectId: "kripix-ent",
    storageBucket: "kripix-ent.appspot.com", // <-- CORRETTO!
    messagingSenderId: "778855676026",
    appId: "1:778855676026:web:0dc74f1108e2971f4da3c3"
};

export const app = initializeApp(firebaseConfig);
// INIZIALIZZAZIONE SCUDO ANTI-BOT (App Check)
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6Lc3qOssAAAAACJLhU6erRnF8MrTObDnP5zoXJqn'),
  isTokenAutoRefreshEnabled: true // Mantiene lo scudo sempre attivo
});
export const auth = getAuth(app);
export const db = getFirestore(app);

// ==========================================
// SISTEMA DI NOTIFICHE (Il tuo codice è già perfetto)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
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
});

// ==========================================
// NAVBAR DINAMICA & SICUREZZA XSS (Il tuo codice è già perfetto)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const navbarList = document.querySelector('.nav-menu') || document.querySelector('.nav-links');
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

            if (userSnap.exists()) {
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

            } else {
                li.innerHTML = `
                    <div class="user-avatar" style="background-color: #ff5555; border: none;" title="Errore Dati">!</div>
                    <div class="user-dropdown">
                        <div class="user-header"><span class="user-name" style="color:#ff5555">ACCOUNT FANTASMA</span></div>
                        <a href="#" id="action-logout" style="color:#ff5555">Scollegati (Errore Database)</a>
                    </div>
                `;
            }

            if (!document.getElementById('auth-item')) {
                if (targetNode) navbarList.insertBefore(li, targetNode); else navbarList.appendChild(li);
            }

            const avatarBtn = li.querySelector('.user-avatar');
            const dropdown = li.querySelector('.user-dropdown');
            if (avatarBtn) avatarBtn.onclick = (e) => { dropdown.classList.toggle('show'); e.stopPropagation(); };

            li.querySelector('#action-logout').onclick = async (e) => {
                e.preventDefault();
                await signOut(auth);
                window.location.href = 'index.html'; 
            };

            document.onclick = (e) => { if (dropdown && !li.contains(e.target)) dropdown.classList.remove('show'); };
            
        } catch (error) { console.error("Errore Auth State:", error); }
    };

    onAuthStateChanged(auth, (user) => {
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
});

// ==========================================
// MENU HAMBURGER (FIX SCROLL MOBILE)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => { 
            hamburger.classList.toggle("active"); 
            navMenu.classList.toggle("active"); 
            
            // --> AGGIUNGI QUESTA RIGA <--
            // Se il menu ha la classe 'active', blocchiamo lo scroll, altrimenti lo sblocchiamo.
            document.body.classList.toggle("no-scroll", navMenu.classList.contains("active"));
        });
    }
});

import { initTranslator, switchLanguage } from './translator.js';

document.addEventListener('DOMContentLoaded', () => {
    initTranslator();
    
    // Rende la funzione disponibile globalmente per poterla usare nei bottoni HTML
    window.cambiaLingua = switchLanguage;
});