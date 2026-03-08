import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyApuZ1gyMPnKSPnMLmqR-Nh1NPJ-blZ1Zs",
    authDomain: "pitulascom.firebaseapp.com",
    projectId: "pitulascom",
    storageBucket: "pitulascom.firebasestorage.app",
    messagingSenderId: "57896978619",
    appId: "1:57896978619:web:81503dfde8d568e35d819e"
};

initializeApp(firebaseConfig);

const API_URL = "https://script.google.com/macros/s/AKfycbx9JsUb0saYvFnH8vpCn2JZu_AzdrXXXmQIcGfMW0dsTvPndFQC_CtKyLhMx_6Kjd_IEg/exec";
let allData = [];

async function loadContent() {
    try {
        const res = await fetch(API_URL);
        allData = await res.json();
        renderItems(allData);
        document.getElementById('loading').classList.add('hidden');
    } catch (e) {
        console.error("Error:", e);
    }
}

function renderItems(data) {
    const container = document.getElementById('content-list');
    container.innerHTML = '';

    data.forEach(item => {
        let contentHTML = '';
        
        if(item.kategori === 'Video') {
            // Render Twitter Embed
            contentHTML = `
                <div class="story-card">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">Twitter Clip</span>
                    </div>
                    <blockquote class="twitter-tweet" data-theme="light">
                        <a href="${item.isi}"></a>
                    </blockquote
                </div>`;
        } else {
            // Render Cerita Teks
            contentHTML = `
                <div class="story-card">
                    <div class="flex justify-between items-center mb-4">
                        <span class="bg-[#053a6f]/10 text-[#053a6f] px-3 py-1 rounded-full text-[9px] font-black uppercase">${item.kategori}</span>
                        <span class="text-[9px] text-gray-400 font-bold tracking-tighter">${item.tanggal}</span>
                    </div>
                    <h3 class="font-bold text-gray-800 leading-snug text-lg mb-2">${item.judul}</h3>
                    <p class="text-gray-500 text-xs line-clamp-3 mb-4">${item.isi}</p>
                    <button class="text-[#053a6f] text-[10px] font-black tracking-widest border-t border-gray-50 pt-4 w-full text-left">BACA SELENGKAPNYA <i class="fa-solid fa-chevron-right ml-1"></i></button>
                </div>`;
        }
        container.innerHTML += contentHTML;
    });
    
    // Refresh Twitter Widgets
    if(window.twttr) window.twttr.widgets.load();
}

// Global Filter Function
window.filterCategory = (cat, el) => {
    document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    
    if(cat === 'Semua') {
        renderItems(allData);
    } else {
        const filtered = allData.filter(i => i.kategori === cat);
        renderItems(filtered);
    }
};

// Clock
setInterval(() => {
    const d = new Date();
    document.getElementById('clock').innerText = d.getHours().toString().padStart(2,'0') + ":" + d.getMinutes().toString().padStart(2,'0');
}, 1000);

loadContent();
