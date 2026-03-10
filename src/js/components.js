"use strict";

(function () {
    const headerMount = document.querySelector("[data-component='header']");
    const footerMount = document.querySelector("[data-component='footer']");

    if (!headerMount && !footerMount) {
        return;
    }

    const normalizeBase = (value) => {
        if (!value || value === ".") {
            return ".";
        }
        return value.endsWith("/") ? value.slice(0, -1) : value;
    };

    const resolveAssetPath = (basePath, componentPath) => `${basePath}/${componentPath}`;

    const applyBase = (markup, basePath) => markup.replace(/__BASE__/g, basePath);

    const fallbackTemplates = {
        "components/header.html": `<nav class="main-nav" aria-label="Primary navigation">
    <a href="__BASE__/index.html" class="logo">
        <img src="__BASE__/images/Rutter-Logo-(White-Text)-PNG.png" alt="Rutter Inc logo" class="logo-img">
    </a>
    <ul class="main-nav-list">
        <li><a href="__BASE__/index.html" data-nav="home">Home</a></li>
        <li><a href="__BASE__/pages/about.html" data-nav="about">About</a></li>
        <li class="nav-products">
            <a href="__BASE__/pages/products.html" data-nav="products">Products</a>
            <ul class="products-dropdown" aria-label="Product pages">
                <li><a href="__BASE__/products/current-monitor.html" data-nav="product">Current Monitor</a></li>
                <li><a href="__BASE__/products/ice-navigator.html" data-nav="product">Ice Navigator</a></li>
                <li><a href="__BASE__/products/oil-spill-detection.html" data-nav="product">Oil Spill Detection</a></li>
                <li><a href="__BASE__/products/small-target-surveillance.html" data-nav="product">Small Target Surveillance</a></li>
                <li><a href="__BASE__/products/wamos.html" data-nav="product">WaMoS</a></li>
                <li><a href="__BASE__/products/wave-signal.html" data-nav="product">Wave Signal</a></li>
                <li><a href="__BASE__/products/unify.html" data-nav="product">Unify</a></li>
            </ul>
        </li>
        <li><a href="__BASE__/pages/industries.html" data-nav="industries">Industries</a></li>
        <li><a href="__BASE__/pages/contact.html" data-nav="contact">Contact</a></li>
    </ul>
</nav>`,
        "components/footer.html": `<footer id="contact" class="site-footer" aria-label="Contact and navigation">
    <div class="site-footer-inner">
        <div class="footer-contact">
            <img src="__BASE__/images/Rutter-Horizontal-Logo-(White-Text)-PNG.png" alt="Rutter horizontal logo" class="footer-brand-logo">
            <h3>Contact Us</h3>

            <div class="footer-addresses">
                <div class="footer-block footer-address">
                    <h4>Company Address</h4>
                    <p>XXX-XXXX Waterfront Drive<br>Suite XXX<br>City, ST X0X 0X0</p>
                </div>

                <div class="footer-block footer-address">
                    <h4>Subsidiary Address</h4>
                    <p>XXX-XXXX Innovation Park Road<br>Unit XX<br>City, ST X0X 0X0</p>
                </div>
            </div>

            <div class="footer-block">
                <h4>Email</h4>
                <p><a href="mailto:sales@xxx-xxxx.com">sales@xxx-xxxx.com</a></p>
                <p><a href="mailto:support@xxx-xxxx.com">support@xxx-xxxx.com</a></p>
                <p><a href="mailto:general@xxx-xxxx.com">general@xxx-xxxx.com</a></p>
            </div>
        </div>

        <div class="footer-nav-wrap">
            <nav class="footer-nav-column" aria-label="Product suite links">
                <h4>Product Suite</h4>
                <ul>
                    <li><a href="__BASE__/products/current-monitor.html">Current Monitor</a></li>
                    <li><a href="__BASE__/products/ice-navigator.html">Ice Navigator</a></li>
                    <li><a href="__BASE__/products/oil-spill-detection.html">Oil Spill Detection</a></li>
                    <li><a href="__BASE__/products/small-target-surveillance.html">Small Target Surveillance</a></li>
                    <li><a href="__BASE__/products/wamos.html">WaMoS</a></li>
                    <li><a href="__BASE__/products/wave-signal.html">Wave Signal</a></li>
                    <li><a href="__BASE__/products/unify.html">Unify</a></li>
                </ul>
            </nav>

            <nav class="footer-nav-column" aria-label="Site navigation links">
                <h4>Navigation</h4>
                <ul>
                    <li><a href="__BASE__/index.html">Home</a></li>
                    <li><a href="__BASE__/pages/about.html">About</a></li>
                    <li><a href="__BASE__/pages/products.html">Products</a></li>
                    <li><a href="__BASE__/pages/industries.html">Industries</a></li>
                    <li><a href="__BASE__/pages/newsletter.html">Newsletter</a></li>
                    <li><a href="__BASE__/pages/contact.html">Contact</a></li>
                </ul>
            </nav>
        </div>
    </div>
</footer>`
    };

    const mountComponent = async (mountNode, componentPath) => {
        const basePath = normalizeBase(mountNode.dataset.base || ".");
        let markup = "";

        try {
            const response = await fetch(resolveAssetPath(basePath, componentPath));
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            markup = await response.text();
        } catch (_error) {
            markup = fallbackTemplates[componentPath] || "";
        }

        if (!markup) {
            return;
        }

        mountNode.outerHTML = applyBase(markup, basePath);
    };

    const markActiveNav = () => {
        const nav = document.querySelector(".main-nav");
        if (!nav) {
            return;
        }

        const currentPath = window.location.pathname.toLowerCase();
        const pageName = currentPath.split("/").pop() || "index.html";

        const map = {
            "index.html": "home",
            "about.html": "about",
            "products.html": "products",
            "industries.html": "industries",
            "contact.html": "contact",
            "newsletter.html": "products",
            "current-monitor.html": "products",
            "ice-navigator.html": "products",
            "oil-spill-detection.html": "products",
            "small-target-surveillance.html": "products",
            "wamos.html": "products",
            "wave-signal.html": "products",
            "unify.html": "products"
        };

        const navKey = map[pageName] || "home";

        nav.querySelectorAll("a[data-nav]").forEach((link) => {
            const isCurrent = link.dataset.nav === navKey;
            link.classList.toggle("is-current", isCurrent);
            if (isCurrent) {
                link.setAttribute("aria-current", "page");
            }
        });
    };

    const enableDropdownTouchToggle = () => {
        const productsItem = document.querySelector(".nav-products");
        if (!productsItem) {
            return;
        }

        const productsLink = productsItem.querySelector("a[data-nav='products']");
        if (!productsLink) {
            return;
        }

        productsLink.addEventListener("click", (event) => {
            if (window.innerWidth <= 768) {
                const isOpen = productsItem.classList.contains("is-open");
                if (!isOpen) {
                    event.preventDefault();
                    productsItem.classList.add("is-open");
                }
            }
        });

        document.addEventListener("click", (event) => {
            if (!productsItem.contains(event.target)) {
                productsItem.classList.remove("is-open");
            }
        });
    };

    const init = async () => {
        const tasks = [];

        if (headerMount) {
            tasks.push(mountComponent(headerMount, "components/header.html"));
        }

        if (footerMount) {
            tasks.push(mountComponent(footerMount, "components/footer.html"));
        }

        await Promise.all(tasks);
        markActiveNav();
        enableDropdownTouchToggle();
    };

    init().catch((error) => {
        console.error(error);
    });
})();
