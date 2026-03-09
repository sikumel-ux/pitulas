function renderItems(data) {
    const container = document.getElementById('content-list');
    container.innerHTML = '';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'story-card';
        
        if(item.kategori === 'Video') {
            // Container khusus video supaya tidak error
            card.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">Twitter Video</span>
                    <span class="text-[9px] text-gray-400 font-bold">${item.tanggal || '09-03-2026'}</span>
                </div>
                <div class="twitter-wrapper">
                    <blockquote class="twitter-video" data-lang="en">
                        <a href="${item.isi}"></a>
                    </blockquote>
                </div>
            `;
        } else {
            card.onclick = () => card.classList.toggle('expanded');
            card.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <span class="bg-[#053a6f]/10 text-[#053a6f] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">${item.kategori}</span>
                    <span class="text-[9px] text-gray-400 font-bold">${item.tanggal}</span>
                </div>
                <h4>${item.judul}</h4>
                <p class="content-text">${item.isi.replace(/\n/g, '<br>')}</p>
                <div class="mt-4 pt-4 border-t border-dashed border-gray-100 flex justify-center">
                    <i class="fa-solid fa-chevron-down text-gray-300 text-xs"></i>
                </div>
            `;
        }
        container.appendChild(card);
    });

    // PENTING: Kasih delay dikit supaya HTML terpasang sempurna sebelum di-scan Twitter
    setTimeout(() => {
        if(window.twttr && typeof window.twttr.widgets !== 'undefined') {
            window.twttr.widgets.load();
        }
    }, 100);
}
