// Hero carousel

class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.autoplayInterval = null;
        this.init();
    }

    async init() {
        await this.loadSlides();
        this.render();
        this.startAutoplay();
    }

    async loadSlides() {
        try {
            const snapshot = await db.collection('banners').where('active', '==', true).orderBy('order').get();
            this.slides = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading slides:', error);
        }
    }

    render() {
        const container = document.getElementById('carouselSlides');
        const progressBar = document.getElementById('carouselProgress');

        if (this.slides.length === 0) {
            container.innerHTML = '<div class="carousel-slide" style="background: var(--color-accent-light);"></div>';
            return;
        }

        container.innerHTML = this.slides.map((slide, index) => `
            <div class="carousel-slide" style="transform: translateX(${(index - this.currentSlide) * 100}%);">
                <img src="${slide.image}" alt="${slide.title}" loading="lazy">
                <div class="carousel-slide-content">
                    <h2>${slide.title}</h2>
                    <a href="${slide.buttonLink || '#'}">${slide.buttonText || 'Découvrir'}</a>
                </div>
            </div>
        `).join('');

        progressBar.style.animation = 'none';
        setTimeout(() => {
            progressBar.style.animation = 'progress 5s linear forwards';
        }, 10);
    }

    next() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }

    updateSlides() {
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${(index - this.currentSlide) * 100}%)`;
        });

        const progressBar = document.getElementById('carouselProgress');
        progressBar.style.animation = 'none';
        setTimeout(() => {
            progressBar.style.animation = 'progress 5s linear forwards';
        }, 10);
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.next(), 5000);
    }

    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }

    pauseAutoplay() {
        this.stopAutoplay();
    }

    resumeAutoplay() {
        this.startAutoplay();
    }
}

const carousel = new HeroCarousel();

// Pause on hover
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => carousel.pauseAutoplay());
carouselContainer.addEventListener('mouseleave', () => carousel.resumeAutoplay());

// Keyboard navigation
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') carousel.next();
    if (e.key === 'ArrowLeft') {
        carousel.currentSlide = (carousel.currentSlide - 1 + carousel.slides.length) % carousel.slides.length;
        carousel.updateSlides();
    }
});
