// DOM
const saveBtn = document.getElementById("saveBtn");
const listCerita = document.getElementById("listCerita");
const themeToggle = document.getElementById("theme-toggle");

// Light / Dark
themeToggle.addEventListener("click", () => {
  const body = document.body;
  body.classList.toggle("dark");
  body.classList.toggle("bg-black");
  body.classList.toggle("text-white");

  // swap icon
  const icon = themeToggle.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
});

// Simpan cerita
saveBtn.addEventListener("click", () => {
  const judul = document.getElementById("judul").value.trim();
  const kategori = document.getElementById("kategori").value;
  const isi = document.getElementById("isi").value.trim();
  if (!judul || !isi) return alert("Judul & isi wajib diisi!");

  const cerita = { judul, kategori, isi, waktu: Date.now() };
  let arr = JSON.parse(localStorage.getItem("ceritas") || "[]");
  arr.push(cerita);
  localStorage.setItem("ceritas", JSON.stringify(arr));

  renderCerita();
  clearForm();
});

function clearForm() {
  document.getElementById("judul").value = "";
  document.getElementById("isi").value = "";
}

// Render list
function renderCerita() {
  const arr = JSON.parse(localStorage.getItem("ceritas") || "[]");
  listCerita.innerHTML = arr.map(c => `
    <div class="p-3 border rounded shadow-sm bg-gray-50 dark:bg-gray-800">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold">${c.judul}</h3>
        <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">${c.kategori}</span>
      </div>
      <p class="text-sm">${c.isi}</p>
    </div>
  `).join("");
}

// awal render
renderCerita();
