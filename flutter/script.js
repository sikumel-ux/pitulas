const products = [
    { name: "Macbook Air M2", price: "Rp 18.250.000", img: "https://picsum.photos/300/300?random=11" },
    { name: "iPhone 15 Pro", price: "Rp 21.000.000", img: "https://picsum.photos/300/300?random=12" },
    { name: "Sony WH-1000XM5", price: "Rp 4.299.000", img: "https://picsum.photos/300/300?random=13" },
    { name: "iPad Pro 11", price: "Rp 15.450.000", img: "https://picsum.photos/300/300?random=14" }
];

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

// Render Catalog
function displayProducts(items) {
    productGrid.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <h4>${p.name}</h4>
            <div class="price">${p.price}</div>
            <button class="buy-btn">Beli Sekarang</button>
        </div>
    `).join('');
}

// Search Filter
searchInput.addEventListener('keyup', (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(val));
    displayProducts(filtered);
});

// Dark Mode Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('mode', isDark ? 'dark' : 'light');
});

// Load Preference
if(localStorage.getItem('mode') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Initial Display
displayProducts(products);
