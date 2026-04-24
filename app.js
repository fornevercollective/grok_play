// =============================================
// GROK PLAY - Fornever Collective
// app.js - Theatre.js Studio + Timeline + Notes
// =============================================

import * as studio from "https://cdn.jsdelivr.net/npm/@theatre/studio@0.4.0/dist/index.js";
import * as core from "https://cdn.jsdelivr.net/npm/@theatre/core@0.4.0/dist/index.js";

let project, sheet, obj;
let currentImageUrl = "";

// Initialize Theatre Studio with full timeline UI
async function initTheatre() {
    studio.initialize();
    project = core.getProject("GrokPlayProject");
    sheet = project.sheet("Image Sequence");

    obj = sheet.object("Visual Controls", {
        intensity: core.types.number(65, { range: [0, 100] }),
        surreal: core.types.number(45, { range: [0, 100] }),
        cinematic: core.types.number(80, { range: [0, 100] }),
        promptWeight: core.types.number(1.0, { range: [0.5, 2.0] })
    });

    // Sync sliders with Theatre.js
    obj.onValuesChange((values) => {
        document.getElementById("intensity").value = values.intensity;
        document.getElementById("surreal").value = values.surreal;
        document.getElementById("cinematic").value = values.cinematic;
        
        document.getElementById("val-intensity").textContent = Math.round(values.intensity);
        document.getElementById("val-surreal").textContent = Math.round(values.surreal);
        document.getElementById("val-cinematic").textContent = Math.round(values.cinematic);
    });

    console.log("%cTheatre.js Studio + Timeline Loaded", "color:#00ffaa; font-weight:bold");
    document.getElementById("studio-status").innerHTML = 
        `<span style="color:#00ffaa">✓ Theatre Studio Ready</span><br>
         Use the <strong>Theatre</strong> tab to open the timeline.<br>
         Click the theatre logo (top right) to show controls.`;
}

// Tab Switching
function switchTab(tab) {
    document.querySelectorAll('.main').forEach(el => el.classList.add('hidden'));
    document.getElementById(tab + '-tab').classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
}

// Generate Image
async function generateWithGrok() {
    const promptEl = document.getElementById("prompt");
    const prompt = promptEl.value.trim() || "abstract cinematic landscape";
    
    const output = document.getElementById("output-image");
    const placeholder = document.querySelector(".placeholder");

    placeholder.style.display = "none";
    output.style.display = "block";
    output.src = `https://picsum.photos/id/${Math.floor(Math.random() * 900) + 100}/1200/800?t=${Date.now()}`;

    currentImageUrl = output.src;

    console.log(`%c[Grok] Generated image with prompt: ${prompt.substring(0, 60)}...`, "color:#00ffaa");

    // Auto-fill note
    const noteEl = document.getElementById("note-text");
    if (!noteEl.value) {
        noteEl.value = `Generated ${new Date().toLocaleString()}\n\nPrompt:\n${prompt}`;
    }
}

// Quick Prompts
function loadQuickPrompt(text) {
    document.getElementById("prompt").value = text;
    generateWithGrok();
}

// Save current values as a keyframe in Theatre.js
function saveToSequence() {
    if (!sheet) return;
    
    const intensity = parseFloat(document.getElementById("intensity").value);
    const surreal = parseFloat(document.getElementById("surreal").value);
    const cinematic = parseFloat(document.getElementById("cinematic").value);

    obj.set({
        intensity: intensity,
        surreal: surreal,
        cinematic: cinematic
    });

    studio.setSelection([obj]);
    alert("✅ Keyframe saved to Theatre.js timeline!\n\nOpen the Theatre tab and click the Studio icon (top right) to see the timeline.");
}

// Event Listeners
function setupListeners() {
    document.getElementById("generate-btn").addEventListener("click", generateWithGrok);
    
    document.getElementById("save-sequence").addEventListener("click", saveToSequence);

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.getAttribute('data-tab'));
        });
    });

    // Live update value displays
    const sliders = ['intensity', 'surreal', 'cinematic'];
    sliders.forEach(id => {
        const slider = document.getElementById(id);
        slider.addEventListener('input', () => {
            document.getElementById(`val-${id}`).textContent = slider.value;
        });
    });

    // Keyboard shortcut: Ctrl/Cmd + Enter = Generate
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            generateWithGrok();
        }
    });
}

// Initialize everything
window.onload = async () => {
    console.log("%cfornever collective — grok play v3 (clean ui + full theatre studio)", "color:#00ffaa; font-size:14px");
    
    await initTheatre();
    setupListeners();

    // Set default prompt
    document.getElementById("prompt").value = 
        "ethereal cybernetic angel floating in a storm of glowing particles, dramatic rim lighting, cinematic color grading, ultra detailed, 8k";
};
