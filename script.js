// --- IMPORTAZIONE FIREBASE (Infrastruttura Cloud) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  // LA TUA CONFIGURAZIONE FIREBASE QUI
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ... (Lascia il codice dell'hamburger menu e dei Toast intatto) ...

// --- 3. GESTIONE ACCOUNT / LOGIN NELLA NAVBAR (AGGIORNATO CLOUD) ---
document.addEventListener('DOMContentLoaded', () => {
    const navbarList = document.querySelector('.nav-menu') || document.querySelector('.nav-links');
    if (!navbarList) return;

    const dlBtnLi = navbarList.querySelector('.btn-launcher').closest('li'); 
    const oldAuth = document.getElementById('auth-item');
    if (oldAuth) oldAuth.remove();

    const li = document.createElement('li');
    li.id = 'auth-item';
    li.className = 'nav-user-container';

    // Funzione ASINCRONA per leggere da Firebase
    window.updateNavbarAvatarDisplay = async function() {
        const username = localStorage.getItem('kripix_user');
        
        if (!username) {
            li.innerHTML = `<a href="login.html" class="btn-login-nav">ACCEDI</a>`;
            if (li.parentNode !== navbarList) navbarList.insertBefore(li, dlBtnLi);
            return;
        }

        let avatarHtmlContent = username.charAt(0).toUpperCase();
        let avatarStyle = `background-color: #e3c66c;`; // Default

        try {
            // LETTURA DAL CLOUD
            const userRef = doc(db, "users", username);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const me = userSnap.data();

                if (me.avatar_img) {
                    avatarHtmlContent = `<img src="${me.avatar_img}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                    avatarStyle = `background-color: transparent; border: none;`; 
                } else if (me.color) {
                    avatarStyle = `background-color: ${me.color};`;
                }
            }
        } catch (error) {
            console.error("Errore fetch avatar Navbar:", error);
        }
        
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

        if (li.parentNode !== navbarList) navbarList.insertBefore(li, dlBtnLi);

        // Gestione Click
        li.querySelector('.user-avatar').onclick = (e) => {
            li.querySelector('.user-dropdown').classList.toggle('show');
            e.stopPropagation();
        };

        li.querySelector('#action-logout').onclick = async (e) => {
            e.preventDefault();
            await signOut(auth); // Disconnette Firebase
            localStorage.clear(); // Pulisce tracce locali
            window.location.href = 'index.html'; 
        };
        
        document.onclick = (e) => {
            if (!li.contains(e.target) && li.querySelector('.user-dropdown')) {
                li.querySelector('.user-dropdown').classList.remove('show');
            }
        };
    };

    updateNavbarAvatarDisplay();
});