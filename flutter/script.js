// Dummy Data
const products = [
    { id: 1, name: "Ultra Smartphone", price: "Rp 4.500.000", image: "https://picsum.photos/200?random=1" },
    { id: 2, name: "Wireless Earbuds", price: "Rp 850.000", image: "https://picsum.photos/200?random=2" },
    { id: 3, name: "Smart Watch V2", price: "Rp 1.200.000", image: "https://picsum.photos/200?random=3" },
    { id: 4, name: "Mechanical Keyboard", price: "Rp 950.000", image: "https://picsum.photos/200?random=4" },
    { id: 5, name: "Powerbank 20k mAh", price: "Rp 400.000", image: "https://picsum.photos/200?random=5" },
    { id: 6, name: "Gaming Mouse", price: "Rp 550.000", image: "https://picsum.photos/200?random=6" }
];

const catalogGrid = document.getElementById('catalog-grid');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

// 1. Render Products
function renderCatalog(items) {
    catalogGrid.innerHTML = '';
    
    if (items.length === 0) {
        catalogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Produk tidak ditemukan.</p>';
        return;
    }

    items.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="product-price">${product.price}</span>
                <button class="btn-detail">Detail</button>
            </div>
        `;
        catalogGrid.appendChild(card);
    });
}

// 2. Search Filter
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(term)
    );
    renderCatalog(filtered);
});

// 3. Dark Mode Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark-mode') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
        document.body.className = 'dark-mode';
        localStorage.setItem('theme', 'dark-mode');
        updateThemeIcon('dark-mode');
    } else {
        document.body.className = 'light-mode';
        localStorage.setItem('theme', 'light-mode');
        updateThemeIcon('light-mode');
    }
});

// Initialize
initTheme();
renderCatalog(products);
