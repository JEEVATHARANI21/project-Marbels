// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery image hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const image = item.querySelector('.gallery-image img');
        const overlay = item.querySelector('.gallery-overlay');
        
        item.addEventListener('mouseenter', function() {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            if (overlay) {
                overlay.style.transform = 'translateY(100%)';
            }
        });
    });

    // Lightbox functionality for gallery images
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-info">
                    <h3 class="lightbox-title"></h3>
                    <p class="lightbox-description"></p>
                </div>
                <button class="lightbox-prev">❮</button>
                <button class="lightbox-next">❯</button>
            </div>
        `;
        document.body.appendChild(lightbox);
        return lightbox;
    }

    // Initialize lightbox
    const lightbox = createLightbox();
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxDescription = lightbox.querySelector('.lightbox-description');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let galleryImages = [];

    // Collect all gallery images
    function collectGalleryImages() {
        galleryImages = Array.from(document.querySelectorAll('.gallery-item')).map(item => {
            const img = item.querySelector('.gallery-image img');
            const title = item.querySelector('.gallery-info h3');
            const description = item.querySelector('.gallery-info p');
            
            return {
                src: img.src,
                alt: img.alt,
                title: title ? title.textContent : '',
                description: description ? description.textContent : ''
            };
        });
    }

    // Show lightbox
    function showLightbox(index) {
        collectGalleryImages();
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add animation
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
    }

    // Hide lightbox
    function hideLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Update lightbox content
    function updateLightboxContent() {
        const image = galleryImages[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = image.title;
        lightboxDescription.textContent = image.description;
    }

    // Navigate to previous image
    function showPreviousImage() {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
        updateLightboxContent();
    }

    // Navigate to next image
    function showNextImage() {
        currentImageIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
        updateLightboxContent();
    }

    // Event listeners for gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            showLightbox(index);
        });
    });

    // Event listeners for lightbox controls
    lightboxClose.addEventListener('click', hideLightbox);
    lightboxPrev.addEventListener('click', showPreviousImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            hideLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    hideLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });

    // Smooth scroll to gallery sections
    document.querySelectorAll('a[href^="#showcase"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lazy loading for gallery images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.gallery-image img').forEach(img => {
        imageObserver.observe(img);
    });

    // Add masonry-like layout for gallery items
    function adjustGalleryLayout() {
        const galleries = document.querySelectorAll('.gallery-grid');
        
        galleries.forEach(gallery => {
            const items = gallery.querySelectorAll('.gallery-item');
            
            // Reset any previous transforms
            items.forEach(item => {
                item.style.transform = '';
            });
            
            // Apply masonry layout on larger screens
            if (window.innerWidth > 768) {
                let columns = 3;
                let columnHeights = new Array(columns).fill(0);
                
                items.forEach((item, index) => {
                    const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
                    const itemHeight = item.offsetHeight;
                    
                    if (index >= columns) {
                        const translateY = columnHeights[shortestColumn];
                        item.style.transform = `translateY(${translateY - item.offsetTop + items[shortestColumn].offsetTop}px)`;
                    }
                    
                    columnHeights[shortestColumn] += itemHeight + 32; // 32px gap
                });
            }
        });
    }

    // Adjust layout on load and resize
    window.addEventListener('load', adjustGalleryLayout);
    window.addEventListener('resize', adjustGalleryLayout);

    // Add staggered animation for gallery items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const galleryObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.gallery-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                galleryObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe gallery sections
    document.querySelectorAll('.gallery-section').forEach(section => {
        // Initially hide items
        section.querySelectorAll('.gallery-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
        });
        
        galleryObserver.observe(section);
    });
});

// Add CSS for lightbox (injected via JavaScript)
const lightboxStyles = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lightbox.active {
        opacity: 1;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .lightbox-image {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
    }
    
    .lightbox-info {
        text-align: center;
        margin-top: 2rem;
        max-width: 600px;
    }
    
    .lightbox-title {
        color: #FFD700;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .lightbox-description {
        color: #ffffff;
        opacity: 0.9;
    }
    
    .lightbox-close {
        position: absolute;
        top: -50px;
        right: -50px;
        color: #FFD700;
        font-size: 3rem;
        cursor: pointer;
        transition: all 0.3s ease;
        background: none;
        border: none;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .lightbox-close:hover {
        color: #ffffff;
        transform: scale(1.1);
    }
    
    .lightbox-prev,
    .lightbox-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 215, 0, 0.8);
        color: #0a0a0a;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .lightbox-prev {
        left: -80px;
    }
    
    .lightbox-next {
        right: -80px;
    }
    
    .lightbox-prev:hover,
    .lightbox-next:hover {
        background: #FFD700;
        transform: translateY(-50%) scale(1.1);
    }
    
    @media (max-width: 768px) {
        .lightbox-close {
            top: -40px;
            right: -10px;
            font-size: 2rem;
        }
        
        .lightbox-prev,
        .lightbox-next {
            width: 40px;
            height: 40px;
            font-size: 1rem;
        }
        
        .lightbox-prev {
            left: -60px;
        }
        
        .lightbox-next {
            right: -60px;
        }
        
        .lightbox-info {
            margin-top: 1rem;
        }
        
        .lightbox-title {
            font-size: 1.2rem;
        }
    }
`;

// Inject lightbox styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);