import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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
let selCat = "";

document.querySelectorAll('.cat-item').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.cat-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selCat = btn.dataset.cat;
    };
});

document.getElementById('btnPublish').onclick = async () => {
    const judul = document.getElementById('judul').value;
    const isi = document.getElementById('isi').value;
    if(!selCat || !judul || !isi) return alert("Lengkapi data!");

    const d = new Date();
    const tgl = `${String(d.getDate()).padStart(2, '0')} - ${String(d.getMonth() + 1).padStart(2, '0')} - ${d.getFullYear()}`;

    try {
        await addDoc(collection(db, "cerita"), {
            judul, kategori: selCat, isi, tanggal: tgl, createdAt: serverTimestamp()
        });
        window.location.href = "index.html";
    } catch (e) { alert(e.message); }
};
