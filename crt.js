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

// --- LOGIN HANDLER ---
const btnLogin = document.getElementById('btnLogin');
if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPass').value;
        signInWithEmailAndPassword(auth, email, pass).catch(() => alert("Kunci Brankas Salah!"));
    });
}

document.getElementById('btnLogout').onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    document.getElementById('mainBody').className = user ? 'auth-active' : 'unauth';
    if(user) loadData();
});

// --- DATA ENGINE ---
async function loadData(targetId = null) {
    const contentArea = document.getElementById('contentArea');
    const archiveSection = document.getElementById('archiveSection');
    
    try {
        const q = query(collection(db, "cerita"), orderBy("tanggal", "desc"), limit(15));
        const snapshot = await getDocs(q);
        const stories = [];
        snapshot.forEach(doc => stories.push({ id: doc.id, ...doc.data() }));

        if (stories.length === 0) {
            contentArea.innerHTML = "<p class='text-center text-slate-400'>Belum ada cerita...</p>";
            return;
        }

        archiveSection.classList.remove('hidden');

        if (targetId) {
            // MODE BACA FULL
            const focus = stories.find(s => s.id === targetId);
            renderFullStory(focus);
            renderArchive(stories.filter(s => s.id !== targetId));
        } else {
            // MODE HOME (5 PREVIEW)
            renderPreviews(stories.slice(0, 5));
            renderArchive(stories.slice(5, 15));
        }
    } catch (err) {
        contentArea.innerHTML = "<p class='text-center text-red-400'>Koneksi Error!</p>";
    }
}

function renderPreviews(data) {
    const area = document.getElementById('contentArea');
    area.innerHTML = data.map(item => `
        <div class="story-card-preview active:scale-95 transition-all" onclick="window.scrollTo(0,0); loadData('${item.id}')">
            <span class="text-[7px] font-black text-[#facc15] bg-[#053a6f] px-2 py-0.5 rounded-md inline-block mb-3 uppercase tracking-widest">
                ${item.kategori || 'PRIVATE'}
            </span>
            <h4>${item.judul}</h4>
            <div class="preview-text">${item.isi}</div>
            <div class="mt-4 text-[9px] font-black text-[#053a6f] uppercase tracking-widest">
                Baca Selengkapnya <i class="fa-solid fa-arrow-right ml-1"></i>
            </div>
        </div>
    `).join('');
}

function renderFullStory(fokus) {
    const area = document.getElementById('contentArea');
    area.innerHTML = `
        <div class="story-card-full border-b-8 border-[#facc15]">
            <button onclick="loadData()" class="mb-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                <i class="fa-solid fa-chevron-left mr-1"></i> Kembali ke Home
            </button>
            <p class="text-[8px] font-black text-[#facc15] bg-[#053a6f] px-3 py-1 rounded-full inline-block mb-4 uppercase">
                ${fokus.kategori || 'PRIVATE'}
            </p>
            <h4 class="text-2xl font-black text-[#053a6f] leading-tight mb-6 italic tracking-tighter">${fokus.judul}</h4>
            <div class="content-text">${fokus.isi.replace(/\n/g, '<br>')}</div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderArchive(lainnya) {
    const container = document.getElementById('listLainnya');
    container.innerHTML = "";
    lainnya.forEach(item => {
        const div = document.createElement('div');
        div.className = "list-item active:scale-95 transition-all";
        div.innerHTML = `<span>${item.judul}</span><i class="fa-solid fa-chevron-right text-[10px] opacity-20"></i>`;
        div.onclick = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            loadData(item.id);
        };
        container.appendChild(div);
    });
}

// Global scope injection
window.loadData = loadData;
