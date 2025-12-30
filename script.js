// ===== CONFIGURATION =====
const TRIPS_CONFIG = {
    tripsFolder: 'trips',
    trips: [
        'Isha Foundation',
        'Manthralaya Trip - Second Time',
        'Mysore Dussehra',
        'Hampi Trip',
        'Mysore Trip with No Plan clan',
        'Ramdevara Betta',
        'Belur Trip',
        'Nandi Hills',
        'Anjanadri Trip',
        'Manthralaya Trip - First Time',
        'Kotilingeshwara',
        'Mandaragiri Hills',
        'Omkar Hills',
        'Shivagange Hills'


    ]
};

// ===== STATE MANAGEMENT =====
let currentTrip = null;
let currentImages = [];
let currentLightboxIndex = 0;

// ===== DOM ELEMENTS =====
const elements = {
    tripsGrid: document.getElementById('trips-grid'),
    tripsView: document.getElementById('trips-view'),
    aboutView: document.getElementById('about-view'),
    galleryView: document.getElementById('gallery-view'),
    galleryHeader: document.getElementById('gallery-header'),
    imagesGrid: document.getElementById('images-grid'),
    backBtn: document.getElementById('back-btn'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    navBtns: document.querySelectorAll('.nav-btn')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadTrips();
    initializeLightbox();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);

            // Update active state
            elements.navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    elements.backBtn.addEventListener('click', () => {
        switchView('trips');
        elements.navBtns.forEach(b => b.classList.remove('active'));
        elements.navBtns[0].classList.add('active');
    });
}

function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show selected view
    if (viewName === 'trips') {
        elements.tripsView.classList.add('active');
    } else if (viewName === 'about') {
        elements.aboutView.classList.add('active');
    } else if (viewName === 'gallery') {
        elements.galleryView.classList.add('active');
    }
}

// ===== LOAD TRIPS =====
async function loadTrips() {
    try {
        const tripsData = await Promise.all(
            TRIPS_CONFIG.trips.map(tripFolder => loadTripData(tripFolder))
        );

        renderTrips(tripsData);
    } catch (error) {
        console.error('Error loading trips:', error);
        elements.tripsGrid.innerHTML = `
            <div class="loading">
                <p style="color: var(--secondary);">Error loading trips. Please try again.</p>
            </div>
        `;
    }
}

async function loadTripData(tripFolder) {
    try {
        const metaResponse = await fetch(`${TRIPS_CONFIG.tripsFolder}/${tripFolder}/meta.json`);
        const meta = await metaResponse.json();

        // Get images from meta.json or discover them
        const images = meta.images
            ? meta.images.map(img => `${TRIPS_CONFIG.tripsFolder}/${tripFolder}/${img}`)
            : await getTripImages(tripFolder, meta);

        return {
            folder: tripFolder,
            meta,
            images
        };
    } catch (error) {
        console.error(`Error loading trip ${tripFolder}:`, error);
        return null;
    }
}

async function getTripImages(tripFolder, meta) {
    // If meta.json doesn't have images array, try to discover them
    // This is a fallback - it's better to list images in meta.json
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const images = [];

    // If cover image is specified, include it
    if (meta.cover) {
        images.push(`${TRIPS_CONFIG.tripsFolder}/${tripFolder}/${meta.cover}`);
    }

    // Try to load images with common naming patterns
    for (let i = 1; i <= 50; i++) {
        for (const ext of imageExtensions) {
            const imagePath = `${TRIPS_CONFIG.tripsFolder}/${tripFolder}/img${i}.${ext}`;
            if (await imageExists(imagePath)) {
                images.push(imagePath);
            }
        }
    }

    // Also try other common patterns based on trip folder name
    const commonNames = ['beach', 'mountain', 'sunset', 'landscape', 'photo', 'image'];
    for (const name of commonNames) {
        for (let i = 1; i <= 10; i++) {
            for (const ext of imageExtensions) {
                const imagePath = `${TRIPS_CONFIG.tripsFolder}/${tripFolder}/${name}${i}.${ext}`;
                if (await imageExists(imagePath)) {
                    images.push(imagePath);
                }
            }
        }
    }

    return [...new Set(images)]; // Remove duplicates
}

