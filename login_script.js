// Importiamo gli strumenti Cloud dal nostro script globale
import { auth, db } from './script.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ==========================================
// 1. LOGICA LOGIN CLOUD
// ==========================================
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Reset grafico errori
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.validation-msg').forEach(el => el.style.display = 'none');
    
    const userInput = document.getElementById('usernameInput');
    const passInput = document.getElementById('passwordInput');
    const username = userInput.value.trim().toLowerCase(); // Firebase è case-sensitive sui documenti, forziamo minuscolo
    const password = passInput.value;
    const btn = this.querySelector('button');

    btn.innerHTML = 'VERIFICA NEL CLOUD...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    try {
        // FASE A: Troviamo l'email associata a questo ID Agente nel Database
        const userDocRef = doc(db, "users", username);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            throw new Error("user-not-found");
        }

        const userData = docSnap.data();
        const userEmail = userData.email;

        // FASE B: Tentiamo il vero Login crittografato sui server Firebase
        await signInWithEmailAndPassword(auth, userEmail, password);

        // FASE C: SUCCESSO!
        // Salviamo una "copia temporanea" (cache) dei dati nel localStorage.
        // Questo serve per non rompere le altre pagine (Libreria, Profilo) che per ora leggono ancora da lì.
        // Nella Fase 3 collegheremo anche quelle al cloud!
        localStorage.setItem('kripix_user', userData.username); // Salva col maiuscolo originale
        localStorage.setItem('kripix_color', userData.color);
        if(userData.games && userData.games.includes('harrow')) {
            localStorage.setItem('owned_game_harrow', 'true');
        } else {
            localStorage.removeItem('owned_game_harrow');
        }

        btn.innerHTML = 'ACCESSO CONSENTITO';
        btn.style.background = '#4caf50';
        btn.style.color = 'black';
        btn.style.borderColor = '#4caf50';

        setTimeout(() => { window.location.href = 'index.html'; }, 1000);

    } catch (error) {
        // FASE D: ERRORE (Password errata o ID inesistente)
        userInput.classList.add('input-error');
        passInput.classList.add('input-error');
        
        const msg = document.getElementById('err-login');
        msg.innerText = '>> ERRORE CLOUD: CREDENZIALI NON VALIDE [ACCESS DENIED]';
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
// 2. LOGICA RECUPERO PASSWORD (NATIVO FIREBASE)
// ==========================================
const resetModal = document.getElementById('reset-modal');
const forgotLink = document.getElementById('forgot-pass-link');

forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    resetModal.style.display = 'flex';
});

// Reso globale per l'HTML
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
        // Chiediamo al server di Google di inviare la mail di reset sicura
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