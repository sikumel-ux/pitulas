import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyApuZ1gyMPnKSPnMLmqR-Nh1NPJ-blZ1Zs",
    authDomain: "pitulascom.firebaseapp.com",
    projectId: "pitulascom",
    storageBucket: "pitulascom.firebasestorage.app",
    messagingSenderId: "57896978619",
    appId: "1:57896978619:web:81503dfde8d568e35d819e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// AUTH HANDLER
document.getElementById('btnLogin').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    signInWithEmailAndPassword(auth, email, pass).catch(() => alert("Akses Gagal!"));
});
document.getElementById('btnLogout').onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    document.getElementById('mainBody').className = user ? 'auth-active' : 'unauth';
    if(user) loadData();
});

// DATA HANDLER
async function loadData(targetId = null) {
    const area = document.getElementById('contentArea');
    const archive = document.getElementById('archiveSection');
    
    try {
        const q = query(collection(db, "cerita"), orderBy("tanggal", "desc"), limit(15));
        const snap = await getDocs(q);
        const stories = [];
        snap.forEach(d => stories.push({ id: d.id, ...d.data() }));

        if (stories.length === 0) return;
        archive.classList.remove('hidden');

        if (targetId) {
            renderFull(stories.find(s => s.id === targetId));
            renderList(stories.filter(s => s.id !== targetId));
        } else {
            renderPreviews(stories.slice(0, 5));
            renderList(stories.slice(5, 15));
        }
    } catch (e) { console.error(e); }
}

function renderPreviews(data) {
    document.getElementById('contentArea').innerHTML = data.map(item => `
        <div class="story-card-preview" onclick="loadData('${item.id}')">
            <div class="flex justify-between items-center mb-6">
                <span class="bg-slate-100 text-slate-500 text-[9px] font-black px-4 py-1.5 rounded-full uppercase">${item.kategori || '3S'}</span>
                <span class="text-slate-300 text-[9px] font-bold">08 - 03 - 2026</span>
            </div>
            <h4>${item.judul}</h4>
            <div class="preview-text">${item.isi}</div>
            <div class="w-full h-px bg-slate-50 mt-8 mb-4"></div>
            <div class="flex justify-center text-slate-200"><i class="fa-solid fa-chevron-down"></i></div>
        </div>
    `).join('');
}

function renderFull(f) {
    document.getElementById('contentArea').innerHTML = `
        <div class="bg-white rounded-[40px] p-8 shadow-xl border-b-8 border-[#facc15]">
            <button onclick="loadData()" class="mb-8 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <i class="fa-solid fa-chevron-left mr-2"></i> Kembali
            </button>
            <h4 class="text-2xl font-black text-[#053a6f] leading-tight mb-8">${f.judul}</h4>
            <div class="content-text">${f.isi.replace(/\n/g, '<br>')}</div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderList(l) {
    const container = document.getElementById('listLainnya');
    container.innerHTML = "";
    l.forEach(item => {
        const d = document.createElement('div');
        d.className = "list-item active:scale-95 transition-all";
        d.innerHTML = `<span>${item.judul}</span><i class="fa-solid fa-chevron-right text-[10px] opacity-10"></i>`;
        d.onclick = () => { window.scrollTo(0,0); loadData(item.id); };
        container.appendChild(d);
    });
}

window.loadData = loadData;
