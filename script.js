/**
 * script.js - Sizes locale-aware landing page logic
 * Keeps each locale on its own URL and only updates UI bits client-side.
 */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'sizes-preferred-locale';
    const pageLocale = document.documentElement.lang.toLowerCase().startsWith('es') ? 'es' : 'en';
    const langLinks = Array.from(document.querySelectorAll('[data-lang-switch]'));
    const activeClasses = ['text-navy-deep', 'font-semibold', 'border-b', 'border-navy-deep', 'pb-0.5'];
    const inactiveClasses = ['text-gray-400', 'hover:text-navy-deep', 'transition-all'];

    const translations = {
        es: {
            privacy: 'Pol\u00edtica de Privacidad',
            terms: 'T\u00e9rminos y Condiciones',
            privacyContent: `
                <p class="mb-4">En <strong>SIZES</strong>, nos tomamos muy en serio tu privacidad. Esta pol\u00edtica describe c\u00f3mo manejamos tus datos.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">1. Datos que recogemos</h4>
                <p class="mb-4">Solo recogemos tu direcci\u00f3n de correo electr\u00f3nico cuando te suscribes voluntariamente a nuestra lista de acceso anticipado.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">2. Uso de los datos</h4>
                <p class="mb-4">Utilizamos tu email exclusivamente para informarte sobre el lanzamiento de SIZES y darte acceso a la aplicaci\u00f3n.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">3. Almacenamiento</h4>
                <p class="mb-4">Tus datos se guardan de forma segura en nuestros servidores y no se comparten con terceros ni se venden.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">4. Tus derechos</h4>
                <p class="mb-4">Puedes solicitar la baja de nuestra lista o la eliminaci\u00f3n de tus datos en cualquier momento escribiendo a <a href="mailto:info@sizes.es" class="text-gold-accent underline">info@sizes.es</a>.</p>
            `,
            termsContent: `
                <p class="mb-4">Bienvenido a <strong>SIZES</strong>. Al utilizar esta landing page, aceptas los siguientes t\u00e9rminos:</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">1. Uso del sitio</h4>
                <p class="mb-4">Este sitio web tiene car\u00e1cter puramente informativo para el lanzamiento de la aplicaci\u00f3n SIZES.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">2. Registro</h4>
                <p class="mb-4">Al registrarte, confirmas que tienes inter\u00e9s en recibir informaci\u00f3n sobre SIZES. Nos comprometemos a no enviarte SPAM.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">3. Propiedad Intelectual</h4>
                <p class="mb-4">Todo el contenido, dise\u00f1o y mockups mostrados son propiedad de SIZES o se utilizan con permiso.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">4. Contacto</h4>
                <p class="mb-4">Para cualquier duda legal, puedes contactarnos en <a href="mailto:info@sizes.es" class="text-gold-accent underline">info@sizes.es</a>.</p>
            `,
            playBadgeAlt: 'Disponible en Google Play'
        },
        en: {
            privacy: 'Privacy Policy',
            terms: 'Terms and Conditions',
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
                <p class="mb-4">This website is purely informational for the current SIZES app release.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">2. Registration</h4>
                <p class="mb-4">By registering, you confirm your interest in receiving information about SIZES. We commit to not sending you spam.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">3. Intellectual Property</h4>
                <p class="mb-4">All content, design, and mockups shown are property of SIZES or used with permission.</p>
                <h4 class="font-bold text-navy-deep mt-6 mb-2">4. Contact</h4>
                <p class="mb-4">For any legal enquiries, you can contact us at <a href="mailto:info@sizes.es" class="text-gold-accent underline">info@sizes.es</a>.</p>
            `,
            playBadgeAlt: 'Get it on Google Play'
        }
    };

    const mockups = [
        {
            id: 'mockup-1',
            src: {
                es: '/assets/screenshots/espanol/clear/guia-tallas-nino.jpeg',
                en: '/assets/screenshots/ingles/Clear/size-table-child.jpeg'
            }
        },
        {
            id: 'mockup-2',
            src: {
                es: '/assets/screenshots/espanol/clear/tallas-mujer.jpeg',
                en: '/assets/screenshots/ingles/Clear/brand-sizes-woman.jpeg'
            }
        },
        {
            id: 'mockup-3',
            src: {
                es: '/assets/screenshots/espanol/clear/home-3-usuarios.jpeg',
                en: '/assets/screenshots/ingles/Clear/home-3-users.jpeg'
            }
        }
    ];

    const setStoredLocale = (lang) => {
        try {
            window.localStorage.setItem(STORAGE_KEY, lang);
        } catch (error) {
            // Ignore storage failures and keep navigation working.
        }
    };

    const updateLanguageUi = (lang) => {
        window.currentLang = lang;

        langLinks.forEach((link) => {
            const isActive = link.dataset.langSwitch === lang;
            link.classList.remove(...activeClasses, ...inactiveClasses);
            link.classList.add(...(isActive ? activeClasses : inactiveClasses));
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        document.querySelectorAll('img[data-en][data-es]').forEach((img) => {
            const localizedAlt = img.getAttribute(`data-${lang}`);
            if (localizedAlt) {
                img.alt = localizedAlt;
            }
        });

        ['play-store-badge-hero', 'play-store-badge-footer'].forEach((id) => {
            const badge = document.getElementById(id);
            if (badge) {
                badge.src = `/assets/google-play-badge-${lang}.png`;
                badge.alt = translations[lang].playBadgeAlt;
            }
        });

        mockups.forEach((mockup) => {
            const element = document.getElementById(mockup.id);
            if (element) {
                element.src = mockup.src[lang];
                const localizedAlt = element.getAttribute(`data-${lang}`);
                if (localizedAlt) {
                    element.alt = localizedAlt;
                }
            }
        });
    };

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    event.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    langLinks.forEach((link) => {
        link.addEventListener('click', () => {
            setStoredLocale(link.dataset.langSwitch);
        });
    });

    window.openLegalModal = function (type) {
        const modal = document.getElementById('legalModal');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        const locale = window.currentLang || pageLocale;

        if (!modal || !title || !content) {
            return;
        }

        if (type === 'privacy') {
            title.innerText = translations[locale].privacy;
            content.innerHTML = translations[locale].privacyContent;
        } else {
            title.innerText = translations[locale].terms;
            content.innerHTML = translations[locale].termsContent;
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeLegalModal = function () {
        const modal = document.getElementById('legalModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    };

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('legal-trigger')) {
            window.openLegalModal(event.target.getAttribute('data-modal'));
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            window.closeLegalModal();
        }
    });

    updateLanguageUi(pageLocale);
});
