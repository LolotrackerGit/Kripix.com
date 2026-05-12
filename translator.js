// translator.js

// IL TUO DIZIONARIO (Aggiungi qui le frasi esatte che vuoi tradurre)
const dizionario_EN = {
    "Progetti": "Projects",
    "Chi Siamo": "About Us",
    "Contatti": "Contact",
    "Scarica App": "Download App",
    "IL FILO DEL DUBBIO": "THE THREAD OF DOUBT",
    "A different way to see pixels.": "A different way to see pixels.",
    "I Nostri Giochi": "Our Games",
    "La Nostra Visione": "Our Vision"
};

export function initTranslator() {
    // Leggiamo la lingua salvata (di default italiano)
    const currentLang = localStorage.getItem('kripix_lang') || 'it';
    
    // Se è italiano, non facciamo nulla (il sito è già in italiano)
    if (currentLang === 'it') return;

    const dict = currentLang === 'en' ? dizionario_EN : {};

    // 1. TRADUCE TUTTO IL TESTO NORMALE NELLA PAGINA
    // Il TreeWalker scansiona solo il testo puro (ignora i tag HTML come <div> o <a>)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        const text = node.nodeValue.trim();
        // Se il testo esatto esiste nel nostro dizionario, lo sostituiamo
        if (dict[text]) {
            node.nodeValue = node.nodeValue.replace(text, dict[text]);
        }
    }

    // 2. TRADUCE I PLACEHOLDER (es. le scritte dentro gli input di login)
    document.querySelectorAll('[placeholder]').forEach(el => {
        const text = el.getAttribute('placeholder').trim();
        if (dict[text]) {
            el.setAttribute('placeholder', dict[text]);
        }
    });
}

// Funzione per cambiare lingua da un bottone
export function switchLanguage(lang) {
    localStorage.setItem('kripix_lang', lang);
    location.reload(); // Ricarica la pagina per applicare la traduzione
}