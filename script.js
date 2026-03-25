/**
 * script.js - Sizes Premium Landing Page Logic
 * Handles Form Submission, Smooth Scrolling, and ES/EN Translation Toggling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Language Data & Translations
    const translations = {
        es: {
            placeholder: "Tu correo electrónico",
            validationEmail: "Por favor, introduce un correo electrónico válido.",
            validationCheckbox: "Por favor, marca esta casilla si quieres continuar.",
            privacy: "Política de Privacidad",
            terms: "Términos y Condiciones",
            privacyContent: `
                <p class="mb-4">En <strong>SIZES</strong>, nos tomamos muy en serio tu privacidad. Esta política describe cómo manejamos tus datos.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">1. Datos que recogemos</h4>
                <p class="mb-4">Solo recogemos tu dirección de correo electrónico cuando te suscribes voluntariamente a nuestra lista de acceso anticipado.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">2. Uso de los datos</h4>
                <p class="mb-4">Utilizamos tu email exclusivamente para informarte sobre el lanzamiento de SIZES y darte acceso a la aplicación.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">3. Almacenamiento</h4>
                <p class="mb-4">Tus datos se guardan de forma segura en nuestros servidores y no se comparten con terceros ni se venden.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">4. Tus derechos</h4>
                <p class="mb-4">Puedes solicitar la baja de nuestra lista o la eliminación de tus datos en cualquier momento escribiendo a <a href="mailto:info@sizes.es" class="text-gold-accent underline">info@sizes.es</a>.</p>
            `,
            termsContent: `
                <p class="mb-4">Bienvenido a <strong>SIZES</strong>. Al utilizar esta landing page, aceptas los siguientes términos:</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">1. Uso del sitio</h4>
                <p class="mb-4">Este sitio web tiene carácter puramente informativo para el lanzamiento de la aplicación SIZES.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">2. Registro</h4>
                <p class="mb-4">Al registrarte, confirmas que tienes interés en recibir información sobre SIZES. Nos comprometemos a no enviarte SPAM.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">3. Propiedad Intelectual</h4>
                <p class="mb-4">Todo el contenido, diseño y mockups mostrados son propiedad de SIZES o se utilizan con permiso.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">4. Contacto</h4>
                <p class="mb-4">Para cualquier duda legal, puedes contactarnos en <a href="mailto:info@sizes.es" class="text-gold-accent underline">info@sizes.es</a>.</p>
            `
        },
        en: {
            placeholder: "Your email address",
            validationEmail: "Please enter a valid email address.",
            validationCheckbox: "Please check this box if you want to proceed.",
            privacy: "Privacy Policy",
            terms: "Terms and Conditions",
            privacyContent: `
                <p class="mb-4">At <strong>SIZES</strong>, we take your privacy seriously. This policy describes how we handle your data.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">1. Data we collect</h4>
                <p class="mb-4">We only collect your email address when you voluntarily subscribe to our early access list.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">2. Use of data</h4>
                <p class="mb-4">We use your email exclusively to inform you about the launch of SIZES and to grant you access to the application.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">3. Storage</h4>
                <p class="mb-4">Your data is stored securely on our servers and is not shared with third parties or sold.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">4. Your rights</h4>
                <p class="mb-4">You can request to be removed from our list or have your data deleted at any time by writing to <a href="mailto:info@sizes.es" class="text-gold-accent underline">info@sizes.es</a>.</p>
            `,
            termsContent: `
                <p class="mb-4">Welcome to <strong>SIZES</strong>. By using this landing page, you agree to the following terms:</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">1. Site use</h4>
                <p class="mb-4">This website is purely informational for the upcoming launch of the SIZES application.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">2. Registration</h4>
                <p class="mb-4">By registering, you confirm your interest in receiving information about SIZES. We commit to not sending you SPAM.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">3. Intellectual Property</h4>
                <p class="mb-4">All content, design, and mockups shown are property of SIZES or used with permission.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">4. Contact</h4>
                <p class="mb-4">For any legal inquiries, you can contact us at <a href="mailto:info@sizes.es" class="text-gold-accent underline">info@sizes.es</a>.</p>
            `
        }
    };

    // 3. Early Access Form Logic
    const handleForm = async (e) => {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const formFeedback = form.querySelector('.form-feedback-message');

        const email = emailInput.value.trim();
        if (!email) return;

        // UI Loading state
        submitBtn.style.opacity = '0.7';
        if (formFeedback) formFeedback.classList.add('hidden');

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('lang', window.currentLang || 'es');

            const response = await fetch('form-handler.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                if (formFeedback) {
                    formFeedback.classList.remove('hidden');
                    formFeedback.style.color = '#4E8D7C'; 
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

    // 4. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 5. Translation Logic
    const langEsBtn = document.getElementById('lang-es');
    const langEnBtn = document.getElementById('lang-en');
    window.currentLang = 'en';

    function switchLanguage(lang) {
        window.currentLang = lang;
        document.documentElement.lang = lang;

        // Update with [data-en/data-es]
        document.querySelectorAll('[data-en]').forEach(el => {
            el.innerHTML = el.getAttribute(`data-${lang}`);
            if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.placeholder = translations[lang].placeholder;
            }
        });

        // Update browser validation messages
        updateValidationMessages();

        // Toggle buttons
        if (langEsBtn && langEnBtn) {
            langEsBtn.className = lang === 'es' ? 'text-navy-deep font-semibold border-b border-navy-deep pb-0.5' : 'text-gray-400 hover:text-navy-deep transition-all';
            langEnBtn.className = lang === 'en' ? 'text-navy-deep font-semibold border-b border-navy-deep pb-0.5' : 'text-gray-400 hover:text-navy-deep transition-all';
        }

        // Mockups
        const mockupEs = document.querySelectorAll('.mockup-img-es');
        const mockupEn = document.querySelectorAll('.mockup-img-en');
        if (lang === 'es') {
            mockupEs.forEach(img => img.classList.remove('hidden-mockup'));
            mockupEn.forEach(img => img.classList.add('hidden-mockup'));
        } else {
            mockupEs.forEach(img => img.classList.add('hidden-mockup'));
            mockupEn.forEach(img => img.classList.remove('hidden-mockup'));
        }
    }

    if (langEsBtn) langEsBtn.addEventListener('click', () => switchLanguage('es'));
    if (langEnBtn) langEnBtn.addEventListener('click', () => switchLanguage('en'));

    function updateValidationMessages() {
        const lang = window.currentLang;
        document.querySelectorAll('input[required]').forEach(input => {
            // Reset first to get clean validity state
            input.setCustomValidity('');
            
            if (input.type === 'checkbox') {
                if (!input.checked) {
                    input.setCustomValidity(translations[lang].validationCheckbox);
                }
            } else if (input.type === 'email') {
                if (input.value === '') {
                    input.setCustomValidity(lang === 'en' ? 'Please fill in this field.' : 'Por favor, rellena este campo.');
                } else if (!input.validity.valid) {
                    input.setCustomValidity(translations[lang].validationEmail);
                }
            }
        });
    }

    // Handle dynamic validation reset on input
    document.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('input', updateValidationMessages);
        input.addEventListener('change', updateValidationMessages);
    });

    // Initial run
    updateValidationMessages();

    // 6. Modal Logic
    window.openLegalModal = function(type) {
        const modal = document.getElementById('legalModal');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        const lang = window.currentLang;

        if (type === 'privacy') {
            title.innerText = translations[lang].privacy;
            content.innerHTML = translations[lang].privacyContent;
        } else {
            title.innerText = translations[lang].terms;
            content.innerHTML = translations[lang].termsContent;
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeLegalModal = function() {
        const modal = document.getElementById('legalModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    // Bind triggers
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('legal-trigger')) {
            const type = e.target.getAttribute('data-modal');
            window.openLegalModal(type);
        }
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeLegalModal();
    });
});
