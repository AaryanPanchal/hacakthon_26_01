/* ==========================================================================
   Nauka-Uber — shared config & helpers
   Loaded by index.html, owner.html and booker.html. Keeping the port list
   and webhook URLs here — instead of copy-pasted inside each page — is
   what keeps the three pages "in sync": edit a value once, every page
   picks it up, and the booker/owner port dropdowns can never drift apart.
   ========================================================================== */

const NaukaUber = (() => {

    // ---- Single place to point every form at your n8n instance ----------
    // Replace these three placeholders with your real n8n webhook URLs.
    // (Kept as three separate endpoints because each form posts a
    // different payload shape — registration, daily status, booking.)
    const CONFIG = {
        registrationWebhookUrl: "https://n8n.cloud",
        dailyStatusWebhookUrl: "https://n8n.cloud",
        bookingWebhookUrl: "https://n8n.cloud",
    };

    // ---- Single source of truth for every port dropdown ------------------
    const PORTS = [
        { value: "Mundra", label: "Mundra Port (Gujarat)" },
        { value: "Kandla", label: "Kandla Port (Gujarat)" },
        { value: "Paradip", label: "Paradip Port (Odisha)" },
        { value: "Haldia", label: "Haldia Port (West Bengal)" },
    ];

    /** Fill a <select> with the shared port list. Keeps any existing
     *  disabled placeholder <option> that's already first in the markup. */
    function populatePortSelect(selectEl) {
        if (!selectEl) return;
        PORTS.forEach((port) => {
            const opt = document.createElement("option");
            opt.value = port.value;
            opt.textContent = port.label;
            selectEl.appendChild(opt);
        });
    }

    const ICONS = {
        success: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z" clip-rule="evenodd"/></svg>',
        error: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 012 0v3a1 1 0 01-2 0V9zm1-3a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"/></svg>',
    };

    /** Show a success/error message inside a status box. */
    function showStatus(boxEl, type, message) {
        if (!boxEl) return;
        boxEl.className = "status-msg visible " + type;
        boxEl.innerHTML = (ICONS[type] || "") + "<span>" + message + "</span>";
    }

    function hideStatus(boxEl) {
        if (!boxEl) return;
        boxEl.className = "status-msg";
        boxEl.innerHTML = "";
    }

    /** Persist the last vessel a ship owner registered, so the Owner
     *  Console can offer to pre-fill its IMO field for them. Purely a
     *  browser-local convenience — no server involved. */
    function saveLastVessel(vessel) {
        try {
            localStorage.setItem("naukaUberLastVessel", JSON.stringify(vessel));
        } catch (err) {
            /* localStorage unavailable (private mode, etc.) — safe to ignore */
        }
    }

    function getLastVessel() {
        try {
            const raw = localStorage.getItem("naukaUberLastVessel");
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            return null;
        }
    }

    /** Mark the current page's entry in the shared top nav as active,
     *  based on the current filename. */
    function markActiveNav() {
        const path = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".nav-links a[data-page]").forEach((link) => {
            if (link.getAttribute("data-page") === path) link.classList.add("active");
        });
    }

    document.addEventListener("DOMContentLoaded", markActiveNav);

    return { CONFIG, PORTS, populatePortSelect, showStatus, hideStatus, saveLastVessel, getLastVessel };
})();
