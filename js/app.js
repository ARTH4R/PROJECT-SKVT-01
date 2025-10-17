// INDEX IMAGE SLIDE SHOW SECTION CODE
let slideIndex = 0;
let autoSlideInterval = null;

// Initialize slideshow when DOM is ready
function initSlideshow() {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    // Validate that slides exist
    if (slides.length === 0) {
        console.warn("No slides found");
        return;
    }
    
    showSlides(slideIndex);
    startAutoSlide();
}

function changeSlide(n) {
    showSlides(slideIndex += n);
    resetAutoSlide();
}

function setSlide(n) {
    showSlides(slideIndex = n);
    resetAutoSlide();
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    // Validate elements exist
    if (slides.length === 0) return;
    
    // Handle wraparound
    if (n >= slides.length) {
        slideIndex = 0;
    } else if (n < 0) {
        slideIndex = slides.length - 1;
    } else {
        slideIndex = n;
    }

    // Hide all slides and deactivate dots
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    // Show current slide
    slides[slideIndex].classList.add("active");
    
    // Activate corresponding dot if it exists
    if (dots.length > slideIndex) {
        dots[slideIndex].classList.add("active");
    }
}

function startAutoSlide() {
    // Clear any existing interval
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    // Start new interval
    autoSlideInterval = setInterval(() => changeSlide(1), 5000);
}

function resetAutoSlide() {
    startAutoSlide();
}

// Stop auto-slide when page is hidden (tab switching, minimizing)
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    } else {
        startAutoSlide();
    }
});

// Initialize when DOM is loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlideshow);
} else {
    initSlideshow();
}