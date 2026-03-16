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

        // progress: 0 when timeline top reaches bottom of viewport,
        //           1 when timeline bottom reaches top of viewport.
        const progress = Math.max(0, Math.min(1,
            (viewH - tlRect.top) / (viewH + tlH)
        ));

        const drawnPx = progress * tlH;
        spine.style.height = drawnPx + "px";

        // Activate each item once the drawn spine passes its node (top + 22px).
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
