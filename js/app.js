// ===============================
// IMAGE SLIDESHOW FULL SCRIPT
// ===============================

let slideIndex = 0;
let autoSlideInterval = null;
let progressInterval = null;
let slideSpeed = 5000; // default speed (ms)
let isPaused = false;
let progressValue = 0;
const MIN_SPEED = 100; // ความเร็วต่ำสุด (0.1 วิ)

// ===============================
// INIT SLIDESHOW
// ===============================
function initSlideshow() {
    generateDots(); // สร้าง dots อัตโนมัติ
    showSlides(slideIndex);
    startAutoSlide();
    setupControls();
    setupNavigation();
}

// ===============================
// SHOW SLIDES WITH FADE
// ===============================
function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    if (slides.length === 0) return;

    // normalize index
    if (n >= slides.length) slideIndex = 0;
    else if (n < 0) slideIndex = slides.length - 1;
    else slideIndex = n;

    // update slides
    for (let s of slides) s.classList.remove("active");
    slides[slideIndex].classList.add("active");

    // update dots
    for (let d of dots) d.classList.remove("active");
    if (dots[slideIndex]) dots[slideIndex].classList.add("active");
}

// ===============================
// DOT NAVIGATION
// ===============================
function setSlide(n) {
    slideIndex = n;
    showSlides(slideIndex);
    if (!isPaused) startAutoSlide();
}

// สร้าง dots อัตโนมัติจากจำนวน slide
function generateDots() {
    const slides = document.getElementsByClassName("slide");
    const dotsContainer = document.querySelector(".dots-container");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement("span");
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => setSlide(i));
        dotsContainer.appendChild(dot);
    }
}

// ===============================
// AUTO SLIDE CONTROL
// ===============================
function startAutoSlide() {
    stopAutoSlide();
    if (!isPaused) {
        progressValue = 0;
        updateProgressBar();
        
        autoSlideInterval = setInterval(() => {
            slideIndex++;
            showSlides(slideIndex);
            progressValue = 0;
        }, slideSpeed);
        
        // Update progress bar smoothly
        progressInterval = setInterval(() => {
            progressValue += 50;
            updateProgressBar();
        }, 50);
    }
}

function stopAutoSlide() {
    if (autoSlideInterval) { clearInterval(autoSlideInterval); autoSlideInterval = null; }
    if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
}

function updateProgressBar() {
    const progressBar = document.getElementById("progressBar");
    if (!progressBar) return;
    const percentage = Math.min((progressValue / slideSpeed) * 100, 100);
    progressBar.style.width = percentage + "%";
}

// ===============================
// NAVIGATION (PREV/NEXT)
// ===============================
window.changeSlide = function(direction) {
    slideIndex += direction;
    showSlides(slideIndex);
    if (!isPaused) startAutoSlide();
}

// ===============================
// CONTROL BUTTONS
// ===============================
function setupControls() {
    const pauseBtn = document.querySelector(".stop-icon");
    const playBtn = document.querySelector(".play-icon");
    const slowdownBtn = document.querySelector(".slowdown-icon");
    const speedupBtn = document.querySelector(".speedup-icon");
    const resetBtn = document.querySelector(".reset-icon");
    const speedDisplay = document.getElementById("speedValue");

    if (!pauseBtn || !playBtn) return;

    // Pause
    pauseBtn.addEventListener("click", () => {
        stopAutoSlide();
        isPaused = true;
        pauseBtn.style.display = "none";
        playBtn.style.display = "block";
    });

    // Play
    playBtn.addEventListener("click", () => {
        isPaused = false;
        progressValue = 0;
        startAutoSlide();
        playBtn.style.display = "none";
        pauseBtn.style.display = "block";
    });

    // Slow Down (+1s)
    if (slowdownBtn) {
        slowdownBtn.addEventListener("click", () => {
            slideSpeed += 1000;
            if (!isPaused) startAutoSlide();
            updateSpeedDisplay(speedDisplay);
        });
    }

    // Speed Up (-0.5s)
    if (speedupBtn) {
        speedupBtn.addEventListener("click", () => {
            slideSpeed = Math.max(MIN_SPEED, slideSpeed - 500);
            if (!isPaused) startAutoSlide();
            updateSpeedDisplay(speedDisplay);
        });
    }

    // Reset
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            slideSpeed = 5000;
            slideIndex = 0;
            isPaused = false;
            progressValue = 0;
            pauseBtn.style.display = "block";
            playBtn.style.display = "none";
            showSlides(slideIndex);
            startAutoSlide();
            updateSpeedDisplay(speedDisplay);
        });
    }

    updateSpeedDisplay(speedDisplay);
}

function updateSpeedDisplay(speedDisplay) {
    if (!speedDisplay) return;
    const seconds = slideSpeed / 1000;
    speedDisplay.textContent = seconds < 1 ? seconds.toFixed(1) : seconds.toFixed(0);
}

// ===============================
// KEYBOARD NAVIGATION
// ===============================
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") changeSlide(-1);
    else if (e.key === "ArrowRight") changeSlide(1);
    else if (e.key === " ") {
        e.preventDefault();
        const pauseBtn = document.querySelector(".stop-icon");
        const playBtn = document.querySelector(".play-icon");
        if (isPaused) playBtn.click();
        else pauseBtn.click();
    }
});

// ===============================
// HANDLE TAB VISIBILITY
// ===============================
document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoSlide();
    else if (!isPaused) startAutoSlide();
});

// ===============================
// INIT
// ===============================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlideshow);
} else { initSlideshow(); }

// ===== IMG SLIDE CONTROL TOGGLE =====
const settingIcon = document.querySelector('.setting-icon');
const imgSlideControlUI = document.querySelector('.img_slide_control_ui');

settingIcon.addEventListener('click', () => {
    imgSlideControlUI.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!imgSlideControlUI.contains(e.target) && !settingIcon.contains(e.target)) {
        imgSlideControlUI.classList.remove('show');
    }
});
