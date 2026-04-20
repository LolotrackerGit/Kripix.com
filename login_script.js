import { auth, db } from './script.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Variabile globale per tenere in memoria l'utente nel Limbo
let pendingUserDocRef = null;

// ==========================================
// 1. LOGICA LOGIN & LIMBO (CONTROLLO EMAIL VERIFICATA)
// ==========================================
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
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
        const userDocRef = doc(db, "users", username);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) throw new Error("user-not-found");

        const userData = docSnap.data();
        const userEmail = userData.email;

        // Autenticazione con Firebase
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
        const firebaseUser = userCredential.user;

        // ==========================================
        // IL LIMBO (EMAIL NON VERIFICATA)
        // ==========================================
        if (!firebaseUser.emailVerified) {
            // Salviamo la reference per poterla cancellare se l'utente vuole annullare tutto
            pendingUserDocRef = userDocRef; 

            // Nuova Interfaccia Elegante
            document.getElementById('loginForm').innerHTML = `
                <div style="text-align: center; margin-bottom: 20px; padding: 20px 0;">
                    <span style="font-size: 3rem; display: block; margin-bottom: 10px;">⏳</span>
                    <h3 style="color:var(--accent-gold); margin-bottom:10px; font-family:'Courier Prime';">AUTORIZZAZIONE IN SOSPESO</h3>
                    <p style="font-size:0.85rem; color:#888; margin-bottom:25px; line-height: 1.5;">
                        In attesa di conferma dal canale crittografato:<br>
                        <strong style="color:white; font-family:'Courier Prime';">${userEmail}</strong>
                    </p>
                    
                    <button id="btn-resend" class="btn-outline full-width" style="margin-bottom:20px;">RE-INVIA MAIL DI VERIFICA</button>
                    
                    <div style="border-top: 1px solid #222; padding-top: 15px;">
                        <a href="#" id="btn-destroy" style="color:#666; font-size:0.75rem; text-decoration:none; transition:0.3s; font-family:'Courier Prime';">
                            > Hai sbagliato email? Annulla e ricomincia.
                        </a>
                    </div>
                    
                    <p id="limbo-msg" style="margin-top:15px; font-family:'Courier Prime'; font-size:0.8rem; display:none; font-weight:bold;"></p>
                </div>
            `;

            // EVENTO: RE-INVIA MAIL
            document.getElementById('btn-resend').addEventListener('click', async () => {
                const limboMsg = document.getElementById('limbo-msg');
                try {
                    await sendEmailVerification(auth.currentUser);
                    limboMsg.innerText = ">> Nuovo protocollo inviato. Controlla la posta.";
                    limboMsg.style.color = "#4caf50";
                    limboMsg.style.display = "block";
                    await signOut(auth); // Lo disconnettiamo per sicurezza
                } catch(e) {
                    limboMsg.innerText = ">> Errore: aspetta qualche minuto prima di riprovare.";
                    limboMsg.style.color = "#ff5555";
                    limboMsg.style.display = "block";
                }
            });

            // EVENTO: ANNULLA E RICOMINCIA (Distrugge l'account dietro le quinte)
            document.getElementById('btn-destroy').addEventListener('click', async (e) => {
                e.preventDefault();
                const limboMsg = document.getElementById('limbo-msg');
                try {
                    limboMsg.innerText = ">> Revoca in corso...";
                    limboMsg.style.color = "#888";
                    limboMsg.style.display = "block";
                    
                    // Eliminiamo DB e Auth
                    await deleteDoc(pendingUserDocRef);
                    await deleteUser(auth.currentUser);

                    // Ricarichiamo la pagina come se niente fosse
                    window.location.reload();

                } catch(e) {
                    console.error(e);
                    limboMsg.innerText = ">> Errore. Riprova più tardi.";
                    limboMsg.style.color = "#ff5555";
                }
            });

            throw new Error("email-limbo"); // Blocchiamo il proseguimento del login
        }

        // ==========================================
        // SUCCESSO! (SE EMAIL È VERIFICATA)
        // ==========================================
        localStorage.setItem('kripix_user', userData.username); 
        localStorage.setItem('kripix_color', userData.color);

        btn.innerHTML = 'ACCESSO CONSENTITO';
        btn.style.background = '#4caf50';
        btn.style.color = '#000';
        btn.style.borderColor = '#4caf50';

        setTimeout(() => { window.location.href = 'index.html'; }, 1000);

    } catch (error) {
        if(error.message === "email-limbo") return; // Non mostrare errori rossi, l'UI è già nel Limbo

        userInput.classList.add('input-error');
        passInput.classList.add('input-error');
        const msg = document.getElementById('err-login');
        
        msg.innerText = '>> ERRORE CLOUD: CREDENZIALI NON VALIDE [ACCESS DENIED]';
        msg.style.color = "#ff5555";
        msg.style.display = 'block';
        
        passInput.style.animation = 'none';
        passInput.offsetHeight;
        passInput.style.animation = 'shake 0.3s';

        btn.innerHTML = 'VERIFICA CREDENZIALI';
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }
});

// Nascondi errore rosso mentre scrivi
document.querySelectorAll('input').forEach(i => i.addEventListener('input', function(){
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.getElementById('err-login').style.display = 'none';
}));


// ==========================================
// 2. LOGICA RECUPERO PASSWORD (NATIVA)
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