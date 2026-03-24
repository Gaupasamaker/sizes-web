/**
 * script.js - Sizes Premium Landing Page Logic
 * Handles Form Submission, Smooth Scrolling, and ES/EN Translation Toggling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Early Access Form Logic
    const form = document.getElementById('earlyAccessForm');
    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.getElementById('submitBtn');
    const formFeedback = document.getElementById('formFeedback');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (!email) return;

            // UI Loading state
            submitBtn.style.opacity = '0.7';
            formFeedback.classList.add('hidden');

            try {
                // Mock API Delay
                await new Promise(res => setTimeout(res, 1000));
                
                // UI Success state
                formFeedback.classList.remove('hidden');
                formFeedback.style.color = '#4E8D7C'; // Success Green / Gold
                form.reset();
            } catch (error) {
                formFeedback.classList.remove('hidden');
                formFeedback.style.color = '#B85C5C';
                formFeedback.textContent = window.currentLang === 'en' ? 'Error submitting. Try again.' : 'Error. Inténtalo de nuevo.';
            } finally {
                submitBtn.style.opacity = '1';
            }
        });
    }

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
            // Change promo image
            if (promoImg) promoImg.src = 'assets/promo/testers ES.png';
            document.documentElement.lang = 'es';
        } else {
            langEnBtn.className = 'text-navy-deep font-semibold border-b border-navy-deep pb-0.5 transition-all';
            langEsBtn.className = 'text-gray-400 group-hover:text-navy-deep transition-all';
            // Change promo image
            if (promoImg) promoImg.src = 'assets/promo/testers EN.png';
            document.documentElement.lang = 'en';
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
