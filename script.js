function config(open) {
    const configMenu = document.getElementById("config-menu");
    const grayOverlay = document.getElementById("gray-overlay");

    configMenu.style.display = open ? "flex" : "none";
    grayOverlay.style.display = open ? "block" : "none";
}

function setColor(number, color) {
    document.documentElement.style.setProperty(`--color-${number}`, color);
}

function applyColors(colors) {
    if (!Array.isArray(colors) || colors.length < 6) return;
    for (let i = 0; i < 6; i++) {
        setColor(i + 1, colors[i]);
    }
}

function applyModName(name) {
    if (!name) return;
    const modNameEl = document.getElementById("mod-title-text");
    if (modNameEl) modNameEl.textContent = name;
}

function applyTitle(title, modName) {
    const textEl = document.getElementById("mod-title-text");
    const imgEl = document.getElementById("mod-title-img");
    if (!textEl || !imgEl) return;

    const config = title || {};
    const mode = config.mode === "image" ? "image" : "text";
    const parsedSize = parseFloat(config.size);
    const size = !isNaN(parsedSize) ? parsedSize : 2;

    if (mode === "image" && config.image) {
        textEl.style.display = "none";
        imgEl.src = getModPath(config.image);
        imgEl.style.height = `${size}rem`;
        imgEl.style.display = "block";
    } else {
        imgEl.style.display = "none";
        imgEl.src = "";
        textEl.style.display = "inline-block";
        textEl.style.fontSize = `${size}rem`;
        if (modName) textEl.textContent = modName;
    }
}

function applyHomeBackground(image) {
    const el = document.getElementById("home-screen-img");
    if (!el || !image) return;
    el.style.backgroundImage = `url('${getModPath(image)}')`;
}

function applyGearButton(show) {
    const gearBtn = document.getElementById("config-btn");
    if (gearBtn) gearBtn.style.display = show === false ? "none" : "flex";
}

function applyCredits(portBy, modBy) {
    const portEl = document.getElementById("port-by-credit");
    const modEl = document.getElementById("mod-by-credit");
    if (portEl && portBy) portEl.textContent = portBy;
    if (modEl && modBy) modEl.textContent = modBy;
}

const UI_SIZE_DEFAULT = 100;

// Works out the interface size limits based on the screen size.
// Small screens (phones) get a lower ceiling so the layout doesn't
// break; big screens can go further. The minimum also shrinks a
// bit on small screens to give more room to adjust.
function getSizeLimits() {
    const width = window.innerWidth;

    let min = 70;
    let max = 150;

    if (width <= 400) {
        min = 50;
        max = 110;
    } else if (width <= 700) {
        min = 60;
        max = 130;
    } else if (width <= 1100) {
        min = 70;
        max = 150;
    } else {
        min = 70;
        max = 180;
    }

    return { min, max };
}

function updateSliderLimits() {
    const slider = document.getElementById("ui-size-slider");
    if (!slider) return;

    const { min, max } = getSizeLimits();
    slider.min = min;
    slider.max = max;

    // If the current value (e.g. coming from localStorage) is outside
    // the new range, clamp it to the nearest limit and re-save.
    const current = parseInt(slider.value, 10);
    if (current < min || current > max) {
        const adjusted = Math.min(Math.max(current, min), max);
        applyInterfaceSize(adjusted);
        localStorage.setItem("uiSize", adjusted);
    }
}

function applyInterfaceSize(percentage) {
    document.documentElement.style.fontSize = percentage + "%";

    const slider = document.getElementById("ui-size-slider");
    const valueLabel = document.getElementById("ui-size-value");
    if (slider) slider.value = percentage;
    if (valueLabel) valueLabel.textContent = percentage;
}

function loadInterfaceSize() {
    updateSliderLimits();
    const saved = localStorage.getItem("uiSize");
    const { min, max } = getSizeLimits();
    let percentage = saved ? parseInt(saved, 10) : UI_SIZE_DEFAULT;
    percentage = Math.min(Math.max(percentage, min), max);
    applyInterfaceSize(percentage);
}

function applyTheme(light) {
    const themeToggle = document.getElementById("theme-toggle");
    document.body.classList.toggle("light-theme", light);
    if (themeToggle) themeToggle.checked = light;
}

let appConfigCache = null;

// Reads the version folder from the ?v= query param, falling back to "1".
function getModFolder() {
    const params = new URLSearchParams(window.location.search);
    return params.get("v") || "1";
}

function getModPath(file) {
    return `${getModFolder()}/${file}`;
}

async function loadAppConfig() {
    if (appConfigCache) return appConfigCache;
    try {
        const response = await fetch("versions.json");
        if (!response.ok) throw new Error("versions.json not found");
        const versions = await response.json();
        const folder = getModFolder();
        const found = Array.isArray(versions)
            ? versions.find((v) => String(v.folder) === String(folder))
            : null;
        appConfigCache = found || {};
    } catch (err) {
        console.warn("Could not load versions.json, using defaults.", err);
        appConfigCache = {};
    }
    return appConfigCache;
}

async function loadTheme() {
    const config = await loadAppConfig();

    // hide the toggle entirely if this version doesn't want one
    const themeRow = document.getElementById("theme-row");
    const themeTitle = document.getElementById("theme-title");
    const showToggle = config["theme-toggle"] === true;
    if (themeRow) themeRow.style.display = showToggle ? "flex" : "none";
    if (themeTitle) themeTitle.style.display = showToggle ? "" : "none";

    // saved preference wins over the version's default
    const saved = localStorage.getItem("theme");
    let light;
    if (saved !== null) {
        light = saved === "light";
    } else {
        light = config["default-theme"] === "light";
    }

    applyTheme(light);
}

async function loadModInfo() {
    const config = await loadAppConfig();
    applyModName(config["mod-name"]);
    applyTitle(config["title"], config["mod-name"]);
    applyCredits(config["port-by"], config["mod-by"]);
    applyColors(config["colors"]);
    applyHomeBackground(config["background-image"]);
}

document.addEventListener("DOMContentLoaded", () => {
    // config menu
    const configBtn = document.getElementById("config-btn");
    const configMenu = document.getElementById("config-menu");
    const grayOverlay = document.getElementById("gray-overlay");

    configBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        config(true);
    });

    configMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    grayOverlay.addEventListener("click", () => {
        config(false);
    });

    document.addEventListener("click", () => {
        config(false);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            config(false);
        }
    });

    // tabs
    const tabs = document.querySelectorAll("#tabs .tab");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("selected"));
            contents.forEach(c => c.classList.remove("active"));

            tab.classList.add("selected");

            const id = tab.dataset.tab;
            document.getElementById(id).classList.add("active");
        });
    });

    // theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("change", function () {
        applyTheme(this.checked);
        localStorage.setItem("theme", this.checked ? "light" : "dark");
    });

    // interface size
    const uiSizeSlider = document.getElementById("ui-size-slider");
    const resetSizeBtn = document.getElementById("reset-size");

    uiSizeSlider.addEventListener("input", function () {
        const percentage = parseInt(this.value, 10);
        applyInterfaceSize(percentage);
        localStorage.setItem("uiSize", percentage);
    });

    resetSizeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyInterfaceSize(UI_SIZE_DEFAULT);
        localStorage.removeItem("uiSize");
    });

    // init
    loadTheme();
    loadModInfo();
    loadInterfaceSize();
});

window.addEventListener("load", () => {
    const fade = document.getElementById("fade");
    fade.classList.add("fade-out");
    fade.addEventListener("transitionend", () => {
        fade.remove();
    });
});

// re-check slider limits on resize
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateSliderLimits, 200);
});
