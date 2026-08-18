function config(open) {
    const configMenu = document.getElementById("config-menu");
    const grayOverlay = document.getElementById("parte-cinza");

    configMenu.style.display = open ? "flex" : "none";
    grayOverlay.style.display = open ? "block" : "none";
}

function setColor(number, color) {
    document.documentElement.style.setProperty(`--color-${number}`, color);
}

async function loadColorsFromJson() {
    try {
        const response = await fetch("colors.json");

        if (!response.ok) throw new Error("colors.json not found");

        const data = await response.json();

        if (!Array.isArray(data.colors) || data.colors.length < 6)
            throw new Error("Invalid colors.json format");

        for (let i = 0; i < 6; i++) {
            setColor(i + 1, data.colors[i]);
        }

    } catch (err) {
        console.warn("Could not load colors.json, using CSS defaults.", err);
    }
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

async function loadAppConfig() {
    try {
        const response = await fetch("mod/app-config.json");
        if (!response.ok) throw new Error("app-config.json not found");
        return await response.json();
    } catch (err) {
        console.warn("Could not load app-config.json, using defaults.", err);
        return {};
    }
}

async function loadTheme() {
    const config = await loadAppConfig();

    // ---- Show/hide the theme toggle based on app-config.json ----
    const themeRow = document.getElementById("theme-row");
    const themeTitle = document.getElementById("theme-title");
    const showToggle = config["theme-toggle"] === true;
    if (themeRow) themeRow.style.display = showToggle ? "flex" : "none";
    if (themeTitle) themeTitle.style.display = showToggle ? "" : "none";

    // ---- Pick the theme: localStorage takes priority; if there's no
    // saved value, fall back to the default theme from app-config.json. ----
    const saved = localStorage.getItem("tema");
    let light;
    if (saved !== null) {
        light = saved === "light";
    } else {
        light = config["default-theme"] === "light";
    }

    applyTheme(light);
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
    loadColorsFromJson();
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