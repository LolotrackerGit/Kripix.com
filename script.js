// ============================================================
//  SCRIPT.JS — Kripix Entertainment
//  Core: Firebase init, navbar auth, notifications, telemetry
// ============================================================


// ── 1. IMPORTAZIONI ─────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-functions.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-check.js";

import { injectNavbar, injectFooter, injectPageLoader, injectBackToTop } from './components.js';
import { initTranslator, switchLanguage } from './translator.js';


// ── 2. INIZIALIZZAZIONE FIREBASE ────────────────────────────

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


// ── 3. UTILITÀ: Sanitizzazione HTML ─────────────────────────
//    Previene XSS nelle notifiche che contengono link interni.
//    Consente solo <a>, <br>, <strong>, <em> con attributi sicuri.

function sanitizeHTML(raw) {
    const temp = document.createElement('div');
    temp.textContent = raw;
    let safe = temp.innerHTML;

    // Ripristina solo i tag sicuri che usiamo nelle notifiche
    safe = safe
        .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
        .replace(/&lt;strong&gt;/gi, '<strong>').replace(/&lt;\/strong&gt;/gi, '</strong>')
        .replace(/&lt;em&gt;/gi, '<em>').replace(/&lt;\/em&gt;/gi, '</em>');

    // Ripristina <a> solo verso pagine interne del sito (no URL esterni iniettati)
    safe = safe.replace(
        /&lt;a href=&quot;((?:terminale|profilo|libreria|index|login|progetti|contatti|download|impostazioni|studio|pagoda|engine|admin|faq|cookies|eula|dmr)\.html[^&]*)&quot;([^&]*)&gt;(.*?)&lt;\/a&gt;/gi,
        (_, href, attrs, text) => {
            const cleanAttrs = attrs.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
            return `<a href="${href}"${cleanAttrs}>${text}</a>`;
        }
    );
    return safe;
}


