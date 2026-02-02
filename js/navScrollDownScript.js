(function() {
    'use strict';
    // ===== Sticky Header Module =====
    const StickyHeader = (() => {
        const els = {
            wrapper: document.getElementById('topHeaderWrapper'),
            placeholder: document.getElementById('topHeaderPlaceholder'),
            navBar: document.querySelector('.nav_bar_container'),
            navDropdown: document.querySelector('.nav-dropdown-container'),
            infoBar: document.querySelector('.detail_bar_container')
        };
        
        // Early exit if required elements don't exist
        if (!els.wrapper || !els.placeholder || !els.navBar || !els.infoBar) {
            return { init: () => {} };
        }
        
        let state = {
            origOffset: 0,
            isStuck: false,
            ticking: false,
            resizeTimeout: null,
            infoBarHeight: 0,
            navBarHeight: 0
        };
        
        // Cache heights to avoid repeated DOM reads
        function cacheHeights() {
            state.infoBarHeight = els.infoBar.offsetHeight;
            state.navBarHeight = els.navBar.offsetHeight;
        }
        
        function updateOrigOffset() {
            if (!state.isStuck) {
                state.origOffset = els.wrapper.offsetTop;
            }
        }
        
        function applySticky() {
            if (state.isStuck) return; // Prevent redundant updates
            
            state.isStuck = true;
            cacheHeights();
            
            els.wrapper.classList.add('stuck');
            els.placeholder.style.cssText = `height: ${state.infoBarHeight + state.navBarHeight}px; display: block;`;
            
            // Use transform for better performance than top positioning
            els.infoBar.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; z-index: 1000; will-change: transform;';
            els.navBar.style.cssText = `position: fixed; top: ${state.infoBarHeight}px; left: 0; right: 0; z-index: 999; will-change: transform;`;
            
            if (els.navDropdown) {
                els.navDropdown.style.cssText = `position: fixed; top: ${state.infoBarHeight + state.navBarHeight}px; left: 0; right: 0; z-index: 998;`;
            }
        }
        
        function removeSticky() {
            if (!state.isStuck) return; // Prevent redundant updates
            
            state.isStuck = false;
            
            els.wrapper.classList.remove('stuck');
            els.placeholder.style.cssText = 'height: 0; display: none;';
            els.infoBar.style.cssText = '';
            els.navBar.style.cssText = '';
            
            if (els.navDropdown) {
                els.navDropdown.style.cssText = '';
            }
        }
        
        function updateSticky() {
            const shouldStick = window.pageYOffset > state.origOffset;
            
            if (shouldStick && !state.isStuck) {
                applySticky();
            } else if (!shouldStick && state.isStuck) {
                removeSticky();
            }
        }
        
        function onScroll() {
            if (state.ticking) return;
            
            state.ticking = true;
            requestAnimationFrame(() => {
                updateSticky();
                state.ticking = false;
            });
        }
        
        function onResize() {
            clearTimeout(state.resizeTimeout);
            state.resizeTimeout = setTimeout(() => {
                updateOrigOffset();
                cacheHeights();
                updateSticky();
            }, 150); // Slightly longer debounce for stability
        }
        
        function init() {
            cacheHeights();
            updateOrigOffset();
            updateSticky();
            
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onResize, { passive: true });
        }
        
        return { init };
    })();
    
    // ===== Dropdown Menu Module =====
    const DropdownMenu = (() => {
        const dropdown = document.querySelector('.nav-dropdown-container');
        const aboutLink = document.querySelector('.nav-b-text[href="./aboutSchool.html"]');
        
        if (!dropdown || !aboutLink) {
            return { init: () => {} };
        }
        
        const navButton = aboutLink.closest('.nav_button');
        if (!navButton) return { init: () => {} };
        
        let hideTimeout = null;
        const HIDE_DELAY = 100; // Increased for better UX
        
        function show() {
            clearTimeout(hideTimeout);
            dropdown.classList.add('show');
            dropdown.setAttribute('aria-hidden', 'false');
        }
        
        function scheduleHide() {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                if (!dropdown.matches(':hover') && !navButton.matches(':hover')) {
                    hide();
                }
            }, HIDE_DELAY);
        }
        
        function hide() {
            clearTimeout(hideTimeout);
            dropdown.classList.remove('show');
            dropdown.setAttribute('aria-hidden', 'true');
        }
        
        function handleFocusOut(e) {
            // Check if focus moved outside both button and dropdown
            setTimeout(() => {
                if (!navButton.contains(document.activeElement) && 
                    !dropdown.contains(document.activeElement)) {
                    hide();
                }
            }, 50);
        }
        
        function init() {
            // Mouse interactions
            navButton.addEventListener('mouseenter', show);
            navButton.addEventListener('mouseleave', scheduleHide);
            dropdown.addEventListener('mouseenter', show);
            dropdown.addEventListener('mouseleave', hide);
            
            // Keyboard accessibility
            aboutLink.addEventListener('focus', show);
            navButton.addEventListener('focusout', handleFocusOut);
            dropdown.addEventListener('focusout', handleFocusOut);
            
            // Touch support for mobile
            if ('ontouchstart' in window) {
                navButton.addEventListener('touchstart', (e) => {
                    if (dropdown.classList.contains('show')) {
                        hide();
                    } else {
                        show();
                        e.preventDefault();
                    }
                }, { passive: false });
            }
        }
        
        return { init };
    })();
    
    // Initialize both modules when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            StickyHeader.init();
            DropdownMenu.init();
        });
    } else {
        StickyHeader.init();
        DropdownMenu.init();
    }
})();