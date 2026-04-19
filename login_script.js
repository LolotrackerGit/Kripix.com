// --- LOGICA LOGIN ---
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.validation-msg').forEach(el => el.style.display = 'none');
    const userInput = document.getElementById('usernameInput');
    const passInput = document.getElementById('passwordInput');
    const username = userInput.value.trim();
    const password = passInput.value;
    const userDB = JSON.parse(localStorage.getItem('kripix_database')) || [];
    const foundUser = userDB.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!foundUser || foundUser.password !== password) {
        userInput.classList.add('input-error');
        passInput.classList.add('input-error');
        const msg = document.getElementById('err-login');
        msg.innerText = '>> ERRORE: CREDENZIALI NON VALIDE [ACCESS DENIED]';
        msg.style.display = 'block';
        passInput.style.animation = 'none';
        passInput.offsetHeight;
        passInput.style.animation = 'shake 0.3s';
        return;
    }
    const btn = this.querySelector('button');
    btn.innerHTML = 'ACCESSO CONSENTITO';
    btn.style.background = '#4caf50';
    btn.style.color = 'black';
    btn.style.borderColor = '#4caf50';
    localStorage.setItem('kripix_user', foundUser.username);
    localStorage.setItem('kripix_color', foundUser.color);
    if(foundUser.games && foundUser.games.includes('harrow')) {
        localStorage.setItem('owned_game_harrow', 'true');
    } else {
        localStorage.removeItem('owned_game_harrow');
    }
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
});

document.querySelectorAll('input').forEach(i => i.addEventListener('input', function(){
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.getElementById('err-login').style.display = 'none';
}));

// --- LOGICA RECUPERO PASSWORD ---
const resetModal = document.getElementById('reset-modal');
const forgotLink = document.getElementById('forgot-pass-link');

forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    resetModal.style.display = 'flex';
});

function closeResetModal() {
    resetModal.style.display = 'none';
}

function sendResetCode() {
    const emailInput = document.getElementById('reset-email');
    const email = emailInput.value.trim();
    const msgEl = document.getElementById('reset-msg');
    const btn = document.getElementById('btn-send-code');

    const db = JSON.parse(localStorage.getItem('kripix_database')) || [];
    const userExists = db.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!userExists) {
        msgEl.innerText = ">> ERRORE: Email non trovata nel database.";
        msgEl.style.color = '#ff5555';
        msgEl.style.display = 'block';
        return;
    }

    btn.innerText = "INVIO...";
    btn.disabled = true;

    // Genera e salva il codice
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('reset_code_' + email, resetCode);
    
    // Scadenza del codice dopo 10 minuti (opzionale ma consigliato)
    setTimeout(() => {
        localStorage.removeItem('reset_code_' + email);
    }, 600000);

    const templateParams = {
        to_email: email,
        reset_code: resetCode,
    };

    // Sostituisci con SERVICE ID e NUOVO TEMPLATE ID
    emailjs.send('service_4xvl1j1', 'template_160g64a', templateParams)
        .then(function(response) {
            msgEl.innerText = ">> Codice inviato. Controlla la tua posta.";
            msgEl.style.color = '#4caf50';
            msgEl.style.display = 'block';
            setTimeout(() => {
                // Reindirizza alla pagina di reset passando l'email nell'URL
                window.location.href = `reset.html?email=${encodeURIComponent(email)}`;
            }, 2000);
        }, function(error) {
            msgEl.innerText = ">> Errore di trasmissione. Riprova.";
            msgEl.style.color = '#ff5555';
            msgEl.style.display = 'block';
            btn.innerText = "INVIA CODICE";
            btn.disabled = false;
        });
}