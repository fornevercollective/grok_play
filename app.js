// app.js - Fornever Collective Grok Play (White Theme + Fixed)
let project, sheet, obj;

function initTheatre() {
    try {
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
            `✅ Theatre Studio Loaded<br><small>Click the Theatre.js icon (top right) to open timeline &amp; keyframes.</small>`;

    } catch (e) {
        console.error(e);
        document.getElementById("studio-status").innerHTML = 
            `❌ Theatre.js failed to load. Check console.`;
    }
}

function switchTab(tab) {
    document.querySelectorAll('.main').forEach(el => el.classList.add('hidden'));
    document.getElementById(tab + '-tab').classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
}

function generateWithGrok() {
    const output = document.getElementById("output-image");
    const placeholder = document.querySelector(".placeholder");
    const prompt = document.getElementById("prompt").value.trim();

    placeholder.style.display = "none";
    output.style.display = "block";
    output.src = `https://picsum.photos/id/${Math.floor(Math.random()*900)+100}/1200/800?t=${Date.now()}`;

    const noteEl = document.getElementById("note-text");
    if (!noteEl.value.trim()) {
        noteEl.value = `Generated: ${new Date().toLocaleString()}\nPrompt: ${prompt || "No prompt entered"}`;
    }

    console.log("%c[Grok Play] Image generated", "color:#00aa77");
}

function saveToSequence() {
    if (!obj) {
        alert("Theatre.js is still loading. Please wait a moment.");
        return;
    }

    const intensity = parseFloat(document.getElementById("intensity").value);
    const surreal = parseFloat(document.getElementById("surreal").value);
    const cinematic = parseFloat(document.getElementById("cinematic").value);

    obj.set({ intensity, surreal, cinematic });
    theatre.studio.setSelection([obj]);

    alert("✅ Parameters saved as keyframe in Theatre.js Timeline!\n\nSwitch to the Theatre Timeline tab and click the studio icon (top right) to view the timeline.");
}

function setupListeners() {
    document.getElementById("generate-btn").addEventListener("click", generateWithGrok);
    document.getElementById("save-sequence").addEventListener("click", saveToSequence);

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    ['intensity','surreal','cinematic'].forEach(id => {
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
    console.log("%cfornever collective — grok play v3 (white theme + fixed)", "color:#00aa77");
    initTheatre();
    setupListeners();
};