// ── 4. ESECUZIONE PRINCIPALE ────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // ─ A. Iniezione componenti (deve essere la prima cosa) ──
    injectNavbar();
    injectFooter();
    injectPageLoader();
    injectBackToTop();

    // ─ B. Menu hamburger e traduttore ───────────────────────
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        const setMenu = (open) => {
            hamburger.classList.toggle("active", open);
            navMenu.classList.toggle("active", open);
            hamburger.setAttribute("aria-expanded", String(open));
            document.body.classList.toggle("no-scroll", open);
        };

        hamburger.addEventListener("click", () => {
            setMenu(!navMenu.classList.contains("active"));
        });

        // Chiudi il menu dopo aver scelto una voce
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        // Esc chiude il menu mobile
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                setMenu(false);
                hamburger.focus();
            }
        });
    }

    // Inizializzazione traduttore e funzione globale per i bottoni HTML
    initTranslator();
    window.cambiaLingua = switchLanguage;

    // ─ C. Sistema notifiche globali (toast) ─────────────────
    let toastContainer = document.getElementById('kripix-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'kripix-toast-container';
        document.body.appendChild(toastContainer);
    }

    window.kripixNotify = function(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'kripix-toast';
        const borderColor = type === 'success' ? '#4caf50' : type === 'error' ? '#ff5555' : 'var(--accent-gold)';
        toast.style.borderLeftColor = borderColor;

        const titleDiv = document.createElement('div');
        titleDiv.className = 'kripix-toast-title';
        titleDiv.style.color = borderColor;
        titleDiv.textContent = `>> ${title}`;

        const msgDiv = document.createElement('div');
        // SICUREZZA: sanitizziamo l'HTML per prevenire XSS
        msgDiv.innerHTML = sanitizeHTML(message);

        toast.appendChild(titleDiv);
        toast.appendChild(msgDiv);

        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    };

    // ─ D. Logica avatar navbar e protezione ghost account ───
    const navbarList = document.querySelector('.nav-menu') || document.querySelector('.nav-links');

    // Se la pagina non ha una navbar standard (es. Login), ci fermiamo
    if (!navbarList) return;

    const dlBtnLi = navbarList.querySelector('.btn-launcher');
    const targetNode = dlBtnLi ? dlBtnLi.closest('li') : null;

    const li = document.createElement('li');
    li.id = 'auth-item';
    li.className = 'nav-user-container';

    window.updateNavbarAvatarDisplay = async function(user) {
        if (!user) {
            li.innerHTML = `<a href="login.html" class="btn-login-nav" data-i18n="ACCEDI">ACCEDI</a>`;
            if (!document.getElementById('auth-item')) {
                if (targetNode) navbarList.insertBefore(li, targetNode);
                else navbarList.appendChild(li);
            }
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            // Protezione ghost account (registrazione Google interrotta)
            if (!userSnap.exists()) {
                console.warn(">> PROTOCOLLO INCOMPLETO: Profilo database mancante.");
                if (!window.location.href.includes("login.html") && !window.location.href.includes("register.html")) {
                    alert("ATTENZIONE: Devi completare la registrazione scegliendo un Nome in Codice.");
                    await signOut(auth);
                    window.location.href = "login.html";
                    return;
                }
                return;
            }

            const me = userSnap.data();
            li.innerHTML = '';

            // Avatar
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'user-avatar';
            if (me.avatar_img) {
                avatarDiv.style.backgroundColor = 'transparent';
                avatarDiv.style.border = 'none';
                const img = document.createElement('img');
                img.src = me.avatar_img;
                img.alt = 'Avatar';
                img.style.cssText = 'width:100%; height:100%; border-radius:50%; object-fit:cover;';
                avatarDiv.appendChild(img);
            } else {
                avatarDiv.style.backgroundColor = me.color || '#e3c66c';
                avatarDiv.style.border = 'none';
                avatarDiv.textContent = me.username.charAt(0).toUpperCase();
            }

            // Dropdown menu
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

            // Link dropdown (costruiti in sicurezza)
            const links = [
                { href: 'profilo.html', text: 'IL MIO PROFILO' },
                { href: 'libreria.html', text: 'Libreria Giochi' },
                { href: 'impostazioni.html', text: 'Configurazione' },
            ];
            if (me.isAdmin) {
                links.push({ href: 'admin.html', text: 'Terminale Overseer', style: 'color:var(--accent-gold)' });
            }
            links.push({ href: '#', text: 'Disconnetti', id: 'action-logout', style: 'color:#ff5555' });

            links.forEach(l => {
                const a = document.createElement('a');
                a.href = l.href;
                a.textContent = l.text;
                a.setAttribute('data-i18n', l.text);
                if (l.id) a.id = l.id;
                if (l.style) a.style.cssText = l.style;
                dropdown.appendChild(a);
            });

            li.appendChild(avatarDiv);
            li.appendChild(dropdown);

            if (!document.getElementById('auth-item')) {
                if (targetNode) navbarList.insertBefore(li, targetNode);
                else navbarList.appendChild(li);
            }

            // Toggle dropdown
            avatarDiv.onclick = (e) => {
                dropdown.classList.toggle('show');
                e.stopPropagation();
            };

            // Logout
            li.querySelector('#action-logout').onclick = async (e) => {
                e.preventDefault();
                await signOut(auth);
                window.location.href = 'index.html';
            };

            // Chiudi dropdown cliccando fuori
            document.addEventListener('click', (e) => {
                if (dropdown && !li.contains(e.target)) dropdown.classList.remove('show');
            });

        } catch (error) {
            console.error("Errore Auth State:", error);
        }
    };

    // ─ E. Ascoltatore stato online/offline ──────────────────
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
                } catch (e) { /* Silenzioso — errore di rete non critico */ }
            };

            const goOffline = () => {
                updateDoc(userRef, { onlineStatus: "offline" }).catch(() => {});
            };

            goOnline();

            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') goOnline();
                else goOffline();
            });

            window.addEventListener('beforeunload', goOffline);
        }

        // ─ F. Notifiche chat in tempo reale ─────────────────
        if (user) {
            import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js").then(({ query, collection, where, onSnapshot }) => {

                let isFirstChatLoad = true;
                const knownChatTimes = {};

                const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", user.uid));

                onSnapshot(chatsQuery, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        const cData = change.doc.data();
                        const chatId = change.doc.id;
                        const lastTime = cData.lastMessageTime ? cData.lastMessageTime.toMillis() : 0;

                        // Primo caricamento: salva orari senza inviare notifiche
                        if (isFirstChatLoad) {
                            knownChatTimes[chatId] = lastTime;
                            return;
                        }

                        // Messaggio nuovo e non letto
                        if (cData[`unread_${user.uid}`] === true && (!knownChatTimes[chatId] || lastTime > knownChatTimes[chatId])) {
                            knownChatTimes[chatId] = lastTime;

                            // Non disturbare se l'utente è già nel terminale
                            if (window.location.href.includes("terminale.html")) return;

                            if (cData.isSystemChat) {
                                window.kripixNotify(
                                    "DIRETTIVA DI SISTEMA",
                                    `Messaggio critico dal Kripix Admin. <br><a href="terminale.html" style="color:#ff5555; text-decoration:underline; font-weight:bold; margin-top:5px; display:inline-block;">APRI TERMINALE</a>`,
                                    "error"
                                );
                            } else {
                                const otherGuy = cData.participants.find(p => p !== user.uid);
                                if (otherGuy) {
                                    getDoc(doc(db, "users", otherGuy)).then(uSnap => {
                                        if (!uSnap.exists()) return;
                                        const senderName = uSnap.data().username;
                                        window.kripixNotify(
                                            "TRASMISSIONE IN ENTRATA",
                                            `Messaggio da ${senderName}. <br><a href="terminale.html?agent=${encodeURIComponent(otherGuy)}" style="color:var(--accent-gold); text-decoration:underline; font-weight:bold; margin-top:5px; display:inline-block;">APRI TERMINALE</a>`,
                                            "info"
                                        );
                                    });
                                }
                            }
                        }
                        // Aggiorna timestamp se letto
                        else if (cData[`unread_${user.uid}`] === false) {
                            knownChatTimes[chatId] = lastTime;
                        }
                    });

                    if (isFirstChatLoad) isFirstChatLoad = false;
                });
            });
        }
    });
});


