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

// ============================================================
// About page – scroll-driven timeline animation
// The vertical spine height is driven by scroll progress.
// Horizontal branches and cards reveal when the spine reaches
// each item's node position.
// ============================================================
(function () {
    const timeline = document.getElementById("about-timeline");
    const spine = document.getElementById("timeline-spine");
    if (!timeline || !spine) return;

    const items = Array.from(timeline.querySelectorAll(".timeline-item"));

    // Respect reduced-motion preference: show everything immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        spine.style.height = "100%";
        items.forEach((item) => item.classList.add("is-active"));
        return;
    }

    function update() {
        const tlRect = timeline.getBoundingClientRect();
        const viewH  = window.innerHeight;
        const tlH    = timeline.offsetHeight;

        // Anchor the spine tip to 70% down the viewport.
        // drawnPx = 0 when that anchor first touches the timeline top,
        // and grows to tlH as the anchor sweeps through the full timeline.
        // This means the glowing tip is always visible on screen while scrolling.
        const anchorY = viewH * 0.7;
        const drawnPx = Math.max(0, Math.min(tlH, anchorY - tlRect.top));
        spine.style.height = drawnPx + "px";

        // Items activate when the spine tip reaches their node.
        items.forEach((item) => {
            if (item.classList.contains("is-active")) return;
            const nodeTop = item.offsetTop + 22;
            if (drawnPx >= nodeTop) {
                item.classList.add("is-active");
            }
        });
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update(); // run once on load in case timeline is already in view
})();

// god I hope there's a way to auto do this in Wordpress.
