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

// Real-time listener Firestore
const q = query(collection(db, "cerita"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    allCerita = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderItems(allCerita);
    document.getElementById('loading').classList.add('hidden');
});

function renderItems(data) {
    const container = document.getElementById('content-list');
    container.innerHTML = '';
    data.forEach(item => {
        let card = `<div class="story-card">
            <div class="flex justify-between items-center mb-3">
                <span class="bg-[#053a6f]/5 text-[#053a6f] px-3 py-1 rounded-full text-[8px] font-black uppercase">${item.kategori}</span>
                <span class="text-[8px] text-gray-300 font-bold">${item.tanggal}</span>
            </div>
            <h4 class="text-base font-bold text-gray-800 mb-2">${item.judul}</h4>
            <p class="text-gray-400 text-[10px] line-clamp-2">${item.isi}</p>
        </div>`;
        if(item.kategori === 'Video') {
            card = `<div class="story-card"><blockquote class="twitter-tweet" data-theme="light"><a href="${item.isi}"></a></blockquote></div>`;
        }
        container.innerHTML += card;
    });
    if(window.twttr) window.twttr.widgets.load();
}

window.filterCategory = (cat, el) => {
    document.querySelectorAll('.cat-item, .nav-btn').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    renderItems(cat === 'Semua' ? allCerita : allCerita.filter(d => d.kategori === cat));
};

setInterval(() => {
    const d = new Date();
    document.getElementById('clock').innerText = d.getHours().toString().padStart(2,'0') + ":" + d.getMinutes().toString().padStart(2,'0');
}, 1000);
      
