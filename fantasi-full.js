import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

// Listen Data Real-time (Hanya yang statusnya 'published')
const q = query(
    collection(db, "cerita"), 
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
    allCerita = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderItems(allCerita);
    
    // Hilangkan Loading Screen
    const loader = document.getElementById('loading-overlay');
    if(loader) loader.style.display = 'none';
});

function renderItems(data) {
    const container = document.getElementById('content-list');
    container.innerHTML = '';

    if(data.length === 0) {
        container.innerHTML = '<div class="text-center py-20 text-gray-400 font-bold italic">Belum ada cerita terbit...</div>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'story-card';

        if(item.kategori === 'Video') {
            card.innerHTML = `
                <div class="p-6">
                    <span class="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-[9px] font-black uppercase mb-4 inline-block">Twitter Video</span>
                    <blockquote class="twitter-tweet" data-theme="light"><a href="${item.isi}"></a></blockquote>
                </div>`;
        } else {
            card.innerHTML = `
                ${item.urlGambar ? `
                    <div class="img-container">
                        <span class="badge-float">${item.kategori}</span>
                        <img src="${item.urlGambar}" alt="${item.judul}">
                    </div>
                ` : ''}
                
                <div class="card-body">
                    ${!item.urlGambar ? `<span class="bg-[#053a6f]/10 text-[#053a6f] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider mb-4 inline-block">${item.kategori}</span>` : ''}
                    <h4>${item.judul}</h4>
                    <div class="content-text-full">
                        ${item.isi.replace(/\n/g, '<br>')}
                    </div>
                    <div class="mt-10 pt-6 border-t border-dashed border-gray-100 flex justify-center opacity-20">
                        <i class="fa-solid fa-heart text-xs text-[#053a6f]"></i>
                    </div>
                </div>
            `;
        }
        container.appendChild(card);
    });

    // Re-load Twitter Widget
    if(window.twttr) window.twttr.widgets.load();
}

// Fungsi Filter
window.filterCategory = (cat, el) => {
    // Update UI Active
    document.querySelectorAll('.cat-item, .nav-btn').forEach(i => i.classList.remove('active'));
    if(el) el.classList.add('active');

    // Filter Logic
    const filtered = cat === 'Semua' ? allCerita : allCerita.filter(d => d.kategori === cat);
    renderItems(filtered);
    
    // Scroll ke atas otomatis saat ganti kategori
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
