// ============================================================
//  COMPONENTS.JS — Kripix Entertainment
//  Inietta navbar, footer e schermata di caricamento nelle pagine.
//  Tutti gli elementi di testo portano data-i18n per il traduttore.
// ============================================================

import { switchLanguage } from './translator.js';

// Rende switchLanguage accessibile dagli onclick inline nella navbar
window.cambiaLingua = switchLanguage;


// ── NAVBAR ──────────────────────────────────────────────────

export function injectNavbar() {
    const navElement = document.getElementById('main-nav');
    if (!navElement) return;

    navElement.innerHTML = `
        <div class="logo-text"><a href="index.html">KRIPIX</a></div>
        <div class="hamburger"><span></span><span></span><span></span></div>
        <ul class="nav-links nav-menu">
            <li><a href="progetti.html" data-i18n="Progetti">Progetti</a></li>
            <li><a href="studio.html" data-i18n="Chi Siamo">Chi Siamo</a></li>
            <li><a href="contatti.html" data-i18n="Contatti">Contatti</a></li>
            <li><a href="download.html" class="btn-launcher" data-i18n="Scarica App">Scarica App</a></li>
            <li class="lang-switcher">
                <span onclick="window.cambiaLingua('it')">IT</span>
                <span class="lang-separator">|</span>
                <span onclick="window.cambiaLingua('en')">EN</span>
            </li>
        </ul>
    `;
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
                    <li><a href="eula.html" data-i18n="Dossier E.U.L.A.">Dossier E.U.L.A.</a></li>
                    <li><a href="privacy.html" data-i18n="Privacy Policy">Privacy Policy</a></li>
                    <li><a href="dmr.html" data-i18n="Policy DRM">Policy DRM</a></li>
                    <li><a href="#" data-i18n="Supporto Tecnico">Supporto Tecnico</a></li>
                </ul>
            </div>

            <!-- Colonna 4: Social -->
            <div class="footer-col">
                <h4 data-i18n="CONNESSIONI">CONNESSIONI</h4>
                <ul>
                    <li><a href="https://discord.gg/FwwuYJ4Dn3" data-i18n="Discord Server">Discord Server</a></li>
                    <li><a href="https://x.com/KripixEnt" data-i18n="Twitter / X">Twitter / X</a></li>
                    <li><a href="https://www.youtube.com/@KripixEntertainment" data-i18n="YouTube">YouTube</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            &copy; 2026 Kripix Entertainment. Tutti i diritti riservati.
        </div>
    `;
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
