import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, collection, query, orderBy, limit, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

// --- AUTH LOGIC ---
document.getElementById('btnLogin').onclick = () => {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    signInWithEmailAndPassword(auth, email, pass).catch(() => alert("Akses Ditolak!"));
};

document.getElementById('btnLogout').onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('bodyWrapper').className = 'auth-active';
        loadStories();
    } else {
        document.getElementById('bodyWrapper').className = 'unauth';
    }
});

// --- CORE DATA LOGIC ---
async function loadStories(targetId = null) {
    // Ambil 6 data (1 Fokus, 5 List)
    const q = query(collection(db, "cerita"), orderBy("tanggal", "desc"), limit(6));
    const snapshot = await getDocs(q);
    const dataList = [];
    snapshot.forEach(d => dataList.push({ id: d.id, ...d.data() }));

    if (dataList.length === 0) return;

    // Tentukan mana yang jadi fokus
    let currentFocus = dataList[0];
    if (targetId) {
        const found = dataList.find(s => s.id === targetId);
        if (found) currentFocus = found;
    }

    renderUI(currentFocus, dataList.filter(s => s.id !== currentFocus.id).slice(0, 5));
}

function renderUI(fokus, lainnya) {
    // Render Cerita Utama
    const focusArea = document.getElementById('focusArea');
    focusArea.innerHTML = `
        <div class="story-card">
            <span class="bg-yellow-50 text-[#053a6f] text-[8px] font-black px-3 py-1 rounded-full uppercase mb-4 inline-block border border-yellow-200">
                ${fokus.kategori || 'PRIVATE'}
            </span>
            <h4>${fokus.judul}</h4>
            <div class="content-text">${fokus.isi.replace(/\n/g, '<br>')}</div>
        </div>
    `;

    // Render 5 Judul di Bawah
    const listLainnya = document.getElementById('listLainnya');
    listLainnya.innerHTML = lainnya.map(item => `
        <div class="story-link" id="link-${item.id}">
            <span class="truncate pr-4 uppercase tracking-tighter">${item.judul}</span>
            <i class="fa-solid fa-arrow-right-long opacity-30"></i>
        </div>
    `).join('');

    // Tambah Event Click ke List
    lainnya.forEach(item => {
        document.getElementById(`link-${item.id}`).onclick = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            loadStories(item.id);
        };
    });
  }
  
