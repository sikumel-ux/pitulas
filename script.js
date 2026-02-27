// Ganti dengan URL Web App dari Google Apps Script kamu
const API_URL = 'https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec';

async function loadStory() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Update Judul
        document.getElementById('title').innerText = data.judul;
        
        // Update Konten Cerita
        // Kita pecah teks berdasarkan baris baru (enter) agar jadi paragraf HTML
        const paragraphs = data.isi.split('\n');
        const htmlContent = paragraphs
            .filter(p => p.trim() !== "") // Buang baris kosong
            .map(p => `<p>${p}</p>`)
            .join('');

        document.getElementById('content').innerHTML = htmlContent;
        
        // Opsional: Update Meta Info (Genre)
        if(data.genre) {
            document.getElementById('meta-info').innerText = `${data.genre} • Private Collection`;
        }

    } catch (error) {
        console.error('Gagal memuat cerita:', error);
        document.getElementById('content').innerHTML = "<p style='text-align:center;'>Maaf, suasana sedang terganggu. Coba segarkan halaman.</p>";
    }
}

// Jalankan fungsi saat halaman dibuka
window.onload = loadStory;
