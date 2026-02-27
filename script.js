/**
 * MIDNIGHT AFFAIRS - CORE ENGINE
 * Berfungsi untuk menghubungkan Google Sheets API ke UI Modern iOS Navy
 */

// 1. KONFIGURASI API
const API_URL = 'https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec';

// 2. STATE MANAGEMENT
let allStories = [];         // Menyimpan seluruh database cerita
let displayedStories = [];    // Menyimpan cerita yang sedang difilter
let currentIndex = 0;         // Index cerita yang sedang dibaca

/**
 * MENGAMBIL DATA DARI GOOGLE SHEETS
 */
async function fetchAllStories() {
    const contentArea = document.getElementById('content');
    contentArea.innerHTML = '<div class="loading-state">Menghubungkan ke server...</div>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // Memastikan data adalah array (karena kita akan memproses banyak cerita)
        allStories = Array.isArray(data) ? data : [data];
        
        // Default: Tampilkan semua cerita, mulai dari yang terbaru (paling bawah di Sheets)
        displayedStories = [...allStories];
        currentIndex = displayedStories.length - 1; 

        updateDisplay();
    } catch (error) {
        console.error('Fetch Error:', error);
        contentArea.innerHTML = `
            <div class="loading-state" style="color: #ff4d4d;">
                Gagal memuat perpustakaan. <br> 
                <small>Pastikan API Google Sheets sudah di-deploy sebagai 'Public'.</small>
            </div>`;
    }
}

/**
 * MENGUPDATE TAMPILAN UI (IOS STYLE)
 */
function updateDisplay() {
    if (displayedStories.length === 0) {
        document.getElementById('content').innerHTML = '<div class="loading-state">Tidak ada cerita di kategori ini.</div>';
        return;
    }

    const story = displayedStories[currentIndex];
    const contentArea = document.getElementById('content');
    const titleElement = document.getElementById('title');
    const metaElement = document.getElementById('meta-info');

    // 1. Update Judul di Top Bar (Limit karakter agar tidak berantakan di HP)
    const rawTitle = story.judul || "Untitled Story";
    titleElement.innerText = rawTitle.length > 20 ? rawTitle.substring(0, 17) + '...' : rawTitle;

    // 2. Update Meta Info (Kategori)
    metaElement.innerText = `${story.kategori || 'Private'} Collection`;

    // 3. Memproses Isi Cerita (Split Enter menjadi Paragraf)
    const paragraphs = story.isi.split('\n');
    const htmlContent = paragraphs
        .filter(p => p.trim() !== "") // Buang baris kosong agar justify tetap rapi
        .map(p => `<p>${p}</p>`)
        .join('');

    contentArea.innerHTML = htmlContent;

    // 4. Update Navigasi Bawah (Page Info & Button State)
    document.getElementById('page-info').innerText = `${currentIndex + 1} / ${displayedStories.length}`;
    document.getElementById('prev-btn').disabled = (currentIndex === 0);
    document.getElementById('next-btn').disabled = (currentIndex === displayedStories.length - 1);

    // 5. Scroll Smooth ke Atas (Penting saat ganti cerita)
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 6. Trigger Animasi Fade-In Modern
    contentArea.style.opacity = 0;
    setTimeout(() => {
        contentArea.style.transition = 'opacity 0.8s ease';
        contentArea.style.opacity = 1;
    }, 50);
}

/**
 * SISTEM FILTER KATEGORI (Suami, Teman Suami, 3s, Mertua)
 */
function filterCategory(cat) {
    // Filter berdasarkan kolom kategori di Sheets
    displayedStories = allStories.filter(s => 
        s.kategori && s.kategori.toLowerCase().trim() === cat.toLowerCase().trim()
    );

    if (displayedStories.length > 0) {
        currentIndex = 0; // Mulai dari cerita pertama di kategori tersebut
        updateDisplay();
        toggleMenu(); // Tutup Action Sheet setelah pilih
    } else {
        alert(`Kategori "${cat}" belum ada isinya di Google Sheets kamu, Bro.`);
    }
}

/**
 * NAVIGASI BERIKUTNYA / SEBELUMNYA
 */
function nextStory() {
    if (currentIndex < displayedStories.length - 1) {
        currentIndex++;
        updateDisplay();
    }
}

function prevStory() {
    if (currentIndex > 0) {
        currentIndex--;
        updateDisplay();
    }
}

/**
 * SISTEM MENU (IOS ACTION SHEET)
 */
function toggleMenu() {
    const overlay = document.getElementById("nav-overlay");
    overlay.classList.toggle("open");
}

// Menutup menu jika user klik di luar area "Sheet" (area abu-abu transparan)
function closeMenu(event) {
    if (event.target.id === "nav-overlay") {
        toggleMenu();
    }
}

/**
 * INITIALIZE APP
 */
window.onload = fetchAllStories;

// Mencegah zoom saat double tap di iPhone (biar kerasa kayak App asli)
document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });
