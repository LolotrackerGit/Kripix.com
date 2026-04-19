import { auth, db } from './script.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ==========================================
// 1. LOGICA LOGIN CLOUD CON VERIFICA EMAIL
// ==========================================
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Reset grafico errori
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.validation-msg').forEach(el => el.style.display = 'none');
    
    const userInput = document.getElementById('usernameInput');
    const passInput = document.getElementById('passwordInput');
    const username = userInput.value.trim().toLowerCase();
    const password = passInput.value;
    const btn = this.querySelector('button');

    btn.innerHTML = 'VERIFICA NEL CLOUD...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    try {
        // FASE A: Recupero l'email dal Database tramite l'ID Agente
        const userDocRef = doc(db, "users", username);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            throw new Error("user-not-found");
        }

        const userData = docSnap.data();
        const userEmail = userData.email;

        // FASE B: Login con Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
        const firebaseUser = userCredential.user;

        // FASE C: CONTROLLO EMAIL VERIFICATA
        if (!firebaseUser.emailVerified) {
            // Sconnettiamo immediatamente l'utente e blocchiamo l'accesso
            await signOut(auth);
            throw new Error("email-not-verified");
        }

        // FASE D: SUCCESSO! (Salvataggio cache e reindirizzamento)
        localStorage.setItem('kripix_user', userData.username); 
        localStorage.setItem('kripix_color', userData.color);
        if(userData.games && userData.games.includes('harrow')) {
            localStorage.setItem('owned_game_harrow', 'true');
        } else {
            localStorage.removeItem('owned_game_harrow');
        }

        btn.innerHTML = 'ACCESSO CONSENTITO';
        btn.style.background = '#4caf50';
        btn.style.color = '#000';
        btn.style.borderColor = '#4caf50';

        setTimeout(() => { window.location.href = 'index.html'; }, 1000);

    } catch (error) {
        // GESTIONE ERRORI
        userInput.classList.add('input-error');
        passInput.classList.add('input-error');
        
        const msg = document.getElementById('err-login');
        
        if (error.message === "email-not-verified") {
            msg.innerHTML = '>> ACCESSO NEGATO: CANALE NON VERIFICATO.<br>Controlla la tua email per confermare l\'identità.';
            msg.style.color = "var(--accent-gold)"; // Giallo
        } else {
            msg.innerText = '>> ERRORE CLOUD: CREDENZIALI NON VALIDE [ACCESS DENIED]';
            msg.style.color = "#ff5555"; // Rosso
        }
        
        msg.style.display = 'block';
        passInput.style.animation = 'none';
        passInput.offsetHeight;
        passInput.style.animation = 'shake 0.3s';

        btn.innerHTML = 'VERIFICA CREDENZIALI';
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        
        console.error("Dettaglio errore:", error.message);
    }
});

// Pulisci errore mentre scrivi
document.querySelectorAll('input').forEach(i => i.addEventListener('input', function(){
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.getElementById('err-login').style.display = 'none';
}));


// ==========================================
// 2. LOGICA RECUPERO PASSWORD
// ==========================================
const resetModal = document.getElementById('reset-modal');
const forgotLink = document.getElementById('forgot-pass-link');

forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    resetModal.style.display = 'flex';
});

window.closeResetModal = function() {
    resetModal.style.display = 'none';
};

window.sendResetCode = async function() {
    const emailInput = document.getElementById('reset-email');
    const email = emailInput.value.trim();
    const msgEl = document.getElementById('reset-msg');
    const btn = document.getElementById('btn-send-code');

    if (!email) return;

    btn.innerText = "CONNESSIONE...";
    btn.disabled = true;

    try {
        await sendPasswordResetEmail(auth, email);
        
        msgEl.innerText = ">> PROTOCOLLO INVIATO. Controlla la tua posta per il link di ripristino sicuro.";
        msgEl.style.color = '#4caf50';
        msgEl.style.display = 'block';
        
        setTimeout(() => {
            closeResetModal();
            btn.innerText = "INVIA LINK";
            btn.disabled = false;
        }, 4000);

    } catch (error) {
        msgEl.innerText = ">> ERRORE: Sistema non disponibile o email non trovata.";
        msgEl.style.color = '#ff5555';
        msgEl.style.display = 'block';
        btn.innerText = "INVIA LINK";
        btn.disabled = false;
    }
};