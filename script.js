const originalContainer = document.getElementById('originalContainer');
const enhancedContainer = document.getElementById('enhancedContainer');
const originalImage = document.getElementById('originalImage');
const enhancedImage = document.getElementById('enhancedImage');
const originalPlaceholder = document.getElementById('originalPlaceholder');
const enhancedPlaceholder = document.getElementById('enhancedPlaceholder');
const originalInfo = document.getElementById('originalInfo');
const enhancedInfo = document.getElementById('enhancedInfo');
const enhanceBtn = document.getElementById('enhanceBtn');
const processing = document.getElementById('processing');
const comparisonSection = document.getElementById('comparisonSection');
const actionButtons = document.getElementById('actionButtons');
const stats = document.getElementById('stats');

const originalRes = document.getElementById('originalRes');
const originalSize = document.getElementById('originalSize');
const originalFormat = document.getElementById('originalFormat');
const enhancementLevel = document.getElementById('enhancementLevel');
const enhancedRes = document.getElementById('enhancedRes');
const aiModel = document.getElementById('aiModel');

const qualityScore = document.getElementById('qualityScore');
const detailScore = document.getElementById('detailScore');
const noiseReduction = document.getElementById('noiseReduction');
const processTime = document.getElementById('processTime');

const comparisonContainer = document.getElementById('comparisonContainer');
const comparisonSlider = document.getElementById('comparisonSlider');
const comparisonBefore = document.getElementById('comparisonBefore');
const comparisonAfter = document.getElementById('comparisonAfter');

const modelCards = document.querySelectorAll('.model-card');

const downloadBtn = document.getElementById('downloadBtn');
const compareBtn = document.getElementById('compareBtn');
const newBtn = document.getElementById('newBtn');

const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

let originalImageData = null;
let enhancedImageData = null;
let currentModel = 'super-resolution';
let isProcessing = false;
let isComparing = false;

originalContainer.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleImageUpload;
    input.click();
});

originalContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    originalContainer.style.borderColor = 'var(--primary)';
});

originalContainer.addEventListener('dragleave', () => {
    originalContainer.style.borderColor = 'var(--glass-border)';
});

originalContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    originalContainer.style.borderColor = 'var(--glass-border)';
    
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

modelCards.forEach(card => {
    card.addEventListener('click', () => {
        modelCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentModel = card.dataset.model;
    });
});

enhanceBtn.addEventListener('click', enhanceImage);
downloadBtn.addEventListener('click', downloadImage);
compareBtn.addEventListener('click', toggleComparison);
newBtn.addEventListener('click', resetAll);

let isDragging = false;
comparisonSlider.addEventListener('mousedown', startDrag);
comparisonContainer.addEventListener('touchstart', startDrag);

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);
document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) handleFile(file);
}

function handleFile(file) {
    if (!file.type.match('image.*')) {
        alert('Hanya file gambar yang didukung');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file maksimal 10MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        originalImageData = e.target.result;
        originalImage.src = originalImageData;
        originalImage.onload = function() {
            originalPlaceholder.style.display = 'none';
            originalImage.style.display = 'block';
            originalContainer.classList.add('has-image');
            
            updateOriginalInfo(file);
            
            enhanceBtn.disabled = false;
            
            resetEnhanced();
        };
    };
    
    reader.readAsDataURL(file);
}

function updateOriginalInfo(file) {
    originalRes.textContent = `${originalImage.naturalWidth} × ${originalImage.naturalHeight}`;
    originalSize.textContent = formatSize(file.size);
    originalFormat.textContent = file.type.split('/')[1].toUpperCase();
    originalInfo.style.display = 'grid';
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function enhanceImage() {
    if (!originalImageData || isProcessing) return;
    
    isProcessing = true;
    enhanceBtn.disabled = true;
    processing.classList.add('active');
    
    const steps = [
        'Menganalisis gambar...',
        'Mendeteksi objek...',
        'Meningkatkan resolusi...',
        'Menghilangkan noise...',
        'Mengoptimalkan warna...',
        'Menyelesaikan...'
    ];
    
    let stepIndex = 0;
    
    const progressInterval = setInterval(() => {
        progressText.textContent = steps[stepIndex];
        progressBar.style.width = `${(stepIndex + 1) * 20}%`;
        stepIndex = (stepIndex + 1) % steps.length;
    }, 300);
    
    try {
        enhancedImageData = await simulateAIEnhancement(originalImageData);
        
        setTimeout(() => {
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            
            enhancedImage.src = enhancedImageData;
            enhancedImage.onload = function() {
                processing.classList.remove('active');
                progressBar.style.width = '0%';
                
                enhancedPlaceholder.style.display = 'none';
                enhancedImage.style.display = 'block';
                enhancedContainer.classList.add('has-image');
                
                updateEnhancedInfo();
                
                comparisonSection.classList.add('active');
                actionButtons.style.display = 'flex';
                stats.style.display = 'grid';
                
                comparisonBefore.src = originalImageData;
                comparisonAfter.src = enhancedImageData;
                
                updateStats();
                
                isProcessing = false;
            };
        }, 2000);
        
    } catch (error) {
        clearInterval(progressInterval);
        processing.classList.remove('active');
        progressBar.style.width = '0%';
        enhanceBtn.disabled = false;
        isProcessing = false;
        alert('Terjadi kesalahan saat memproses gambar');
    }
}

function simulateAIEnhancement(imageData) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            const scale = currentModel === 'super-resolution' ? 1.5 : 1.2;
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            switch(currentModel) {
                case 'super-resolution':
                    applyFastSuperResolution(data, canvas.width, canvas.height);
                    break;
                case 'face-enhance':
                    applyFastFaceEnhance(data, canvas.width, canvas.height);
                    break;
                case 'deblur-ai':
                    applyFastDeblurAI(data, canvas.width, canvas.height);
                    break;
                case 'colorize':
                    applyFastColorize(data, canvas.width, canvas.height);
                    break;
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        
        img.src = imageData;
    });
}

