// Configuration
const HASH_NAMES = [
    'school-history',
    'school-emblem',
    'school-colors',
    'school-tree',
    'school-motto',
    'school-identity',
    'school-philosophy'
];

// Cache DOM elements
let sections;
let links;

// Initialize navigation system
function initNavigation() {
    sections = document.querySelectorAll('.space_box');
    links = document.querySelectorAll('.subheading_link');
    
    // Set up event listeners
    window.addEventListener('hashchange', handleHash);
    
    // Handle initial load
    handleHash();
}

// Show specific section by index
function showSection(index) {
    // Validate index
    if (index < 0 || index >= sections.length) {
        console.warn(`Invalid section index: ${index}`);
        return;
    }

    // Hide all sections
    sections.forEach(section => {
        section.classList.add('display-none');
        section.classList.remove('display-block');
    });

    // Show selected section
    sections[index].classList.remove('display-none');
    sections[index].classList.add('display-block');

    // Update active link
    links.forEach(link => link.classList.remove('active_link'));
    if (links[index]) {
        links[index].classList.add('active_link');
    }

    // Update URL hash without triggering hashchange event
    if (HASH_NAMES[index]) {
        history.replaceState(null, '', `#${HASH_NAMES[index]}`);
    }
}

// Handle hash changes
function handleHash() {
    const hash = window.location.hash.replace('#', '');
    
    // Find index of hash
    const index = hash ? HASH_NAMES.indexOf(hash) : 0;
    
    // Show section (default to first if hash not found)
    showSection(index !== -1 ? index : 0);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}