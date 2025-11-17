// script.js - JavaScript untuk semua halaman SehatKu

// Fungsi inisialisasi ketika DOM siap
document.addEventListener('DOMContentLoaded', function() {
    // Highlight nav link aktif
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Jika di halaman beranda, highlight Beranda
    if (currentPage === 'index.html' || currentPage === '') {
        const homeLink = document.querySelector('.nav-link[href="index.html"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
    
    // Smooth scroll untuk link anchor
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Inisialisasi fungsi pencarian
    initializeSearch();
    
    // Inisialisasi form validation
    initializeFormValidation();
    
    // Inisialisasi back to top button
    initializeBackToTop();
    
    // Inisialisasi fade in animation
    initializeFadeIn();
});

// Navbar scroll effect
function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Fade in animation on scroll
function initializeFadeIn() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', fadeInOnScroll);
    // Initial check
    fadeInOnScroll();
}

// Back to top button
function initializeBackToTop() {
    // Cek apakah button sudah ada
    if (document.querySelector('.back-to-top')) return;
    
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="bi bi-chevron-up"></i>';
    backToTopButton.className = 'btn btn-primary back-to-top';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.zIndex = '1000';
    backToTopButton.style.display = 'none';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.width = '50px';
    backToTopButton.style.height = '50px';
    backToTopButton.style.display = 'flex';
    backToTopButton.style.alignItems = 'center';
    backToTopButton.style.justifyContent = 'center';

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    document.body.appendChild(backToTopButton);
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-3';
                errorDiv.textContent = 'Harap isi semua field yang wajib diisi.';
                form.appendChild(errorDiv);
                
                setTimeout(() => {
                    errorDiv.remove();
                }, 5000);
            }
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="Cari"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = document.querySelectorAll('.searchable-item');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ===== FUNGSI KHUSUS HALAMAN EDUKASI =====

// Category filtering untuk halaman edukasi
function showCategory(category) {
    const cards = document.querySelectorAll(".education-card");
    const tabs = document.querySelectorAll(".tab-btn");

    tabs.forEach((tab) => tab.classList.remove("active"));
    event.target.classList.add("active");

    cards.forEach((card) => {
        const cardElement = card.closest("[data-category]");
        if (
            category === "all" ||
            cardElement.getAttribute("data-category") === category
        ) {
            cardElement.style.display = "block";
        } else {
            cardElement.style.display = "none";
        }
    });
}

// Search functionality khusus halaman edukasi
function initializeEdukasiSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.education-card');
            
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const topics = Array.from(card.querySelectorAll('.topic-list li')).map(li => li.textContent.toLowerCase());
                
                const matches = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               topics.some(topic => topic.includes(searchTerm));
                
                const cardElement = card.closest("[data-category]");
                if (matches || searchTerm === '') {
                    cardElement.style.display = 'block';
                } else {
                    cardElement.style.display = 'none';
                }
            });
        });
    }
}

// Module opening untuk halaman edukasi
function openModule(moduleName) {
    const moduleTitles = {
        gizi: "Panduan Gizi Seimbang",
        olahraga: "Program Olahraga Pemula",
        stres: "Manajemen Stres",
        pencegahan: "Pencegahan Penyakit",
        diet: "Diet Sehat untuk Berat Badan Ideal",
        yoga: "Yoga untuk Pemula",
        "nutrisi-anak": "Nutrisi Optimal untuk Anak",
        lansia: "Kesehatan di Usia Lanjut",
        wanita: "Kesehatan Reproduksi Wanita",
        pertolongan: "Pertolongan Pertama Dasar",
        tidur: "Pola Tidur Sehat",
        hidrasi: "Hidrasi yang Tepat"
    };
    
    alert(
        "Membuka modul: " +
          moduleTitles[moduleName] +
          "\n\nKonten pembelajaran interaktif akan segera tersedia!"
    );
}

function playVideo(videoTitle) {
    alert(
        "Memutar video: " +
          videoTitle +
          "\n\nFitur pemutaran video akan segera tersedia!"
    );
}

// Inisialisasi khusus untuk halaman edukasi
document.addEventListener('DOMContentLoaded', function() {
    // Jika di halaman edukasi, inisialisasi fungsi khusus
    if (window.location.pathname.includes('edukasi.html') || document.querySelector('.education-grid')) {
        initializeEdukasiSearch();
        initializeNavbarScroll();
    }
});

// Panggil inisialisasi navbar scroll secara global
initializeNavbarScroll();