document.getElementById('fileInput').addEventListener('change', function(e) {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = ''; // Reset preview
    
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        if (file.type.startsWith('image/')) {
            previewContainer.innerHTML = `<img src="${url}" style="max-width:100%; border-radius:10px; margin-top:10px;">`;
        } else if (file.type.startsWith('video/')) {
            previewContainer.innerHTML = `<video src="${url}" controls style="max-width:100%; border-radius:10px; margin-top:10px;"></video>`;
        }
    }
});
