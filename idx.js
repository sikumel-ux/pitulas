import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyApuZ1gyMPnKSPnMLmqR-Nh1NPJ-blZ1Zs",
    authDomain: "pitulascom.firebaseapp.com",
    projectId: "pitulascom",
    storageBucket: "pitulascom.firebasestorage.app",
    messagingSenderId: "57896978619",
    appId: "1:57896978619:web:81503dfde8d568e35d819e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let allCerita = [];

// Listen Data Real-time
const q = query(collection(db, "cerita"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    allCerita = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderItems(allCerita);
    const loader = document.getElementById('loading');
    if(loader) loader.remove();
});

function renderItems(data) {
    const container = document.getElementById('content-list');
    container.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'story-card';
        // Klik untuk Expand/Collapse
        card.onclick = () => card.classList.toggle('expanded');

        if(item.kategori === 'Video') {
            card.innerHTML = `<blockquote class="twitter-tweet" data-theme="light"><a href="${item.isi}"></a></blockquote>`;
        } else {
            // Bagian tanggal sudah dihapus dari sini
            card.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <span class="bg-[#053a6f]/10 text-[#053a6f] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">${item.kategori}</span>
                </div>
                <h4>${item.judul}</h4>
                <p class="content-text">${item.isi.replace(/\n/g, '<br>')}</p>
                <div class="mt-4 pt-4 border-t border-dashed border-gray-100 flex justify-center">
                    <i class="fa-solid fa-chevron-down text-gray-300 text-xs"></i>
                </div>
            `;
        }
        container.appendChild(card);
    });
    if(window.twttr) window.twttr.widgets.load();
}

window.filterCategory = (cat, el) => {
    document.querySelectorAll('.cat-item, .nav-btn').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    renderItems(cat === 'Semua' ? allCerita : allCerita.filter(d => d.kategori === cat));
};

// Update jam sudah dihandle di index.html, tapi ini tetap dibiarkan sebagai backup 
setInterval(() => {
    const clockEl = document.getElementById('clock');
    if(clockEl) {
        const d = new Date();
        clockEl.innerText = d.getHours().toString().padStart(2,'0') + ":" + d.getMinutes().toString().padStart(2,'0');
    }
}, 1000);
  
