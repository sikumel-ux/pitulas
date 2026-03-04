// Ganti dengan URL API Google Apps Script kamu
const API_URL = 'https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec';

let allStories = [];

// 1. Inisialisasi Aplikasi
window.onload = async () => {
    // Cek Theme Terakhir
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);

    // Ambil Data
    await fetchStories();
};

// 2. Ambil Data dari Google Sheets
async function fetchStories() {
    try {
        const response = await fetch(API_URL);
        allStories = await response.json();
    } catch (error) {
        console.error("Gagal ambil data:", error);
        document.getElementById('content').innerHTML = "<p>Gagal memuat perpustakaan.</p>";
    }
}

// 3. Tampilkan Menu Kategori (Action Sheet)
function showCategoryMenu(category) {
    // Filter cerita berdasarkan kategori (case insensitive)
    const filtered = allStories.filter(s => 
        s.kategori && s.kategori.toLowerCase().trim() === category.toLowerCase().trim()
    );
    
    const listContainer = document.getElementById('story-list');
    document.getElementById('sheet-category-title').innerText = category;
    
    if (filtered.length > 0) {
        listContainer.innerHTML = filtered.map(s => `
            <button onclick="readStory('${s.judul.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-file-lines" style="margin-right:10px; opacity:0.5;"></i> ${s.judul}
            </button>
        `).join('');
    } else {
        listContainer.innerHTML = "<p style='text-align:center; padding:20px; opacity:0.5;'>Belum ada cerita di kategori ini.</p>";
    }
    
    document.getElementById('action-sheet').classList.add('active');
}

// 4. Baca Cerita yang Dipilih
function readStory(judul) {
    const story = allStories.find(s => s.judul === judul);
    if (!story) return;

    const contentArea = document.getElementById('content');
    
    // Update Judul & Isi
    document.getElementById('top-title').innerText = story.judul;
    
    const paragraphs = story.isi.split('\n');
    contentArea.innerHTML = paragraphs
        .filter(p => p.trim() !== "")
        .map(p => `<p>${p}</p>`)
        .join('');
    
    // Tutup Menu & Scroll ke Atas
    closeSheet();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 5. Fitur Toggle Theme (Light/Dark)
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('theme', 'dark-mode');
        updateThemeIcon('dark-mode');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('theme', 'light-mode');
        updateThemeIcon('light-mode');
    }
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (theme === 'dark-mode') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

// 6. Tutup Action Sheet
function closeSheet(e) {
    if (!e || e.target.id === 'action-sheet' || e.target.tagName === 'BUTTON') {
        document.getElementById('action-sheet').classList.remove('active');
    }
    }
