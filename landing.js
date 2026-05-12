document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector("[data-menu-button]");
    const mobileNav = document.querySelector(".mobile-nav");
    const revealItems = document.querySelectorAll(".reveal");
    const guideRail = document.querySelector(".guides-rail");
    const guidePrev = document.querySelector("[data-guide-prev]");
    const guideNext = document.querySelector("[data-guide-next]");
    const shareButtons = document.querySelectorAll("[data-share-url]");

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
            const gap = 18;
            const distance = firstCard ? firstCard.getBoundingClientRect().width + gap : 360;
            guideRail.scrollBy({ left: direction * distance, behavior: "smooth" });
        };

        guidePrev.addEventListener("click", () => scrollGuides(-1));
        guideNext.addEventListener("click", () => scrollGuides(1));
        guideRail.addEventListener("wheel", (event) => {
            event.preventDefault();
        }, { passive: false });
    }

    shareButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const shareUrl = button.dataset.shareUrl || window.location.href;
            const shareTitle = button.dataset.shareTitle || document.title;
            const status = button.closest(".share-card")?.querySelector("[data-share-status]");

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
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    item.classList.add("is-visible");
                }
            });
        });
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    if (window.location.hash) {
        window.addEventListener("load", () => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                setTimeout(() => target.scrollIntoView({ block: "start" }), 60);
            }
        }, { once: true });
    }
});
