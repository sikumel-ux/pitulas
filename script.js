let allStories = [];
let currentCategory = '';

async function fetchStories() {
    const res = await fetch('YOUR_GOOGLE_SHEET_API_URL');
    allStories = await res.json();
}

function showCategoryMenu(category) {
    currentCategory = category;
    const filtered = allStories.filter(s => s.kategori.toLowerCase() === category.toLowerCase());
    
    const listContainer = document.getElementById('story-list');
    document.getElementById('sheet-category-title').innerText = category;
    
    listContainer.innerHTML = filtered.map((s, index) => `
        <button onclick="readStory('${s.judul}')">${s.judul}</button>
    `).join('');
    
    document.getElementById('action-sheet').classList.add('active');
}

function readStory(judul) {
    const story = allStories.find(s => s.judul === judul);
    const contentArea = document.getElementById('content');
    
    document.getElementById('top-title').innerText = story.judul;
    contentArea.innerHTML = story.isi.split('\n').map(p => `<p>${p}</p>`).join('');
    
    closeSheet();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

function closeSheet(e) {
    if (!e || e.target.id === 'action-sheet' || e.target.tagName === 'BUTTON') {
        document.getElementById('action-sheet').classList.remove('active');
    }
}

window.onload = fetchStories;
