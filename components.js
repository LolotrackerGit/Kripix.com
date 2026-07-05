// components.js

export function injectNavbar() {
    // Cerca il contenitore della navbar
    const navElement = document.getElementById('main-nav');
    
    // Se la pagina non ha la navbar standard (es. Login o 404), interrompe la funzione
    if (!navElement) return;

    // Inietta l'HTML
    navElement.innerHTML = `
        <div class="logo-text"><a href="index.html">KRIPIX</a></div>
        <div class="hamburger"><span></span><span></span><span></span></div>
        <ul class="nav-links nav-menu">
            <li><a href="progetti.html">Progetti</a></li>
            <li><a href="studio.html">Chi Siamo</a></li>
            <li><a href="contatti.html">Contatti</a></li>
            <li><a href="download.html" class="btn-launcher">Scarica App</a></li>
            <li class="lang-switcher">
                <span onclick="window.cambiaLingua('it')">IT</span>
                <span class="lang-separator">|</span>
                <span onclick="window.cambiaLingua('en')">EN</span>
            </li>
        </ul>
    `;
}

export function injectFooter() {
    // Cerca il contenitore del footer
    const footerElement = document.getElementById('main-footer');
    
    // Se la pagina non ha il footer, interrompe la funzione
    if (!footerElement) return;

    // Inietta l'HTML
    footerElement.innerHTML = `
        <div class="footer-grid">
            <!-- Colonna 1: Brand -->
            <div class="footer-col">
                <h2 style="color:var(--text-main); font-weight:900; letter-spacing:2px; margin-bottom:10px;">KRIPIX</h2>
                <p style="color:#666; font-size:0.85rem; font-family:'Courier Prime';">
                    A different way to see pixels.<br>
                    Sviluppato in Italia.
                </p>
            </div>
            
            <!-- Colonna 2: Navigazione Rapida -->
            <div class="footer-col">
                <h4>NETWORK</h4>
                <ul>
                    <li><a href="progetti.html">Progetti & Giochi</a></li>
                    <li><a href="studio.html">Lo Studio</a></li>
                    <li><a href="download.html">Kripix Launcher</a></li>
                    <li><a href="contatti.html">Contatti</a></li>
                </ul>
            </div>
            
            <!-- Colonna 3: Documenti e Supporto -->
            <div class="footer-col">
                <h4>ARCHIVI</h4>
                <ul>
                    <li><a href="eula.html">Dossier E.U.L.A.</a></li>
                    <li><a href="privacy.html">Privacy Policy</a></li>
                    <li><a href="dmr.html">Policy DRM</a></li>
                    <li><a href="#">Supporto Tecnico</a></li> 
                </ul>
            </div>
            
            <!-- Colonna 4: Social -->
            <div class="footer-col">
                <h4>CONNESSIONI</h4>
                <ul>
                    <li><a href="https://discord.gg/FwwuYJ4Dn3">Discord Server</a></li>
                    <li><a href="https://x.com/KripixEnt">Twitter / X</a></li>
                    <li><a href="https://www.youtube.com/@KripixEntertainment">YouTube</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            &copy; 2026 Kripix Entertainment. Tutti i diritti riservati.
        </div>
    `;
}