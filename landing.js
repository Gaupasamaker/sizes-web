(() => {
    "use strict";

    const measurementId = "G-4LF8FDCZ2B";
    const consentStorageKey = "sizes-analytics-consent-v1";
    const language = document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "es";
    const isMeasuredPage = /^\/(es|en)(\/|$)/.test(window.location.pathname);
    let analyticsLoaded = false;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500
    });

    const readConsent = () => {
        try {
            return window.localStorage.getItem(consentStorageKey);
        } catch (error) {
            return null;
        }
    };

    const saveConsent = (value) => {
        try {
            window.localStorage.setItem(consentStorageKey, value);
        } catch (error) {
            // If storage is unavailable, consent applies only to this page view.
        }
    };

    const getPageType = () => {
        const path = window.location.pathname;
        if (/^\/(es|en)\/?$/.test(path)) return "home";
        if (/^\/(es\/blog|en\/blog)\/?$/.test(path)) return "blog_hub";
        if (/^\/(es\/guias|en\/guides)\/?$/.test(path)) return "guide_hub";
        if (/^\/(es|en)\/blog\/.+\.html$/.test(path)) return "blog_article";
        if (/^\/es\/guias\/.+\.html$/.test(path) || /^\/en\/guides\/.+\.html$/.test(path)) return "guide_article";
        return "other";
    };

    const loadAnalytics = () => {
        if (analyticsLoaded || !isMeasuredPage) return;
        analyticsLoaded = true;

        window.gtag("js", new Date());
        window.gtag("config", measurementId, {
            allow_ad_personalization_signals: false,
            allow_google_signals: false,
            cookie_expires: 33696000,
            send_page_view: true,
            site_language: language,
            page_type: getPageType()
        });

        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
    };

    const track = (eventName, parameters = {}) => {
        if (readConsent() !== "granted" || !analyticsLoaded) return;
        window.gtag("event", eventName, parameters);
    };

    const deleteAnalyticsCookies = () => {
        document.cookie.split(";").forEach((entry) => {
            const name = entry.split("=")[0].trim();
            if (!name.startsWith("_ga")) return;
            document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
            document.cookie = `${name}=; Max-Age=0; path=/; domain=.sizes.es; SameSite=Lax`;
        });
    };

    const injectConsentStyles = () => {
        const style = document.createElement("style");
        style.textContent = `
            .sizes-consent{position:fixed;z-index:10000;left:16px;right:16px;bottom:16px;max-width:720px;margin:auto;padding:20px;background:#fff;color:#171717;border:1px solid rgba(23,23,23,.16);border-radius:18px;box-shadow:0 18px 55px rgba(0,0,0,.2);font:inherit}
            .sizes-consent[hidden]{display:none}.sizes-consent h2{margin:0 0 8px;font-size:1.15rem}.sizes-consent p{margin:0;line-height:1.55}.sizes-consent a{color:inherit;text-decoration:underline}.sizes-consent__actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.sizes-consent button{min-height:44px;padding:10px 16px;border:1px solid #171717;border-radius:999px;background:#fff;color:#171717;font:inherit;font-weight:700;cursor:pointer}.sizes-consent button:hover,.sizes-consent button:focus-visible{background:#171717;color:#fff}.sizes-consent-settings{position:fixed;z-index:9999;left:14px;bottom:14px;padding:9px 13px;border:1px solid rgba(23,23,23,.22);border-radius:999px;background:#fff;color:#171717;box-shadow:0 8px 28px rgba(0,0,0,.14);font:600 .78rem/1.2 inherit;cursor:pointer}.sizes-consent:not([hidden])~.sizes-consent-settings{display:none}@media(max-width:520px){.sizes-consent{left:10px;right:10px;bottom:10px;padding:17px}.sizes-consent__actions{grid-template-columns:1fr}}
        `;
        document.head.appendChild(style);
    };

    const createConsentUi = () => {
        injectConsentStyles();

        const banner = document.createElement("section");
        banner.className = "sizes-consent";
        banner.setAttribute("role", "dialog");
        banner.setAttribute("aria-modal", "true");
        banner.setAttribute("aria-labelledby", "sizes-consent-title");

        const title = document.createElement("h2");
        title.id = "sizes-consent-title";
        title.textContent = language === "es" ? "Tu privacidad, sin rodeos" : "Your privacy, clearly";

        const copy = document.createElement("p");
        copy.append(document.createTextNode(language === "es"
            ? "Solo usamos Google Analytics si aceptas, para entender qué contenidos resultan útiles. No cargamos medición ni publicidad antes de tu elección. "
            : "We only use Google Analytics if you accept, to understand which content is useful. We load no measurement or advertising before your choice. "));
        const policyLink = document.createElement("a");
        policyLink.href = language === "es" ? "/politica-cookies.html" : "/cookie-policy.html";
        policyLink.textContent = language === "es" ? "Política de cookies" : "Cookie policy";
        copy.append(policyLink, document.createTextNode("."));

        const actions = document.createElement("div");
        actions.className = "sizes-consent__actions";
        const reject = document.createElement("button");
        reject.type = "button";
        reject.textContent = language === "es" ? "Rechazar analítica" : "Reject analytics";
        const accept = document.createElement("button");
        accept.type = "button";
        accept.textContent = language === "es" ? "Aceptar analítica" : "Accept analytics";
        actions.append(reject, accept);
        banner.append(title, copy, actions);

        const settings = document.createElement("button");
        settings.type = "button";
        settings.className = "sizes-consent-settings";
        settings.textContent = language === "es" ? "Configurar cookies" : "Cookie settings";
        settings.setAttribute("aria-label", language === "es" ? "Abrir configuración de cookies" : "Open cookie settings");

        const showBanner = () => {
            banner.hidden = false;
            reject.focus();
        };

        accept.addEventListener("click", () => {
            saveConsent("granted");
            window.gtag("consent", "update", { analytics_storage: "granted" });
            loadAnalytics();
            banner.hidden = true;
        });

        reject.addEventListener("click", () => {
            saveConsent("denied");
            window.gtag("consent", "update", { analytics_storage: "denied" });
            deleteAnalyticsCookies();
            if (analyticsLoaded) {
                window.setTimeout(() => {
                    deleteAnalyticsCookies();
                    window.location.reload();
                }, 100);
                return;
            }
            banner.hidden = true;
        });

        settings.addEventListener("click", showBanner);
        document.body.append(banner, settings);

        if (readConsent() === null) {
            showBanner();
        } else {
            banner.hidden = true;
        }
    };

    const initializePage = () => {
        const menuButton = document.querySelector("[data-menu-button]");
        const mobileNav = document.querySelector(".mobile-nav");
        const revealItems = document.querySelectorAll(".reveal");
        const guideRail = document.querySelector(".guides-rail");
        const guidePrev = document.querySelector("[data-guide-prev]");
        const guideNext = document.querySelector("[data-guide-next]");
        const shareButtons = document.querySelectorAll("[data-share-url]");

        createConsentUi();

        if (readConsent() === "granted") {
            window.gtag("consent", "update", { analytics_storage: "granted" });
            loadAnalytics();
        }

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", () => {
                const isOpen = mobileNav.dataset.open === "true";
                mobileNav.dataset.open = isOpen ? "false" : "true";
                menuButton.setAttribute("aria-expanded", isOpen ? "false" : "true");
            });

            mobileNav.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => {
                    mobileNav.dataset.open = "false";
                    menuButton.setAttribute("aria-expanded", "false");
                });
            });
        }

        if (guideRail && guidePrev && guideNext) {
            const scrollGuides = (direction) => {
                const firstCard = guideRail.querySelector(".guide-card");
                const distance = firstCard ? firstCard.getBoundingClientRect().width + 18 : 360;
                guideRail.scrollBy({ left: direction * distance, behavior: "smooth" });
            };

            guidePrev.addEventListener("click", () => scrollGuides(-1));
            guideNext.addEventListener("click", () => scrollGuides(1));
            guideRail.addEventListener("wheel", (event) => event.preventDefault(), { passive: false });
        }

        shareButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const shareUrl = button.dataset.shareUrl || window.location.href;
                const shareTitle = button.dataset.shareTitle || document.title;
                const status = button.closest(".share-card")?.querySelector("[data-share-status]");

                track("share_click", { method: navigator.share ? "native" : "clipboard", content_type: getPageType() });
                try {
                    if (navigator.share) {
                        await navigator.share({ title: shareTitle, url: shareUrl });
                        if (status) status.textContent = button.dataset.shareDone || "Shared.";
                        return;
                    }
                    await navigator.clipboard.writeText(shareUrl);
                    if (status) status.textContent = button.dataset.copyDone || "Link copied.";
                } catch (error) {
                    if (status) {
                        const fallback = button.dataset.shareFallback || "Copy this link:";
                        status.textContent = `${fallback} ${shareUrl}`;
                    }
                }
            });
        });

        document.addEventListener("click", (event) => {
            const link = event.target.closest("a[href]");
            if (!link) return;
            const destination = new URL(link.href, window.location.href);

            if (destination.hostname === "play.google.com") {
                track("play_store_click", { link_url: destination.href });
            }

            const targetLanguage = destination.pathname.match(/^\/(es|en)(\/|$)/)?.[1];
            if (destination.origin === window.location.origin && targetLanguage && targetLanguage !== language) {
                track("language_switch", { from_language: language, to_language: targetLanguage });
            }
        }, { capture: true });

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.14 });

            revealItems.forEach((item) => observer.observe(item));
            requestAnimationFrame(() => {
                revealItems.forEach((item) => {
                    const rect = item.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) item.classList.add("is-visible");
                });
            });
        } else {
            revealItems.forEach((item) => item.classList.add("is-visible"));
        }

        if (window.location.hash) {
            window.addEventListener("load", () => {
                const target = document.querySelector(window.location.hash);
                if (target) setTimeout(() => target.scrollIntoView({ block: "start" }), 60);
            }, { once: true });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializePage, { once: true });
    } else {
        initializePage();
    }
})();
