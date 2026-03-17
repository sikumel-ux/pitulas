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

// 1. Ambil Data Real-time (Sederhana agar tidak perlu Index manual di Firebase)
const q = query(collection(db, "cerita"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    allCerita = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Hilangkan loading spinner
    const loader = document.getElementById('loading');
    if(loader) loader.style.display = 'none';

    // Render data
    renderItems(allCerita);
}, (error) => {
    console.error("Firebase Error:", error);
});

// 2. Fungsi Render Tampilan
function renderItems(data) {
    const container = document.getElementById('content-list');
    if(!container) return;
    container.innerHTML = '';

    // Hanya tampilkan yang statusnya 'published' ATAU yang datanya belum punya field status (data lama)
    const filteredData = data.filter(item => item.status === 'published' || !item.status);

    if (filteredData.length === 0) {
        container.innerHTML = `<div class="text-center py-10 text-gray-400 font-bold">Belum ada cerita yang dipublish.</div>`;
        return;
    }

    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'story-card';

        if(item.kategori === 'Video') {
            card.innerHTML = `
                <div class="p-4">
                    <span class="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-[9px] font-black uppercase mb-3 inline-block">Medsos / Video</span>
                    <blockquote class="twitter-tweet" data-theme="light"><a href="${item.isi}"></a></blockquote>
                </div>`;
        } else {
            // STRUKTUR FULL TEXT & GAMBAR VERTIKAL
            card.innerHTML = `
                ${item.urlGambar ? `
                    <div class="img-container">
                        <span class="badge-float">${item.kategori}</span>
                        <img src="${item.urlGambar}" alt="${item.judul}">
                    </div>
                ` : `
                    <div class="p-6 pb-0">
                        <span class="bg-[#053a6f]/10 text-[#053a6f] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider mb-2 inline-block">${item.kategori}</span>
                    </div>
                `}
                
                <div class="card-body">
                    <h4 class="text-xl font-black text-[#053a6f] mb-4">${item.judul}</h4>
                    <div class="content-text-full">
                        ${item.isi.replace(/\n/g, '<br>')}
                    </div>
                    <div class="mt-8 pt-6 border-t border-dashed border-gray-100 flex justify-center opacity-20">
                        <i class="fa-solid fa-heart text-xs"></i>
                    </div>
                </div>
            `;
        }
        container.appendChild(card);
    });

    if(window.twttr) window.twttr.widgets.load();
}

// 3. Fungsi Filter Kategori (Ditempel ke window agar bisa dipanggil dari HTML)
window.filterCategory = (cat, el) => {
    // Reset status active di navigasi
    document.querySelectorAll('.cat-item, .nav-btn').forEach(i => i.classList.remove('active'));
    
    // Beri class active ke elemen yang diklik
    if(el) el.classList.add('active');

    // Filter dan Render
    const filtered = (cat === 'Semua') ? allCerita : allCerita.filter(d => d.kategori === cat);
    renderItems(filtered);

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
