// ============================================================
//  COMPONENTS.JS — Kripix Entertainment
//  Inietta navbar, footer e schermata di caricamento nelle pagine.
//  Tutti gli elementi di testo portano data-i18n per il traduttore.
// ============================================================

import { switchLanguage } from './translator.js';

// Rende switchLanguage accessibile dagli onclick inline nella navbar
window.cambiaLingua = switchLanguage;


// ── PAGINA CORRENTE ─────────────────────────────────────────
//  Alcune pagine sono "figlie" di una voce di menu: la scheda di
//  un gioco appartiene a Progetti, il checkout pure, e così via.

const PAGE_ALIASES = {
    // engine.html non ha una voce propria: appartiene all'area Launcher
    'engine.html': 'download.html',
};

function getCurrentPage() {
    const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return PAGE_ALIASES[file] || file;
}

/**
 * Evidenzia il link che punta alla pagina in cui ci troviamo.
 * @param {HTMLElement} root  contenitore in cui cercare i link
 */
function markActiveLinks(root) {
    const current = getCurrentPage();

    root.querySelectorAll('a[href]').forEach(link => {
        const target = (link.getAttribute('href') || '').split(/[?#]/)[0].toLowerCase();
        if (!target || target === '#') return;

        if (target === current) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}


// ── NAVBAR ──────────────────────────────────────────────────

export function injectNavbar() {
    const navElement = document.getElementById('main-nav');
    if (!navElement) return;

    navElement.innerHTML = `
        <div class="logo-text"><a href="index.html">KRIPIX</a></div>
        <button class="hamburger" type="button" aria-label="Apri il menu" aria-expanded="false" aria-controls="nav-menu"><span></span><span></span><span></span></button>
        <ul class="nav-links nav-menu" id="nav-menu">
            <li><a href="progetti.html" data-i18n="Progetti">Progetti</a></li>
            <li><a href="studio.html" data-i18n="Chi Siamo">Chi Siamo</a></li>
            <li><a href="contatti.html" data-i18n="Contatti">Contatti</a></li>
            <li><a href="download.html" class="btn-launcher" data-i18n="Scarica App">Scarica App</a></li>
            <li><a href="faq.html" class="nav-help" title="Centro assistenza" aria-label="Centro assistenza">
                <svg class="icon icon-md" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.2 9.3a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.4-2.8 4"/><path d="M12 17.5h.01"/></svg>
                <span class="nav-help-label" data-i18n="Assistenza">Assistenza</span>
            </a></li>
            <li class="lang-switcher">
                <button type="button" class="lang-btn" data-lang="it" lang="it" aria-label="Italiano" onclick="window.cambiaLingua('it')">IT</button>
                <span class="lang-separator" aria-hidden="true">|</span>
                <button type="button" class="lang-btn" data-lang="en" lang="en" aria-label="English" onclick="window.cambiaLingua('en')">EN</button>
            </li>
        </ul>
    `;

    markActiveLinks(navElement);
    // Il toggle hamburger è gestito in script.js (DOMContentLoaded)
}


// ── FOOTER ──────────────────────────────────────────────────

export function injectFooter() {
    const footerElement = document.getElementById('main-footer');
    if (!footerElement) return;

    footerElement.innerHTML = `
        <div class="footer-grid">
            <!-- Colonna 1: Brand -->
            <div class="footer-col">
                <h2 style="color:var(--text-main); font-weight:900; letter-spacing:2px; margin-bottom:10px;">KRIPIX</h2>
                <p style="color:#666; font-size:0.85rem; font-family:'Courier Prime';">
                    A different way to see pixels.<br>
                    <span data-i18n="Sviluppato in Italia.">Sviluppato in Italia.</span>
                </p>
            </div>

            <!-- Colonna 2: Navigazione -->
            <div class="footer-col">
                <h4 data-i18n="NETWORK">NETWORK</h4>
                <ul>
                    <li><a href="progetti.html" data-i18n="Progetti & Giochi">Progetti & Giochi</a></li>
                    <li><a href="studio.html" data-i18n="Lo Studio">Lo Studio</a></li>
                    <li><a href="download.html" data-i18n="Kripix Launcher">Kripix Launcher</a></li>
                    <li><a href="contatti.html" data-i18n="Contatti">Contatti</a></li>
                </ul>
            </div>

            <!-- Colonna 3: Documenti -->
            <div class="footer-col">
                <h4 data-i18n="ARCHIVI">ARCHIVI</h4>
                <ul>
                    <li><a href="faq.html" data-i18n="Domande Frequenti">Domande Frequenti</a></li>
                    <li><a href="eula.html" data-i18n="Dossier E.U.L.A.">Dossier E.U.L.A.</a></li>
                    <li><a href="cookies.html" data-i18n="Privacy Policy">Privacy Policy</a></li>
                    <li><a href="dmr.html" data-i18n="Policy DRM">Policy DRM</a></li>
                </ul>
            </div>

            <!-- Colonna 4: Social -->
            <div class="footer-col">
                <h4 data-i18n="CONNESSIONI">CONNESSIONI</h4>
                <ul>
                    <li><a href="https://discord.gg/FwwuYJ4Dn3" target="_blank" rel="noopener noreferrer" data-i18n="Discord Server">Discord Server</a></li>
                    <li><a href="https://x.com/KripixEnt" target="_blank" rel="noopener noreferrer" data-i18n="Twitter / X">Twitter / X</a></li>
                    <li><a href="https://www.youtube.com/@KripixEntertainment" target="_blank" rel="noopener noreferrer" data-i18n="YouTube">YouTube</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            &copy; ${new Date().getFullYear()} Kripix Entertainment. <span data-i18n="Tutti i diritti riservati.">Tutti i diritti riservati.</span>
        </div>
    `;

    markActiveLinks(footerElement);
}


// ── TASTO "TORNA SU" ────────────────────────────────────────
//  Compare dopo mezza schermata di scroll e riporta in cima.

export function injectBackToTop() {
    if (document.getElementById('back-to-top')) return;

    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Torna in cima alla pagina');
    btn.innerHTML = `<svg class="icon icon-md" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>`;
    document.body.appendChild(btn);

    const threshold = 500;
    let ticking = false;

    const refresh = () => {
        btn.classList.toggle('visible', window.scrollY > threshold);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(refresh);
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });

    refresh();
}


// ── SCHERMATA DI CARICAMENTO (Page Loader) ──────────────────
//  Overlay a schermo intero stile "terminale" che appare
//  durante la navigazione e si dissolve quando il DOM è pronto.

export function injectPageLoader() {
    // Crea l'overlay
    const overlay = document.createElement('div');
    overlay.id = 'page-loader';
    overlay.setAttribute('aria-hidden', 'true');

    // Contenuto interno: logo + testo "scanning" animato
    overlay.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">KRIPIX</div>
            <div class="loader-bar">
                <div class="loader-bar-fill"></div>
            </div>
            <div class="loader-text" data-i18n="CONNESSIONE AL NETWORK...">CONNESSIONE AL NETWORK...</div>
        </div>
    `;

    // Inserisci come primo figlio del body
    document.body.prepend(overlay);

    // Dissolvi quando la pagina è pronta
    const dismiss = () => {
        overlay.classList.add('loader-fade-out');
        overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
        // Fallback: rimuovi dopo 600ms se transitionend non scatta
        setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 600);
    };

    // Attendi che tutte le risorse critiche siano caricate
    if (document.readyState === 'complete') {
        // Mostra almeno brevemente per non flashare
        setTimeout(dismiss, 300);
    } else {
        window.addEventListener('load', () => setTimeout(dismiss, 200), { once: true });
    }
}
