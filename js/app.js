// ===============================
// IMAGE SLIDESHOW FULL SCRIPT (ENHANCED)
// ===============================

let slideIndex = 0;
let autoSlideInterval = null;
let progressInterval = null;
let slideSpeed = 5000; // default speed (ms)
let isPaused = false;
let progressValue = 0;
const MIN_SPEED = 100; // ความเร็วต่ำสุด (0.1 วิ)

function initSlideshow() {
    showSlides(slideIndex);
    startAutoSlide();
    setupControls();
    setupNavigation();
}

// ===============================
// SHOW SLIDES
// ===============================
function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    if (slides.length === 0) return;

    // Normalize index
    if (n >= slides.length) slideIndex = 0;
    else if (n < 0) slideIndex = slides.length - 1;
    else slideIndex = n;

    // Remove all active classes
    for (let s of slides) s.classList.remove("active");
    for (let d of dots) d.classList.remove("active");

    // Add active class to current slide
    slides[slideIndex].classList.add("active");
    if (dots[slideIndex]) dots[slideIndex].classList.add("active");
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
        
        // Update progress bar every 50ms for smooth animation
        progressInterval = setInterval(() => {
            progressValue += 50;
            updateProgressBar();
        }, 50);
    }
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
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
// ทำให้เป็น global function เพื่อให้ onclick ใน HTML เรียกได้
window.changeSlide = function(direction) {
    slideIndex += direction;
    showSlides(slideIndex);
    // ถ้ากำลัง pause อยู่ ไม่ต้อง restart auto
    if (!isPaused) startAutoSlide();
}

function setupNavigation() {
    const dots = document.getElementsByClassName("dot");

    // Dot navigation
    for (let i = 0; i < dots.length; i++) {
        dots[i].addEventListener("click", () => {
            slideIndex = i;
            showSlides(slideIndex);
            // ถ้ากำลัง pause อยู่ ไม่ต้อง restart auto
            if (!isPaused) startAutoSlide();
        });
    }
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
        progressValue = 0; // Reset progress when resuming
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

    // Speed Up (-0.5s, แต่ไม่ต่ำกว่า MIN_SPEED)
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
            // Reset ทุกอย่างเหมือนเข้า web ใหม่
            slideSpeed = 5000;
            slideIndex = 0;
            isPaused = false;
            progressValue = 0;
            
            // แสดงปุ่ม pause, ซ่อนปุ่ม play
            pauseBtn.style.display = "block";
            playBtn.style.display = "none";
            
            // แสดง slide แรกและเริ่ม auto-slide
            showSlides(slideIndex);
            startAutoSlide();
            updateSpeedDisplay(speedDisplay);
        });
    }

    updateSpeedDisplay(speedDisplay);
}

function updateSpeedDisplay(speedDisplay) {
    if (!speedDisplay) return;
    
    // แสดงทศนิยม 1 ตำแหน่งถ้าความเร็วน้อยกว่า 1 วิ
    const seconds = slideSpeed / 1000;
    speedDisplay.textContent = seconds < 1 ? seconds.toFixed(1) : seconds.toFixed(0);
}

// ===============================
// KEYBOARD NAVIGATION
// ===============================
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        changeSlide(-1);
    } else if (e.key === "ArrowRight") {
        changeSlide(1);
    } else if (e.key === " ") {
        e.preventDefault();
        // Toggle pause/play with spacebar
        const pauseBtn = document.querySelector(".stop-icon");
        const playBtn = document.querySelector(".play-icon");
        if (isPaused) {
            playBtn.click();
        } else {
            pauseBtn.click();
        }
    }
});

// ===============================
// HANDLE TAB VISIBILITY
// ===============================
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        stopAutoSlide();
    } else if (!isPaused) {
        startAutoSlide();
    }
});

// ===============================
// DOM READY
// ===============================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlideshow);
} else {
    initSlideshow();
}