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

// --- AUTH HANDLER ---
document.getElementById('btnLogin').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    signInWithEmailAndPassword(auth, email, pass).catch(() => alert("Kunci Salah, Bro!"));
});

document.getElementById('btnLogout').onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    document.getElementById('mainBody').className = user ? 'auth-active' : 'unauth';
    if(user) loadData();
});

// --- DATA HANDLER ---
async function loadData(targetId = null) {
    const q = query(collection(db, "cerita"), orderBy("tanggal", "desc"), limit(10));
    const snapshot = await getDocs(q);
    const stories = [];
    snapshot.forEach(doc => stories.push({ id: doc.id, ...doc.data() }));

    if (stories.length === 0) return;

    // Logika ID: Pake yang pertama atau yang diklik
    let focus = stories[0];
    if (targetId) {
        focus = stories.find(s => s.id === targetId) || stories[0];
    }

    renderFocus(focus);
    renderList(stories.filter(s => s.id !== focus.id).slice(0, 5));
}

function renderFocus(fokus) {
    document.getElementById('focusArea').innerHTML = `
        <div class="story-card border-b-8 border-[#facc15]">
            <p class="text-[8px] font-black text-[#facc15] bg-[#053a6f] px-3 py-1 rounded-full inline-block mb-4 uppercase tracking-widest">
                ${fokus.kategori || 'PRIVATE'}
            </p>
            <h4>${fokus.judul}</h4>
            <div class="content-text">${fokus.isi.replace(/\n/g, '<br>')}</div>
        </div>
    `;
}

function renderList(lainnya) {
    const listContainer = document.getElementById('listLainnya');
    listContainer.innerHTML = "";
    
    lainnya.forEach(item => {
        const div = document.createElement('div');
        div.className = "list-item active:scale-95 transition-all";
        div.innerHTML = `<span>${item.judul}</span><i class="fa-solid fa-chevron-right text-[10px] opacity-20"></i>`;
        div.onclick = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            loadData(item.id);
        };
        listContainer.appendChild(div);
    });
          }
