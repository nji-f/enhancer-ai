const imageInput = document.getElementById('imageInput');
const uploadPreview = document.getElementById('uploadPreview');
const previewContainer = document.getElementById('previewContainer');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');

imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadPreview.src = e.target.result;
            previewContainer.classList.remove('hidden');
            uploadPlaceholder.classList.add('hidden');
        }
        reader.readAsDataURL(file);
    }
});

async function processImage() {
    const scale = document.getElementById('scaleInput').value;
    const isAnime = document.getElementById('animeToggle').value;
    const btnSubmit = document.getElementById('btnSubmit');
    const statusDiv = document.getElementById('status');
    const resultDiv = document.getElementById('result');
    const outputImg = document.getElementById('outputImage');
    const downloadBtn = document.getElementById('downloadBtn');

    if (imageInput.files.length === 0) return;

    const file = imageInput.files[0];

    btnSubmit.disabled = true;
    statusDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    try {
        const dimensions = await getImageDimensions(file);
        const newWidth = dimensions.width * parseInt(scale);
        const newHeight = dimensions.height * parseInt(scale);

        const formData = new FormData();
        formData.append("desiredHeight", newHeight.toString());
        formData.append("desiredWidth", newWidth.toString());
        formData.append("anime", isAnime);
        formData.append("image_file", file);

        const response = await fetch("proxy.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.error || !data.bgRemoved) throw new Error(data.error);

        outputImg.src = data.bgRemoved;
        downloadBtn.href = data.bgRemoved;
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        alert("Gagal memproses: " + error.message);
    } finally {
        btnSubmit.disabled = false;
        statusDiv.classList.add('hidden');
    }
}

function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject();
        img.src = URL.createObjectURL(file);
    });
}
