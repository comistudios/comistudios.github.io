// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    initCustomCursor();
    initMagneticElements();
    initAnimations();
    initMarquee();
    initMobileMenu();
});

/* =========================================
   CUSTOM CURSOR LOGIC
   ========================================= */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    // Check if device has touch screen (disable custom cursor if so)
    if (window.matchMedia("(pointer: coarse)").matches) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation loop for smooth cursor following
    function render() {
        // Small cursor instantly follows
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;

        // Large cursor lags slightly behind for smooth effect
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        gsap.set(cursor, { x: cursorX, y: cursorY });
        gsap.set(follower, { x: followerX, y: followerY });

        requestAnimationFrame(render);
    }
    render();

    // Add hover states for interactive elements
    const interactives = document.querySelectorAll('a, button, .magnetic, .project-card, .service-item');

    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            follower.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            follower.classList.remove('hovering');
        });
    });
}

/* =========================================
   MAGNETIC ELEMENTS
   ========================================= */
function initMagneticElements() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const magnets = document.querySelectorAll('.magnetic');

    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', function (e) {
            const position = magnet.getBoundingClientRect();

            // Calculate distance from center
            const centerX = position.left + position.width / 2;
            const centerY = position.top + position.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            gsap.to(magnet, {
                x: deltaX * 0.3,
                y: deltaY * 0.3,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        magnet.addEventListener('mouseleave', function () {
            gsap.to(magnet, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            });
        });
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
        document.body.style.overflowX = 'hidden';
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden';
        });
    });
}

/* =========================================
   GSAP ANIMATIONS
   ========================================= */
function initAnimations() {
    // 1. Hero Text Reveal Animation
    const heroTexts = document.querySelectorAll('.hero .reveal-text');

    gsap.fromTo(heroTexts,
        { y: 50, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out",
            delay: 0.2
        }
    );

    // Glow sphere subtle movement
    gsap.to('.glow-sphere', {
        y: '20%',
        x: '-10%',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to('.sphere-2', {
        y: '-15%',
        x: '20%',
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 2. Sections Text Reveal on Scroll
    const revealTexts = document.querySelectorAll('section:not(.hero) .reveal-text');

    revealTexts.forEach(text => {
        gsap.fromTo(text,
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }
        );
    });

    // 3. Portfolio Grid Image Reveal & Parallax
    const projects = document.querySelectorAll('.project-card');

    projects.forEach((project, i) => {
        // Fade Up
        gsap.fromTo(project,
            { y: 100, opacity: 0, scale: 0.95 },
            {
                scrollTrigger: {
                    trigger: project,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out"
            }
        );

        // Simple Parallax effect inside image
        const img = project.querySelector('.project-image');
        gsap.to(img, {
            scrollTrigger: {
                trigger: project,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: "15%",
            ease: "none"
        });
    });

    // 4. Services List Stagger Animation
    const services = document.querySelectorAll('.service-item');

    gsap.fromTo(services,
        { x: -50, opacity: 0 },
        {
            scrollTrigger: {
                trigger: ".services-list",
                start: "top 80%",
            },
            x: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out"
        }
    );
}

/* =========================================
   MARQUEE INFINITE SCROLL
   ========================================= */
function initMarquee() {
    const marquee = document.getElementById('marquee');

    // Clone contents to make it infinite
    const clone = marquee.innerHTML;
    marquee.innerHTML += clone;

    let x = 0;
    function animateMarquee() {
        x -= 1; // Speed

        // Reset when half of the wide content is scrolled
        if (x <= -(marquee.scrollWidth / 2)) {
            x = 0;
        }

        marquee.style.transform = `translate3d(${x}px, 0, 0)`;
        requestAnimationFrame(animateMarquee);
    }

    animateMarquee();
}
