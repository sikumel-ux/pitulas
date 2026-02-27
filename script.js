const API_URL = 'https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec';

let allStories = [];
let displayedStories = [];
let currentIndex = 0;

async function fetchAllStories() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        allStories = Array.isArray(data) ? data : [data];
        displayedStories = [...allStories]; // Default: tampilkan semua
        currentIndex = displayedStories.length - 1; // Mulai dari cerita terbaru
        updateDisplay();
    } catch (error) {
        document.getElementById('content').innerHTML = "<p>Gagal memuat fantasi...</p>";
    }
}

function updateDisplay() {
    if (displayedStories.length === 0) return;
    
    const story = displayedStories[currentIndex];
    document.getElementById('title').innerText = story.judul;
    document.getElementById('meta-info').innerText = `${story.kategori || 'Private'} • Collection`;
    
    const paragraphs = story.isi.split('\n');
    document.getElementById('content').innerHTML = paragraphs
        .filter(p => p.trim() !== "")
        .map(p => `<p>${p}</p>`)
        .join('');

    document.getElementById('page-info').innerText = `${currentIndex + 1} / ${displayedStories.length}`;
    document.getElementById('prev-btn').disabled = (currentIndex === 0);
    document.getElementById('next-btn').disabled = (currentIndex === displayedStories.length - 1);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterCategory(cat) {
    displayedStories = allStories.filter(s => 
        s.kategori && s.kategori.toLowerCase().includes(cat.toLowerCase())
    );
    
    if (displayedStories.length > 0) {
        currentIndex = 0;
        updateDisplay();
        toggleMenu();
    } else {
        alert("Kategori ini belum ada isinya, Bro.");
    }
}

function nextStory() { if (currentIndex < displayedStories.length - 1) { currentIndex++; updateDisplay(); } }
function prevStory() { if (currentIndex > 0) { currentIndex--; updateDisplay(); } }

function toggleMenu() {
    const nav = document.getElementById("nav-overlay");
    nav.style.width = (nav.style.width === "100%") ? "0%" : "100%";
}

window.onload = fetchAllStories;
    
