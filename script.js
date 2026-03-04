// Nama file JSON kamu (pastikan satu folder dengan index.html)
const JSON_FILE = 'cerita.json'; 

let allStories = [];

// 1. Inisialisasi saat Web dibuka
window.onload = async () => {
    // Set Theme sesuai memory HP
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);

    // Ambil data dari file JSON
    await fetchStories();
};

// 2. Fungsi Mengambil Data JSON
async function fetchStories() {
    try {
        const response = await fetch(JSON_FILE);
        if (!response.ok) throw new Error('File JSON tidak ditemukan');
        
        allStories = await response.json();
        
        // Tampilkan pesan awal atau cerita terbaru
        console.log("Database cerita dimuat: ", allStories.length);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('content').innerHTML = "<p style='text-align:center; padding:50px; opacity:0.5;'>Gagal memuat file cerita.json. Pastikan file sudah di-upload ke server.</p>";
    }
}

// 3. Tampilkan Menu Kategori (Action Sheet)
function showCategoryMenu(category) {
    // Filter berdasarkan kategori di JSON
    const filtered = allStories.filter(s => 
        s.kategori && s.kategori.toLowerCase().trim() === category.toLowerCase().trim()
    );
    
    const listContainer = document.getElementById('story-list');
    document.getElementById('sheet-category-title').innerText = category;
    
    if (filtered.length > 0) {
        listContainer.innerHTML = filtered.map(s => `
            <button onclick="readStory('${s.judul.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-file-lines" style="margin-right:10px; opacity:0.3;"></i> ${s.judul}
            </button>
        `).join('');
    } else {
        listContainer.innerHTML = "<p style='text-align:center; padding:30px; opacity:0.4; font-size:0.9rem;'>Belum ada fantasi di kategori ini.</p>";
    }
    
    document.getElementById('action-sheet').classList.add('active');
}

// 4. Fungsi Membaca Cerita
function readStory(judul) {
    const story = allStories.find(s => s.judul === judul);
    if (!story) return;

    const contentArea = document.getElementById('content');
    
    // Update Judul di Atas & Isi Cerita
    document.getElementById('top-title').innerText = story.judul;
    
    // Pecah teks berdasarkan enter (\n) menjadi paragraf <p>
    const paragraphs = story.isi.split('\n');
    contentArea.innerHTML = paragraphs
        .filter(p => p.trim() !== "")
        .map(p => `<p>${p}</p>`)
        .join('');
    
    // Tutup Menu & Scroll ke Atas dengan smooth
    closeSheet();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 5. Fitur Ganti Tema (Dark/Light)
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

// 6. Fungsi Tutup Sheet
function closeSheet(e) {
    // Tutup jika klik background atau klik tombol judul
    if (!e || e.target.id === 'action-sheet' || e.target.tagName === 'BUTTON') {
        document.getElementById('action-sheet').classList.remove('active');
    }
}
    
