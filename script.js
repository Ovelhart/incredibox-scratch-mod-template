function config(open) {
    const configMenu = document.getElementById("config-menu");
    const grayOverlay = document.getElementById("parte-cinza");

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
    const modNameEl = document.getElementById("nome-do-mod");
    if (modNameEl) modNameEl.textContent = name;
}

function applyTitle(title, modName) {
    const textEl = document.getElementById("nome-do-mod");
    const imgEl = document.getElementById("mod-title-img");
    if (!textEl || !imgEl) return;

    const config = title || {};
    const mode = config.mode === "image" ? "image" : "text";
    const parsedSize = parseFloat(config.size);
    const size = !isNaN(parsedSize) ? parsedSize : 2;

    if (mode === "image" && config.image) {
        textEl.style.display = "none";
        imgEl.src = `mod/${config.image}`;
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

function applyGearButton(show) {
    const gearBtn = document.getElementById("config-btn");
    if (gearBtn) gearBtn.style.display = show === false ? "none" : "flex";
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

async function loadAppConfig() {
    if (appConfigCache) return appConfigCache;
    try {
        const response = await fetch("mod/app.json");
        if (!response.ok) throw new Error("app.json not found");
        appConfigCache = await response.json();
    } catch (err) {
        console.warn("Could not load app.json, using defaults.", err);
        appConfigCache = {};
    }
    return appConfigCache;
}

async function loadTheme() {
    const config = await loadAppConfig();

    // ---- Show/hide the theme toggle based on app.json ----
    const themeRow = document.getElementById("theme-row");
    const themeTitle = document.getElementById("theme-title");
    const showToggle = config["theme-toggle"] === true;
    if (themeRow) themeRow.style.display = showToggle ? "flex" : "none";
    if (themeTitle) themeTitle.style.display = showToggle ? "" : "none";

    // ---- Pick the theme: localStorage takes priority; if there's no
    // saved value, fall back to the default theme from app.json. ----
    const saved = localStorage.getItem("tema");
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
}

document.addEventListener("DOMContentLoaded", () => {
    // ---- Config menu ----
    const configBtn = document.getElementById("config-btn");
    const configMenu = document.getElementById("config-menu");
    const grayOverlay = document.getElementById("parte-cinza");

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

    // ---- Tabs ----
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

    // ---- Theme toggle ----
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("change", function () {
        applyTheme(this.checked);
        localStorage.setItem("tema", this.checked ? "light" : "dark");
    });

    // ---- UI size ----
    const uiSizeSlider = document.getElementById("ui-size-slider");
    const resetSizeBtn = document.getElementById("restaurar-tamanho");

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

    // ---- Init ----
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

// ---- Re-check the slider limits whenever the screen is resized ----
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateSliderLimits, 200);
});
