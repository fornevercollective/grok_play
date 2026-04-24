// app.js - Fornever Collective Grok Play (Non-module version)
let project, sheet, obj;
let currentImageUrl = "";

async function initTheatre() {
    if (typeof theatre === "undefined") {
        console.error("Theatre.js not loaded");
        document.getElementById("studio-status").innerHTML = "❌ Failed to load Theatre.js";
        return;
    }

    theatre.studio.initialize();
    project = theatre.getProject("GrokPlayProject");
    sheet = project.sheet("Image Sequence");

    obj = sheet.object("Visual Controls", {
        intensity: theatre.types.number(65, { range: [0, 100] }),
        surreal: theatre.types.number(45, { range: [0, 100] }),
        cinematic: theatre.types.number(82, { range: [0, 100] })
    });

    obj.onValuesChange((values) => {
        document.getElementById("intensity").value = Math.round(values.intensity);
        document.getElementById("surreal").value = Math.round(values.surreal);
        document.getElementById("cinematic").value = Math.round(values.cinematic);
        
        document.getElementById("val-intensity").textContent = Math.round(values.intensity);
        document.getElementById("val-surreal").textContent = Math.round(values.surreal);
        document.getElementById("val-cinematic").textContent = Math.round(values.cinematic);
    });

    document.getElementById("studio-status").innerHTML = 
        `✅ Theatre Studio Ready<br>
         <small>Click the <strong>Theatre.js</strong> icon in the top-right to open the timeline and keyframes.</small>`;
}

function switchTab(tab) {
    document.querySelectorAll('.main').forEach(el => el.classList.add('hidden'));
    document.getElementById(tab + '-tab').classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
}

function generateWithGrok() {
    const prompt = document.getElementById("prompt").value.trim() || "abstract digital art";
    const output = document.getElementById("output-image");
    const placeholder = document.querySelector(".placeholder");

    placeholder.style.display = "none";
    output.style.display = "block";
    output.src = `https://picsum.photos/id/${Math.floor(Math.random()*900)+100}/1200/800?t=${Date.now()}`;

    currentImageUrl = output.src;

    const note = document.getElementById("note-text");
    if (!note.value.trim()) {
        note.value = `Generated: ${new Date().toLocaleString()}\n\nPrompt:\n${prompt}`;
    }

    console.log("%c[Grok Play] Image generated", "color:#00ffaa");
}

function saveToSequence() {
    if (!obj) {
        alert("Theatre.js not ready yet");
        return;
    }
    
    const intensity = parseFloat(document.getElementById("intensity").value);
    const surreal = parseFloat(document.getElementById("surreal").value);
    const cinematic = parseFloat(document.getElementById("cinematic").value);

    obj.set({ intensity, surreal, cinematic });
    theatre.studio.setSelection([obj]);
    
    alert("✅ Keyframe saved!\n\nGo to the Theatre Timeline tab and click the Theatre.js logo (top right) to open the timeline.");
}

function setupListeners() {
    document.getElementById("generate-btn").addEventListener("click", generateWithGrok);
    document.getElementById("save-sequence").addEventListener("click", saveToSequence);

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.getAttribute('data-tab'));
        });
    });

    const sliders = ['intensity', 'surreal', 'cinematic'];
    sliders.forEach(id => {
        const slider = document.getElementById(id);
        slider.addEventListener('input', () => {
            document.getElementById(`val-${id}`).textContent = slider.value;
        });
    });

    document.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generateWithGrok();
    });
}

// Initialize
window.onload = () => {
    console.log("%cfornever collective — grok play v3 (clean + theatre studio)", "color:#00ffaa");
    initTheatre();
    setupListeners();
};
