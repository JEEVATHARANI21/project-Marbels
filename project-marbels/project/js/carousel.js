// Carousel functionality for Products page
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel-wrapper');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!carousel || slides.length === 0) return;
    
    let currentSlideIndex = 0;
    let isTransitioning = false;
    
    // Initialize carousel
    function initCarousel() {
        showSlide(0);
        startAutoPlay();
    }
    
    // Show specific slide
    function showSlide(index) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlideIndex = index;
        
        // Reset transition flag after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        const prevIndex = currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1;
        showSlide(prevIndex);
    }
    
    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function restartAutoPlay() {
        stopAutoPlay();
        setTimeout(startAutoPlay, 1000);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            restartAutoPlay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            restartAutoPlay();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (index !== currentSlideIndex) {
                showSlide(index);
                restartAutoPlay();
            }
        });
    });
    
    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        stopAutoPlay();
    });
    
    carousel.addEventListener('touchmove', function(e) {
        endX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', function() {
        const difference = startX - endX;
        const threshold = 50; // Minimum swipe distance
        
        if (Math.abs(difference) > threshold) {
            if (difference > 0) {
                // Swiped left - next slide
                nextSlide();
            } else {
                // Swiped right - previous slide
                prevSlide();
            }
        }
        
        restartAutoPlay();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (carousel.matches(':hover') || document.activeElement === carousel) {
            switch(e.key) {
                case 'ArrowLeft':
                    prevSlide();
                    restartAutoPlay();
                    break;
                case 'ArrowRight':
                    nextSlide();
                    restartAutoPlay();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    if (autoPlayInterval) {
                        stopAutoPlay();
                    } else {
                        startAutoPlay();
                    }
                    break;
            }
        }
    });
    
    // Add loading indicators
    function showLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'carousel-loading';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
        carousel.appendChild(loadingDiv);
        
        setTimeout(() => {
            loadingDiv.remove();
        }, 500);
    }
    
    // Enhanced transition effects
    function addTransitionEffects() {
        slides.forEach((slide, index) => {
            slide.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            if (index !== currentSlideIndex) {
                slide.style.transform = 'scale(0.95)';
                slide.style.opacity = '0';
            } else {
                slide.style.transform = 'scale(1)';
                slide.style.opacity = '1';
            }
        });
    }
    
    // Update showSlide function to include transition effects
    const originalShowSlide = showSlide;
    showSlide = function(index) {
        originalShowSlide(index);
        addTransitionEffects();
    };
    
    // Initialize carousel with enhanced effects
    initCarousel();
    addTransitionEffects();
    
    // Add progress indicator
    function createProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'carousel-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        carousel.appendChild(progressBar);
        
        const progressFill = progressBar.querySelector('.progress-fill');
        
        function updateProgress() {
            const progress = ((currentSlideIndex + 1) / slides.length) * 100;
            progressFill.style.width = progress + '%';
        }
        
        // Update progress on slide change
        const observer = new MutationObserver(updateProgress);
        observer.observe(carousel, { 
            attributes: true, 
            childList: true, 
            subtree: true 
        });
        
        updateProgress();
    }
    
    createProgressIndicator();
});