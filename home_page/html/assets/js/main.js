document.addEventListener('DOMContentLoaded', () => {

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Function to hide the preloader
        const hidePreloader = () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        };
        
        // Hide on window load event
        window.addEventListener('load', hidePreloader);
        
        // Fallback: Hide preloader after a max of 2.5 seconds
        setTimeout(hidePreloader, 2500);
    }

    // Header Scroll Effect
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }

    // AOS Initialization
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            duration: 800,
            easing: 'ease-in-out',
        });
    }

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Typing Effect for Hero Section
    const typedTextSpan = document.getElementById('typed-text');
    if (typedTextSpan) {
        const textArray = ["Creative Designs", "Digital Solutions", "Successful Projects"];
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            } else {
                setTimeout(erase, 1500);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, 50);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, 500);
            }
        }
        
        // Start the typing animation automatically
        type();
    }
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuPopup = document.getElementById('mobile-menu-popup');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuToggle && mobileMenuPopup && mobileMenuClose) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuPopup.style.display = 'flex';
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileMenuPopup.style.display = 'none';
        });
    }
    
// Mega Menu Toggle
const servicesDropdown = document.getElementById('servicesDropdown');
const megaMenu = document.getElementById('mega-menu');

if (servicesDropdown && megaMenu) {
    servicesDropdown.addEventListener('mouseover', () => {
        if (window.innerWidth >= 992) {
            // Add the 'is-visible' class to trigger the smooth transition
            megaMenu.classList.add('is-visible');
        }
    });

    megaMenu.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 992) {
            // Remove the 'is-visible' class to hide the menu
            megaMenu.classList.remove('is-visible');
        }
    });

    // Handle click event on the Services link
    servicesDropdown.addEventListener('click', (e) => {
        // Check if the link is clicked on desktop
        if (window.innerWidth >= 992) {
            // Prevent default behavior to avoid navigation
            e.preventDefault(); 
        }
    });
}

// Your existing Mobile Mega Menu Toggle Icon code...
const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
if (mobileDropdownToggle) {
    mobileDropdownToggle.addEventListener('click', () => {
        const icon = mobileDropdownToggle.querySelector('i');
        if (mobileDropdownToggle.classList.contains('collapsed')) {
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-plus');
        }
    });
}

    // Background Reveal Effect on Scroll
    const revealElements = document.querySelectorAll('.hero-background-reveal, .background-reveal');

    if (revealElements.length > 0) {
        const observerOptions = {
            root: null, // observe against the viewport
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the item is visible
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active'); // Add 'active' class to trigger animation
                    observer.unobserve(entry.target); // Stop observing after activation
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
        // Snowfall Effect - Modified to be a toggle
    const snowfallContainer = document.getElementById('snowfall-container');
    const snowfallToggleBtn = document.getElementById('snowfall-toggle-btn');
    let snowfallInterval = null;

    const createSnowflake = () => {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');

        const startX = Math.random() * window.innerWidth;
        snowflake.style.left = `${startX}px`;

        const size = Math.random() * 5 + 5;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;

        const duration = Math.random() * 8 + 5;
        const delay = Math.random() * 0.5;

        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `${delay}s`;

        snowfallContainer.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove();
        }, (duration + delay) * 1000);
    };

    const toggleSnowfall = () => {
        if (snowfallInterval) {
        clearInterval(snowfallInterval);
        snowfallInterval = null;
        snowfallContainer.innerHTML = '';
        snowfallToggleBtn.innerHTML = '<i class="fas fa-cog"></i>';
        snowfallToggleBtn.classList.remove('active');
        } else {
        const isMobile = window.innerWidth <= 768;
        const interval = isMobile ? 600 : 100; // 300ms for mobile, 100ms for desktop
        snowfallInterval = setInterval(createSnowflake, interval);
        snowfallToggleBtn.innerHTML = '<i class="fas fa-fan"></i>';
        snowfallToggleBtn.classList.add('active');
      }
    };

    if (snowfallToggleBtn) {
        snowfallToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSnowfall();
        });
        toggleSnowfall();
    }

    // Dark Mode Functionality 🌙
    
    // Function to toggle dark mode
    const toggleDarkMode = () => {
        const body = document.body;
        const icon = document.querySelector('#theme-toggle-btn i');
        body.classList.toggle('dark-mode');
    
        // Save the user's preference in localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon'); // Change icon to sun when dark mode is on
            icon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun'); // Change icon to moon when light mode is on
            icon.classList.add('fa-moon');
        }
    };
    
    // Check for user's preferred theme on page load
    const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const body = document.body;
        const icon = document.querySelector('#theme-toggle-btn i');
    
        // Apply the saved theme if it exists
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else if (savedTheme === 'light') {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    };
    
    // Add event listener to the toggle button
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleDarkMode);
    }

    // Load the saved theme first
    loadTheme();
});