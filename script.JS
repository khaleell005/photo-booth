// Access DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapButton = document.getElementById('snap');
const photoStrip = document.getElementById('photoStrip');
const downloadButton = document.getElementById('download');
const retakeButton = document.getElementById('retake');
const controls = document.getElementById('controls');
const stickerSelect = document.getElementById('stickerSelect');
const stripColor = document.getElementById('stripColor');
const applyOptionsButton = document.getElementById('applyOptions');

// Set canvas size to match square photos
canvas.width = 400;
canvas.height = 400;

let photoCount = 0;
let photos = [];
let stickers = {
    heart: 'https://img.icons8.com/color/48/000000/heart.png',
    star: 'https://img.icons8.com/color/48/000000/star.png',
    cat: 'https://img.icons8.com/color/48/000000/cat.png'
};

// Request webcam access
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error accessing webcam:', err);
        alert('Could not access your webcam. Please allow camera permissions.');
    });

// Apply sticker and color options
applyOptionsButton.addEventListener('click', () => {
    const selectedColor = stripColor.value;
    photoStrip.style.backgroundColor = selectedColor;

    // Update the color for all existing photos (if any)
    const images = photoStrip.getElementsByTagName('img');
    for (let img of images) {
        img.style.backgroundColor = selectedColor;
    }
});

// Take a photo when the button is clicked
snapButton.addEventListener('click', () => {
    if (photoCount < 4) {
        const context = canvas.getContext('2d');
        const offset = (300 - 400) / 2; // Center vertically
        context.drawImage(video, 0, -offset, 400, 400);

        // Add sticker if selected
        const selectedSticker = stickerSelect.value;
        if (selectedSticker && stickers[selectedSticker]) {
            const stickerImg = new Image();
            stickerImg.src = stickers[selectedSticker];
            stickerImg.onload = () => {
                context.drawImage(stickerImg, 300, 300, 100, 100); // Position sticker (adjust as needed)
                finalizePhoto(context);
            };
        } else {
            finalizePhoto(context);
        }
    }
});

function finalizePhoto(context) {
    const photoData = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = photoData;
    img.style.backgroundColor = stripColor.value; // Match strip color
    photoStrip.appendChild(img);
    photos.push(photoData);

    photoCount++;

    if (photoCount === 4) {
        snapButton.style.display = 'none';
        controls.style.display = 'block';
    }
}

// Download the photo strip
downloadButton.addEventListener('click', () => {
    const stripCanvas = document.createElement('canvas');
    stripCanvas.width = 400;
    stripCanvas.height = 400 * 4;
    const ctx = stripCanvas.getContext('2d');

    photos.forEach((photo, index) => {
        const img = new Image();
        img.src = photo;
        img.onload = () => {
            ctx.drawImage(img, 0, index * 400, 400, 400);
            if (index === 3) {
                const link = document.createElement('a');
                link.download = 'photo-strip.png';
                link.href = stripCanvas.toDataURL('image/png');
                link.click();
            }
        };
    });
});

// Retake photos
retakeButton.addEventListener('click', () => {
    photoCount = 0;
    photos = [];
    photoStrip.innerHTML = '';
    snapButton.style.display = 'block';
    controls.style.display = 'none';
    photoStrip.style.backgroundColor = stripColor.value; // Reset strip color
});