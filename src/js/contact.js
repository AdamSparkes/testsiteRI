"use strict";

(function () {
    const purposeButtons = Array.from(document.querySelectorAll(".contact-purpose-btn"));
    const purposePanels = Array.from(document.querySelectorAll(".purpose-panel"));
    const purposeInput = document.getElementById("contactPurpose");
    const subjectInput = document.getElementById("contactSubject");

    if (!purposeButtons.length || !purposePanels.length || !purposeInput) {
        return;
    }

    const validPurposes = new Set(["general", "support", "sales"]);
    const subjectHints = {
        general: "General inquiry about products, media, or partnerships",
        support: "Support request: product and issue summary",
        sales: "Sales request: product interest and timeline"
    };

    const setPanelInputsDisabled = (panel, disabled) => {
        panel.querySelectorAll("input, select, textarea").forEach((field) => {
            field.disabled = disabled;
        });
    };

    const setPurpose = (purpose) => {
        if (!validPurposes.has(purpose)) {
            return;
        }

        purposeInput.value = purpose;

        purposeButtons.forEach((button) => {
            const isActive = button.dataset.purposeTarget === purpose;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", String(isActive));
        });

        purposePanels.forEach((panel) => {
            const isActive = panel.dataset.purposePanel === purpose;
            panel.hidden = !isActive;
            setPanelInputsDisabled(panel, !isActive);
        });

        if (subjectInput && !subjectInput.value.trim()) {
            subjectInput.placeholder = subjectHints[purpose] || "Tell us what you need";
        }
    };

    purposeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setPurpose(button.dataset.purposeTarget || "general");
        });
    });

    const params = new URLSearchParams(window.location.search);
    const requestedType = (params.get("type") || "").toLowerCase();
    setPurpose(validPurposes.has(requestedType) ? requestedType : "general");
})();
