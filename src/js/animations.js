"use strict";

(function () {
    const industryCards = Array.from(document.querySelectorAll(".industries-page .industry-card"));

    if (!industryCards.length) {
        return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
        return;
    }

    // Only apply hidden/reveal styles when JS animation is active.
    document.documentElement.classList.add("has-reveal-motion");

    const observer = new IntersectionObserver(
        (entries, revealObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        },
        {
            root: null,
            threshold: 0.2,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    industryCards.forEach((card) => observer.observe(card));
})();
