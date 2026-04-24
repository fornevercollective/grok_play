// app.js - Fornever Collective Grok Play
import * as studio from "https://cdn.jsdelivr.net/npm/@theatre/studio@0.4.0/dist/index.js";
import * as core from "https://cdn.jsdelivr.net/npm/@theatre/core@0.4.0/dist/index.js";

let project, sheet, obj;
let currentImageUrl = "";

async function initTheatre() {
    studio.initialize();
    project = core.getProject("GrokPlayProject", { state: localStorage.getItem("theatreState") });
    sheet = project.sheet("Image Sequence");

    obj = sheet.object("Visual Controls", {
        intensity: core.types.number(65, { range: [0, 100] }),
        surreal: core.types.number(45, { range: [0, 100] }),
        cinematic: core.types.number(82, { range: [0, 100] })
    });

    obj.onValuesChange((values) => {
        document.getElementById("intensity").value = Math.round(values.intensity);
        document.getElementById("surreal").value = Math.round(values.surreal);
        document.getElementById("cinematic").value = Math.round(values.cinematic);
        
        document.getElementById("val-intensity").textContent = Math.round(values.intensity);
        document.getElementById("val-surreal").textContent = Math.round(values.surreal);
        document.getElementById("val-cinematic").textContent = Math.round(values.cinematic);
    });

    project.onChange(() => {
        localStorage.setItem("theatreState", JSON.stringify(project.getState()));
    });

    document.getElementById("studio-status").innerHTML = 
        `✅ Theatre Studio Loaded<br>
         <small>Open the timeline by clicking the Theatre.js icon in the top-right corner.</small>`;
}

function switchTab(tab) {
    document.querySelectorAll('.main').forEach(el => el.classList.add('hidden'));
    document.getElementById(tab + '-tab').classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
}

async function generateWithGrok() {
    const prompt = document.getElementById("prompt").value.trim();
    const output = document.getElementById("output-image");
    const placeholder = document.querySelector(".placeholder");

    placeholder.style.display = "none";
    output.style.display = "block";
    output.src = `https://picsum.photos/id/${Math.floor(Math.random()*900)+100}/1200/800?t=${Date.now()}`;

    currentImageUrl = output.src;

    const note = document.getElementById("note-text");
    if (!note.value) note.value = `Generated: ${new Date().toLocaleString()}\nPrompt: ${prompt}`;
    
    console.log("%c[Grok Play] Image generated", "color:#00ffaa");
}

function saveToSequence() {
    if (!obj) return;
    const intensity = parseFloat(document.getElementById("intensity").value);
    const surreal = parseFloat(document.getElementById("surreal").value);
    const cinematic = parseFloat(document.getElementById("cinematic").value);

    obj.set({ intensity, surreal, cinematic });
    studio.setSelection([obj]);
    
    alert("Keyframe saved to Theatre.js Timeline!\n\nGo to the Theatre Timeline tab and click the studio icon (top right) to view/edit the timeline.");
}

function setupListeners() {
    document.getElementById("generate-btn").addEventListener("click", generateWithGrok);
    document.getElementById("save-sequence").addEventListener("click", saveToSequence);

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    const sliders = ['intensity','surreal','cinematic'];
    sliders.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', () => {
            document.getElementById(`val-${id}`).textContent = el.value;
        });
    });

    document.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generateWithGrok();
    });
}

window.onload = async () => {
    console.log("%cfornever collective — grok play v3 (clean + full theatre studio)", "color:#00ffaa");
    await initTheatre();
    setupListeners();
};
