// app.js - Fixed for GitHub Pages + White Theme
let project, sheet, obj;
let theatreCore, theatreStudio;

async function initTheatre() {
    const statusEl = document.getElementById("studio-status");

    try {
        // Wait for scripts to load
        await new Promise(r => setTimeout(r, 800));

        if (typeof window.theatre === "undefined") {
            throw new Error("Theatre not found on window");
        }

        theatreStudio = window.theatre.studio || window.studio;
        theatreCore = window.theatre.core || window.core || window.theatre;

        if (!theatreStudio || !theatreCore) {
            throw new Error("Could not access Theatre modules");
        }

        theatreStudio.initialize();

        project = theatreCore.getProject("GrokPlayProject");
        sheet = project.sheet("Image Sequence");

        obj = sheet.object("Visual Controls", {
            intensity: theatreCore.types.number(65, { range: [0, 100] }),
            surreal: theatreCore.types.number(45, { range: [0, 100] }),
            cinematic: theatreCore.types.number(82, { range: [0, 100] })
        });

        obj.onValuesChange((values) => {
            document.getElementById("intensity").value = Math.round(values.intensity);
            document.getElementById("surreal").value = Math.round(values.surreal);
            document.getElementById("cinematic").value = Math.round(values.cinematic);
            
            document.getElementById("val-intensity").textContent = Math.round(values.intensity);
            document.getElementById("val-surreal").textContent = Math.round(values.surreal);
            document.getElementById("val-cinematic").textContent = Math.round(values.cinematic);
        });

        statusEl.style.color = "#00aa77";
        statusEl.innerHTML = `✅ Theatre Studio Loaded<br>
            <small style="color:#555">Click the Theatre.js icon in the top-right corner to open the timeline and create keyframes.</small>`;

        console.log("%cTheatre.js Studio initialized successfully", "color:#00aa77");

    } catch (err) {
        console.error("Theatre.js Error:", err);
        statusEl.innerHTML = `❌ Failed to load Theatre.js<br>
            <small style="color:#d32f2f">Error: ${err.message}</small>`;
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
        noteEl.value = `Generated: ${new Date().toLocaleString()}\nPrompt: ${prompt || "No prompt"}`;
    }
}

function saveToSequence() {
    if (!obj) {
        alert("Theatre.js is still loading or failed to initialize.");
        return;
    }

    const intensity = parseFloat(document.getElementById("intensity").value);
    const surreal = parseFloat(document.getElementById("surreal").value);
    const cinematic = parseFloat(document.getElementById("cinematic").value);

    obj.set({ intensity, surreal, cinematic });
    theatreStudio.setSelection([obj]);

    alert("✅ Saved to Theatre Timeline!\n\nSwitch to the Theatre tab and click the studio icon (top right) to see the timeline.");
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

// Start the app
window.onload = () => {
    console.log("%cfornever collective — grok play v3 (white theme)", "color:#00aa77");
    initTheatre();
    setupListeners();
};
