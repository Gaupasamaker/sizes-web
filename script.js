// Sizes Landing Page Logic
// Handles language switching and analytics

function switchLanguage(lang) {
    const translations = {
        'en': {
            'nav-home': 'Home',
            'nav-guides': 'Size Guides',
            'nav-app': 'Get App',
            'hero-title': 'Your Whole Family’s Sizes, Always in Your Pocket.',
            'hero-subtitle': 'Stop guessing. Sizes helps you store and compare measurements for your kids, partner, and friends. 100% private, offline-first.',
            'placeholder': 'Enter your email for early access...'
        },
        'es': {
            'nav-home': 'Inicio',
            'nav-guides': 'Guías de Tallas',
            'nav-app': 'Descargar App',
            'hero-title': 'Las tallas de toda tu familia, siempre en tu bolsillo.',
            'hero-subtitle': 'Deja de adivinar. Sizes te ayuda a guardar y comparar medidas para tus hijos, pareja y amigos. 100% privado y sin internet.',
            'placeholder': 'Introduce tu email para acceso anticipado...'
        }
    };

    if (translations[lang]) {
        // Update with [data-en/data-es]
        document.querySelectorAll('[data-en]').forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (el.tagName === 'META') {
                el.setAttribute('content', translation);
            } else {
                el.innerHTML = translation;
            }
            if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.placeholder = translations[lang].placeholder;
            }
        });

        // Set HTML lang attribute
        document.documentElement.lang = lang;
        
        // Save preference
        localStorage.setItem('sizes-lang', lang);
    }
}

// Initial language detection
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('sizes-lang') || (navigator.language.startsWith('es') ? 'es' : 'en');
    switchLanguage(savedLang);
});
