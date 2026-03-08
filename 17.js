import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

// Konfigurasi Firebase lo
const firebaseConfig = {
    apiKey: "AIzaSyApuZ1gyMPnKSPnMLmqR-Nh1NPJ-blZ1Zs",
    authDomain: "pitulascom.firebaseapp.com",
    projectId: "pitulascom",
    storageBucket: "pitulascom.firebasestorage.app",
    messagingSenderId: "57896978619",
    appId: "1:57896978619:web:81503dfde8d568e35d819e"
};

// Start Firebase
const app = initializeApp(firebaseConfig);

// URL API Google Apps Script lo
const API_URL = "https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec";

// Fungsi Tarik Data Cerita
async function fetchStories() {
    const listContainer = document.getElementById('story-list');
    const loading = document.getElementById('loading');

    try {
        const response = await fetch(API_URL);
        const stories = await response.json();
        
        loading.classList.add('hidden');
        listContainer.innerHTML = '';

        stories.forEach(story => {
            const card = `
                <div class="story-card animate-fade-in">
                    <div class="flex justify-between items-start mb-4">
                        <span class="bg-[#053a6f]/10 text-[#053a6f] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                            ${story.kategori}
                        </span>
                        <span class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            ${story.tanggal} </span>
                    </div>
                    <h4 class="text-lg font-bold text-gray-800 leading-snug mb-3">${story.judul}</h4>
                    <p class="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                        ${story.isi}
                    </p>
                    <div class="flex justify-between items-center border-t border-gray-50 pt-4">
                        <button class="text-[#053a6f] text-xs font-extrabold flex items-center">
                            BACA SEKARANG <i class="fa-solid fa-arrow-right ml-2 text-[10px]"></i>
                        </button>
                        <div class="flex space-x-4 text-gray-300 text-sm">
                            <i class="fa-regular fa-heart"></i>
                            <i class="fa-solid fa-share-nodes"></i>
                        </div>
                    </div>
                </div>
            `;
            listContainer.innerHTML += card;
        });
    } catch (error) {
        console.error("Gagal narik cerita:", error);
        loading.innerHTML = "<p class='text-red-500 font-bold'>Gagal memuat cerita, Bro!</p>";
    }
}

// Jam Real-time
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}, 1000);

// Jalankan Fungsi
fetchStories();