async function imageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// ===== RENDER TRIPS =====
function renderTrips(tripsData) {
    elements.tripsGrid.innerHTML = '';

    tripsData.filter(trip => trip !== null).forEach(trip => {
        const card = createTripCard(trip);
        elements.tripsGrid.appendChild(card);
    });
}

function createTripCard(trip) {
    const card = document.createElement('div');
    card.className = 'trip-card glass-card';

    const coverImage = `${TRIPS_CONFIG.tripsFolder}/${trip.folder}/${trip.meta.cover}`;

    card.innerHTML = `
        <img src="${coverImage}" alt="${trip.meta.trip_name}" class="trip-card-image" loading="lazy">
        <div class="trip-card-overlay">
            <h3 class="trip-card-title">${trip.meta.trip_name}</h3>
            <p class="trip-card-date">🗓️ ${trip.meta.date}</p>
            <div class="trip-card-members">
                ${trip.meta.members.map(member => `
                    <span class="member-tag">👤 ${member}</span>
                `).join('')}
            </div>
        </div>
    `;

    card.addEventListener('click', () => openGallery(trip));

    // Add entrance animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);

    return card;
}

// ===== GALLERY VIEW =====
async function openGallery(trip) {
    currentTrip = trip;
    currentImages = trip.images;

    // Render gallery header
    elements.galleryHeader.innerHTML = `
        <h2 class="gallery-title">${trip.meta.trip_name}</h2>
        <p class="gallery-date">🗓️ ${trip.meta.date}</p>
        <div class="gallery-members">
            ${trip.meta.members.map(member => `
                <span class="member-tag">👤 ${member}</span>
            `).join('')}
        </div>
    `;

    // Render images
    renderGalleryImages(trip.images);

    // Switch to gallery view
    switchView('gallery');
}

function renderGalleryImages(images) {
    elements.imagesGrid.innerHTML = '';

    if (images.length === 0) {
        elements.imagesGrid.innerHTML = `
            <div class="loading">
                <p>No images found for this trip.</p>
            </div>
        `;
        return;
    }

    images.forEach((imagePath, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';

        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `${currentTrip.meta.trip_name} - Image ${index + 1}`;
        img.loading = 'lazy';

        imageItem.appendChild(img);
        imageItem.addEventListener('click', () => openLightbox(index));

        // Add entrance animation
        imageItem.style.opacity = '0';
        imageItem.style.transform = 'scale(0.9)';
        setTimeout(() => {
            imageItem.style.transition = 'all 0.5s ease';
            imageItem.style.opacity = '1';
            imageItem.style.transform = 'scale(1)';
        }, index * 50);

        elements.imagesGrid.appendChild(imageItem);
    });
}

// ===== LIGHTBOX =====
function initializeLightbox() {
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Close on background click
    elements.lightbox.addEventListener('click', (e) => {
        if (e.target === elements.lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!elements.lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    elements.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    elements.lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;

    // Wrap around
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = currentImages.length - 1;
    } else if (currentLightboxIndex >= currentImages.length) {
        currentLightboxIndex = 0;
    }

    updateLightboxImage();
}

function updateLightboxImage() {
    if (currentImages.length === 0) return;

    elements.lightboxImg.style.opacity = '0';

    setTimeout(() => {
        elements.lightboxImg.src = currentImages[currentLightboxIndex];
        elements.lightboxImg.alt = `${currentTrip.meta.trip_name} - Image ${currentLightboxIndex + 1}`;
        elements.lightboxImg.style.opacity = '1';
    }, 200);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== PERFORMANCE: Intersection Observer for Lazy Loading =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    // This will be used for future lazy-loaded images
    window.observeImage = (img) => imageObserver.observe(img);
}

console.log('🎉 Trip Gallery initialized successfully!');
