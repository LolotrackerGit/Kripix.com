import { auth, db } from './script.js';
import { onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Funzione globale per le notifiche Toast
const notify = (title, message, type) => window.kripixNotify ? window.kripixNotify(title, message, type) : alert(message);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();
        // Carica dati
        document.getElementById('disp-user').innerText = userData.username;
        document.getElementById('disp-email').innerText = userData.email;
        // Carica impostazioni privacy
        const privacy = userData.privacy || { visibility: true, telemetry: false, newsletter: true };
        document.getElementById('priv-vis').checked = privacy.visibility;
        document.getElementById('priv-tel').checked = privacy.telemetry;
        document.getElementById('priv-news').checked = privacy.newsletter;
    }

    // Aggiungi listener per salvare le modifiche
    document.querySelectorAll('#panel-privacy input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', async () => {
            const updatedPrivacy = {
                visibility: document.getElementById('priv-vis').checked,
                telemetry: document.getElementById('priv-tel').checked,
                newsletter: document.getElementById('priv-news').checked
            };
            await updateDoc(userDocRef, { privacy: updatedPrivacy });
            notify("SISTEMA", "Impostazioni Privacy salvate nel Cloud.", "success");
        });
    });
});

// GESTIONE TAB
document.querySelectorAll('.settings-nav button').forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.id.replace('btn-tab-', 'panel-');
        document.querySelectorAll('.settings-panel').forEach(panel => panel.style.display = 'none');
        document.querySelectorAll('.settings-nav button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabId).style.display = 'block';
        button.classList.add('active');
    });
});

// AVATAR E COLORI
const avatarImages = [
    "https://api.dicebear.com/7.x/bottts/svg?seed=Kripix1&backgroundColor=111111", "https://api.dicebear.com/7.x/bottts/svg?seed=Harrow&backgroundColor=111111", "https://api.dicebear.com/7.x/bottts/svg?seed=Cyber&backgroundColor=111111", "https://api.dicebear.com/7.x/bottts/svg?seed=Neon&backgroundColor=111111",
    "https://api.dicebear.com/7.x/shapes/svg?seed=Geometric1&backgroundColor=111111", "https://api.dicebear.com/7.x/shapes/svg?seed=Geometric2&backgroundColor=111111", "https://api.dicebear.com/7.x/shapes/svg?seed=Geometric3&backgroundColor=111111", "https://api.dicebear.com/7.x/shapes/svg?seed=Geometric4&backgroundColor=111111"
];
const avatarGrid = document.getElementById('avatar-choices');
avatarImages.forEach(imgUrl => {
    const option = document.createElement('div');
    option.className = 'avatar-option';
    option.innerHTML = `<img src="${imgUrl}" alt="Avatar">`;
    option.addEventListener('click', () => selectAvatarImage(imgUrl));
    avatarGrid.appendChild(option);
});

document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => changeColor(btn.style.backgroundColor));
});

async function changeColor(newColor) {
    const user = auth.currentUser;
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
        color: newColor,
        avatar_img: null 
    });
    if(window.updateNavbarAvatarDisplay) window.updateNavbarAvatarDisplay();
    notify("SISTEMA", "Segnale cromatico impostato.", "success");
}

async function selectAvatarImage(imgUrl) {
    const user = auth.currentUser;
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { avatar_img: imgUrl });
    if(window.updateNavbarAvatarDisplay) window.updateNavbarAvatarDisplay();
    notify("SISTEMA", "ID Visivo aggiornato.", "success");
}

// GESTIONE MODALI (omesso per brevità, resta lo stesso)