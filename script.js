/**
 * script.js - Sizes Premium Landing Page Logic
 * Handles Form Submission, Smooth Scrolling, and ES/EN Translation Toggling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Early Access Form Logic
    const handleForm = async (e) => {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const formFeedback = form.querySelector('[id$="FormFeedback"]');

        const email = emailInput.value.trim();
        if (!email) return;

        // UI Loading state
        submitBtn.style.opacity = '0.7';
        if (formFeedback) formFeedback.classList.add('hidden');

        try {
            const formData = new FormData();
            formData.append('email', email);

            const response = await fetch('form-handler.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                // UI Success state
                if (formFeedback) {
                    formFeedback.classList.remove('hidden');
                    formFeedback.style.color = '#4E8D7C'; // Success Green
                }
                form.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            if (formFeedback) {
                formFeedback.classList.remove('hidden');
                formFeedback.style.color = '#B85C5C';
                formFeedback.textContent = window.currentLang === 'en' ? 'Error. Try again.' : 'Error. Inténtalo de nuevo.';
            }
        } finally {
            submitBtn.style.opacity = '1';
        }
    };

    const mainForm = document.getElementById('earlyAccessForm');
    const footerForm = document.getElementById('footerEarlyAccessForm');

    if (mainForm) mainForm.addEventListener('submit', handleForm);
    if (footerForm) footerForm.addEventListener('submit', handleForm);

    // 3. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 4. Translation Toggle Logic
    const langToggle = document.getElementById('langToggle');
    const langEsBtn = document.getElementById('lang-es');
    const langEnBtn = document.getElementById('lang-en');
    const promoImg = document.getElementById('promoImg');
    
    // Check initial language (Default: ES)
    window.currentLang = 'es';

    function setLanguage(lang) {
        window.currentLang = lang;
        
        // Update styling of the toggle (Editorial Cream Classes)
        if (lang === 'es') {
            langEsBtn.className = 'text-navy-deep font-semibold border-b border-navy-deep pb-0.5 transition-all';
            langEnBtn.className = 'text-gray-400 group-hover:text-navy-deep transition-all';
            document.documentElement.lang = 'es';
        } else {
            langEnBtn.className = 'text-navy-deep font-semibold border-b border-navy-deep pb-0.5 transition-all';
            langEsBtn.className = 'text-gray-400 group-hover:text-navy-deep transition-all';
            document.documentElement.lang = 'en';
        }

        // Update promotional and mockup images
        const promoImg = document.getElementById('promo-img');
        const mockup1 = document.getElementById('mockup-1');
        const mockup2 = document.getElementById('mockup-2');
        const mockup3 = document.getElementById('mockup-3');
        
        if (lang === 'es') {
            if (promoImg) promoImg.src = 'assets/promo/testers-es.png';
            if (mockup1) mockup1.src = 'assets/screenshots/espanol/clear/guia-tallas-nino.jpeg';
            if (mockup2) mockup2.src = 'assets/screenshots/espanol/clear/tallas-mujer.jpeg';
            if (mockup3) mockup3.src = 'assets/screenshots/espanol/clear/home-3-usuarios.jpeg';
        } else {
            if (promoImg) promoImg.src = 'assets/promo/testers-en.png';
            if (mockup1) mockup1.src = 'assets/screenshots/ingles/clear/new-profile-child.jpeg';
            if (mockup2) mockup2.src = 'assets/screenshots/ingles/clear/brand-sizes-woman.jpeg';
            if (mockup3) mockup3.src = 'assets/screenshots/ingles/clear/home-3-users.jpeg';
        }

        // Update all translatable text elements
        const elements = document.querySelectorAll('[data-en][data-es]');
        elements.forEach(el => {
            // For placeholder inputs
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = el.getAttribute(`data-${lang}`);
            } else if (el.tagName === 'IMG' && el.hasAttribute('alt')) {
                // For image alternate text
                el.alt = el.getAttribute(`data-${lang}`);
            } else {
                // Using innerHTML to preserve spans / br tags inside text
                el.innerHTML = el.getAttribute(`data-${lang}`);
            }
        });
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            setLanguage(window.currentLang === 'es' ? 'en' : 'es');
        });
    }
    // --- Premium Polish (Reversible) ---
    // 3. CTA Pulse effect
    const mainCtas = document.querySelectorAll('button[type="submit"]');
    mainCtas.forEach(btn => btn.classList.add('pulse-hover'));
});