// ── 5. TELEMETRIA E COOKIE CONSENT ──────────────────────────

/**
 * Rileva browser e OS dell'utente per la telemetria.
 * Restituisce null se il consenso è negato.
 */
function getDeviceData() {
    const ua = navigator.userAgent;
    let browserName = "Unknown";
    let osName = "Unknown";

    // Ordine importante: Edge contiene "Chrome", Safari contiene "Chrome" su iOS, ecc.
    if (ua.match(/edg/i)) browserName = "Edge";
    else if (ua.match(/opr\//i)) browserName = "Opera";
    else if (ua.match(/chrome|chromium|crios/i)) browserName = "Chrome";
    else if (ua.match(/firefox|fxios/i)) browserName = "Firefox";
    else if (ua.match(/safari/i)) browserName = "Safari";

    if (ua.indexOf("Win") !== -1) osName = "Windows";
    else if (ua.indexOf("Android") !== -1) osName = "Android";
    else if (ua.indexOf("like Mac") !== -1) osName = "iOS";
    else if (ua.indexOf("Mac") !== -1) osName = "MacOS";
    else if (ua.indexOf("Linux") !== -1) osName = "Linux";

    return {
        browser: browserName,
        os: osName,
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language || navigator.userLanguage,
        userAgent: ua
    };
}

/**
 * Invia i dati di telemetria alla Cloud Function.
 * Se consent = "rejected", invia solo la pagina visitata (niente device data).
 */
async function dispatchTelemetry(consent) {
    const functions = getFunctions(app, 'europe-west1');
    const logTelemetry = httpsCallable(functions, 'logTelemetry');

    const payload = {
        consentLevel: consent,
        page: window.location.pathname.split('/').pop() || 'index.html',
        deviceData: consent === "accepted" ? getDeviceData() : null
    };

    try {
        await logTelemetry(payload);
    } catch (e) {
        console.error("Errore di trasmissione telemetria:", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const existingConsent = localStorage.getItem('kripix_cookie_consent');

    if (!existingConsent) {
        // Prima visita: mostra banner consenso cookie
        const cookieBanner = document.createElement('div');
        cookieBanner.id = 'kripix-cookie-banner';
        cookieBanner.innerHTML = `
            <div class="cookie-title" data-i18n="cookie_title">> INIZIALIZZAZIONE COOKIE</div>
            <div class="cookie-text" data-i18n="cookie_text" data-i18n-html>
                Il Network Operativo Kripix utilizza pacchetti di tracciamento (Cookie) essenziali per mantenere la connessione stabile e salvare le tue preferenze. Non vendiamo i tuoi dati ai corporati.
                <br><br>Puoi leggere il <a href="cookies.html">Dossier Privacy</a> per i dettagli completi.
            </div>
            <div class="cookie-buttons">
                <button id="btn-cookie-accept" class="btn-cookie btn-cookie-accept" data-i18n="ACCETTA TUTTI">ACCETTA TUTTI</button>
                <button id="btn-cookie-reject" class="btn-cookie btn-cookie-reject" data-i18n="SOLO ESSENZIALI">SOLO ESSENZIALI</button>
            </div>
        `;
        document.body.appendChild(cookieBanner);
        setTimeout(() => cookieBanner.classList.add('show'), 500);

        document.getElementById('btn-cookie-accept').addEventListener('click', () => {
            localStorage.setItem('kripix_cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.remove(), 600);
            if (window.kripixNotify) window.kripixNotify("SISTEMA", "Tracciamento completo autorizzato.", "success");
            dispatchTelemetry("accepted");
        });

        document.getElementById('btn-cookie-reject').addEventListener('click', () => {
            localStorage.setItem('kripix_cookie_consent', 'rejected');
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.remove(), 600);
            if (window.kripixNotify) window.kripixNotify("SISTEMA", "Tracciamento limitato ai pacchetti essenziali.", "info");
            dispatchTelemetry("rejected");
        });

    } else {
        // Visita successiva: telemetria silenziosa dopo che Firebase Auth è pronto
        setTimeout(() => dispatchTelemetry(existingConsent), 1500);
    }
});