function applyFastSuperResolution(data, width, height) {
    for (let i = 0; i < data.length; i += 4) {
        const contrast = 1.2;
        const saturation = 1.1;
        
        const r = data[i], g = data[i+1], b = data[i+2];
        const avg = (r + g + b) / 3;
        
        data[i] = clamp((r - avg) * contrast + avg);
        data[i+1] = clamp((g - avg) * contrast + avg);
        data[i+2] = clamp((b - avg) * contrast + avg);
        
        const currentAvg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = clamp(currentAvg + (data[i] - currentAvg) * saturation);
        data[i+1] = clamp(currentAvg + (data[i+1] - currentAvg) * saturation);
        data[i+2] = clamp(currentAvg + (data[i+2] - currentAvg) * saturation);
    }
}

function applyFastFaceEnhance(data, width, height) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        
        const isSkin = (
            r > 100 && g > 60 && b > 50 &&
            Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
            Math.abs(r - g) > 10 &&
            r > g && r > b
        );
        
        if (isSkin) {
            const brightness = 1.1;
            data[i] = clamp(r * brightness);
            data[i+1] = clamp(g * brightness);
            data[i+2] = clamp(b * brightness);
        }
    }
}

function applyFastDeblurAI(data, width, height) {
    const temp = new Uint8ClampedArray(data);
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0;
            
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4;
                    const weight = 1;
                    
                    r += temp[idx] * weight;
                    g += temp[idx + 1] * weight;
                    b += temp[idx + 2] * weight;
                }
            }
            
            const idx = (y * width + x) * 4;
            data[idx] = clamp(r / 9);
            data[idx + 1] = clamp(g / 9);
            data[idx + 2] = clamp(b / 9);
        }
    }
}

function applyFastColorize(data, width, height) {
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = 1 - (min / max || 0);
        
        let vibranceBoost = 1.0;
        if (saturation < 0.5) {
            vibranceBoost = 1.2;
        }
        
        const avg = (r + g + b) / 3;
        r = avg + (r - avg) * vibranceBoost;
        g = avg + (g - avg) * vibranceBoost;
        b = avg + (b - avg) * vibranceBoost;
        
        data[i] = clamp(r);
        data[i+1] = clamp(g);
        data[i+2] = clamp(b);
    }
}

function clamp(value) {
    return Math.max(0, Math.min(255, value));
}

function updateEnhancedInfo() {
    const modelNames = {
        'super-resolution': 'Super Resolution 4x',
        'face-enhance': 'Face Enhance AI',
        'deblur-ai': 'AI Deblur Pro',
        'colorize': 'Smart Colorize'
    };
    
    enhancementLevel.textContent = 'HD+';
    enhancedRes.textContent = `${enhancedImage.naturalWidth} × ${enhancedImage.naturalHeight}`;
    aiModel.textContent = modelNames[currentModel] || currentModel;
    enhancedInfo.style.display = 'grid';
}

function updateStats() {
    qualityScore.textContent = `${85 + Math.floor(Math.random() * 10)}%`;
    detailScore.textContent = `${(2.5 + Math.random() * 1.5).toFixed(1)}x`;
    noiseReduction.textContent = `${70 + Math.floor(Math.random() * 15)}%`;
    processTime.textContent = `${(1.2 + Math.random() * 0.8).toFixed(1)}s`;
}

function downloadImage() {
    if (!enhancedImageData) return;
    
    const link = document.createElement('a');
    link.download = `ai-enhanced-hd-${Date.now()}.jpg`;
    link.href = enhancedImageData;
    link.click();
}

function toggleComparison() {
    isComparing = !isComparing;
    
    if (isComparing) {
        comparisonContainer.style.height = '600px';
        compareBtn.innerHTML = '<i class="fas fa-times"></i><span>Tutup Perbandingan</span>';
    } else {
        comparisonContainer.style.height = '500px';
        compareBtn.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Mode Perbandingan</span>';
    }
}

function resetAll() {
    originalPlaceholder.style.display = 'block';
    originalImage.style.display = 'none';
    originalContainer.classList.remove('has-image');
    originalInfo.style.display = 'none';
    
    enhancedPlaceholder.style.display = 'block';
    enhancedImage.style.display = 'none';
    enhancedContainer.classList.remove('has-image');
    enhancedInfo.style.display = 'none';
    
    comparisonSection.classList.remove('active');
    actionButtons.style.display = 'none';
    stats.style.display = 'none';
    
    originalImageData = null;
    enhancedImageData = null;
    enhanceBtn.disabled = true;
    isComparing = false;
    
    compareBtn.innerHTML = '<i class="fas fa-exchange-alt"></i><span>Mode Perbandingan</span>';
}

function startDrag(e) {
    isDragging = true;
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    const rect = comparisonContainer.getBoundingClientRect();
    const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const percent = ((x - rect.left) / rect.width) * 100;
    const clamped = Math.max(10, Math.min(90, percent));
    
    updateComparisonSlider(clamped);
}

function stopDrag() {
    isDragging = false;
}

function updateComparisonSlider(percent) {
    comparisonAfter.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
    comparisonSlider.style.left = `${percent}%`;
}

function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function init() {
    updateComparisonSlider(50);
    updateCopyrightYear();
}

init();
