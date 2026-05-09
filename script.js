import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCSCYzPprBLnd49x41WZ4jMBVyNDCOdJ64",
    authDomain: "kripix-ent.firebaseapp.com",
    projectId: "kripix-ent",
    storageBucket: "kripix-ent.firebasestorage.app",
    messagingSenderId: "778855676026",
    appId: "1:778855676026:web:0dc74f1108e2971f4da3c3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ==========================================
// SISTEMA DI NOTIFICHE
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
        toast.innerHTML = `<div class="kripix-toast-title" style="color: ${borderColor}">>> ${title}</div><div>${message}</div>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 5000);
    };
});

// ==========================================
// NAVBAR DINAMICA & SICUREZZA
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
                
                let avatarHtmlContent = me.username.charAt(0).toUpperCase();
                let avatarStyle = me.avatar_img ? `background-color: transparent; border: none;` : `background-color: ${me.color || '#e3c66c'}; border: none;`; 
                if (me.avatar_img) avatarHtmlContent = `<img src="${me.avatar_img}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;

                li.innerHTML = `
                    <div class="user-avatar" style="${avatarStyle}">${avatarHtmlContent}</div>
                    <div class="user-dropdown">
                        <div class="user-header">
                            <span class="user-name">${me.username}</span>
                            <span class="user-role">${me.isAdmin ? 'OVERSEER' : 'Agente Operativo'}</span>
                        </div>
                        <a href="profilo.html">IL MIO PROFILO</a>
                        <a href="libreria.html">Libreria Giochi</a>
                        <a href="impostazioni.html">Configurazione</a>
                        ${me.isAdmin ? '<a href="admin.html" style="color:var(--accent-gold)">Terminale Overseer</a>' : ''}
                        <a href="#" id="action-logout" style="color:#ff5555">Disconnetti</a>
                    </div>
                `;
            } else {
                // IL FIX D'EMERGENZA: Se l'account è fantasma, mostra questo.
                li.innerHTML = `
                    <div class="user-avatar" style="background-color: #ff5555; border: none;" title="Errore Dati">!</div>
                    <div class="user-dropdown">
                        <div class="user-header">
                            <span class="user-name" style="color:#ff5555">ACCOUNT FANTASMA</span>
                        </div>
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
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    if (hamburger && navMenu) hamburger.addEventListener("click", () => { hamburger.classList.toggle("active"); navMenu.classList.toggle("active"); });
});