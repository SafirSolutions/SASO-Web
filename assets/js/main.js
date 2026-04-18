// Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Update GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);


document.addEventListener("DOMContentLoaded", (event) => {
    
    // --- 1. HERO ANIMATIONS ---
    const heroTl = gsap.timeline();
    
    // Slight zoom on background image
    heroTl.to(".hero-img-wrapper img", {
        scale: 1,
        duration: 3,
        ease: "power2.out"
    }, 0);

    // Text glitch setup
    const glitchText = document.querySelector('.glitch');
    if(glitchText) {
        setInterval(() => {
            if(Math.random() > 0.8) {
                glitchText.style.transform = `translate(${Math.random()*4 - 2}px, ${Math.random()*4 - 2}px)`;
                glitchText.style.textShadow = `
                    ${Math.random()*5}px ${Math.random()*5}px 0px var(--red), 
                    -${Math.random()*5}px -${Math.random()*5}px 0px var(--neon-green)
                `;
                setTimeout(() => {
                    glitchText.style.transform = 'translate(0, 0)';
                    glitchText.style.textShadow = '2px 2px 0px var(--red), -2px -2px 0px var(--neon-green)';
                }, 50);
            }
        }, 1200);
    }


    // --- 2. MANIFESTO ANIMATIONS (STAGGERED PARALLAX) ---
    const manifestoLines = document.querySelectorAll('.manifesto-text .line');
    manifestoLines.forEach((line, index) => {
        gsap.fromTo(line, 
            { opacity: 0, y: 30 + (index * 20) }, // Staggered y starting pos
            {
                scrollTrigger: {
                    trigger: ".manifesto-section",
                    start: "top 80%",
                    end: "bottom top",
                    scrub: 1
                },
                opacity: 1,
                y: - (index * 25), // Faster scrolling for deeper lines
                ease: "none"
            }
        );
    });


    // --- 2.5. WHAT WE DO SECTION ---
    gsap.from(".wwd-header, .wwd-core", {
        scrollTrigger: {
            trigger: "#what-we-do",
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });

    gsap.to(".wwd-block", {
        scrollTrigger: {
            trigger: ".wwd-grid",
            start: "top 85%",
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });



    // --- 3. SYSTEM SECTION — Node & Legend click routing ---
    document.querySelectorAll('.node[data-href], .legend-item[data-href]').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
            const href = el.dataset.href;
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target, { offset: -80, duration: 1.2 });
                }
            } else {
                // Redirect to sub-page
                window.location.href = href;
            }
        });
    });

    // --- 3. SYSTEM SECTION PARALLAX ---
    gsap.to(".system-visual", {
        scrollTrigger: {
            trigger: ".system-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        },
        y: -50,
        ease: "none"
    });


    // --- 4. PROCESS HORIZONTAL SCROLL ---
    const horizontalContainer = document.querySelector(".horizontal-track");
    
    gsap.to(horizontalContainer, {
        x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: ".process-section",
            pin: true,
            pinSpacing: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + document.querySelector(".process-bg").offsetWidth
        }
    });

    // Process BG Parallax (Slower than track — targets div, not removed img)
    gsap.to(".process-bg", {
        x: () => -(window.innerWidth / 2),
        ease: "none",
        scrollTrigger: {
            trigger: ".process-section",
            scrub: 1,
            start: "top top",
            end: () => "+=" + horizontalContainer.scrollWidth
        }
    });


    // --- 5. RESULTS COUNTERS (Visual Impact) ---
    const resultItems = document.querySelectorAll('.result-item');
    gsap.from(resultItems, {
        scrollTrigger: {
            trigger: ".results-section",
            start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });


    // --- 6. CHAOS SECTION ---
    const chaosTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".chaos-section",
            start: "top 50%",
            end: "bottom top",
            toggleActions: "play none none reverse"
        }
    });

    chaosTl.to(".chaos-img", { opacity: 1, duration: 0.5 })
           .to(".chaos-flash", { opacity: 0.4, duration: 0.2 })
           .to(".chaos-flash", { opacity: 0, duration: 0.2 })
           .to(".chaos-img", { scale: 1.05, duration: 0.4 })
           .to(".chaos-flash", { opacity: 0.3, duration: 0.2 })
           .to(".chaos-flash", { opacity: 0, duration: 0.2 })
           .to(".chaos-img", { filter: "invert(0.2)", duration: 0.3 })
           .to(".chaos-img", { filter: "none", duration: 0.3 });


    // --- 6. PERCEPTION DOMINANCE (POWER SYSTEM) ---
    const powerSvg = document.querySelector('#power-system-svg');
    const powerLines = document.querySelector('.power-lines');
    const powerNodes = document.querySelector('.power-nodes');
    const powerCore = document.querySelector('.power-core');
    
    if (powerSvg) {
        const nodeCount = 12;
        const centerX = 500;
        const centerY = 500;
        
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const distance = 200 + Math.random() * 200;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Create Line
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", centerX);
            line.setAttribute("y1", centerY);
            line.setAttribute("x2", x);
            line.setAttribute("y2", y);
            line.classList.add("power-line");
            powerLines.appendChild(line);
            
            // Create Node
            const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            node.setAttribute("cx", x);
            node.setAttribute("cy", y);
            node.setAttribute("r", 4 + Math.random() * 4);
            node.classList.add("power-node");
            powerNodes.appendChild(node);
        }

        const powerTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#perception-dominance",
                start: "top 40%",
                toggleActions: "play none none reverse"
            }
        });

        powerTl.from(powerCore, { scale: 0, opacity: 0, duration: 1.2, ease: "power4.out" })
               .from(".power-line", { attr: { x2: centerX, y2: centerY }, opacity: 0, duration: 1.5, stagger: 0.1, ease: "power2.out" }, "-=0.6")
               .from(".power-node", { scale: 0, opacity: 0, duration: 0.8, stagger: 0.05, ease: "back.out(1.7)" }, "-=1");

        // Continuous Ambient Breathing
        gsap.to("#power-system-svg", {
            scale: 1.05,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // --- 7. EDITORIAL SECTION PARALLAX ---
    gsap.to(".item-1", {
        scrollTrigger: { trigger: ".editorial-section", scrub: true },
        y: -100, ease: "none"
    });
    
    gsap.to(".item-2", {
        scrollTrigger: { trigger: ".editorial-section", scrub: true },
        y: 100, ease: "none"
    });
    
    gsap.to(".editorial-bg-words", {
        scrollTrigger: { trigger: ".editorial-section", scrub: true },
        scale: 1.1, ease: "none"
    });

    // --- 9. NAVBAR SCROLL ---
    ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: {className: "scrolled", targets: ".saso-nav"}
    });


    // --- 8 & 9. APPLICATION FORM LOGIC ---
    const applyBtn = document.getElementById('start-app-btn');
    const closeBtn = document.getElementById('close-app-btn');
    const appContainer = document.getElementById('application-flow');
    const steps = document.querySelectorAll('.form-step');
    const progressFill = document.querySelector('.progress-fill');
    const totalSteps = steps.length;
    let currentStepIndex = 0;

    applyBtn.addEventListener('click', () => {
        appContainer.classList.remove('hidden');
        lenis.stop(); // Stop scroll when modal open
    });

    const closeApp = () => {
        appContainer.classList.add('hidden');
        lenis.start();
        // optionally reset form
    };

    closeBtn.addEventListener('click', closeApp);
    document.getElementById('finish-btn').addEventListener('click', closeApp);

    // Step logic
    const updateProgress = () => {
        const percent = ((currentStepIndex + 1) / totalSteps) * 100;
        progressFill.style.width = `${percent}%`;
    };

    const goToNextStep = () => {
        if(currentStepIndex < totalSteps - 1) {
            steps[currentStepIndex].classList.remove('active');
            currentStepIndex++;
            steps[currentStepIndex].classList.add('active');
            updateProgress();
        }
    };

    // Attach logic to option buttons (single click advances for pure choice questions)
    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find parent step array index
            const parentStep = e.target.closest('.form-step');
            const stepIndex = Array.from(steps).indexOf(parentStep);
            
            // Mark selected visually
            parentStep.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');

            // Timeout for visual feedback before transition
            setTimeout(() => goToNextStep(), 300);
        });
    });

    // Attach logic to text areas
    document.querySelectorAll('input, textarea').forEach(field => {
        const parentStep = field.closest('.form-step');
        const nextBtn = parentStep.querySelector('.next-btn');
        if(!nextBtn) return;

        field.addEventListener('input', () => {
            const inputs = parentStep.querySelectorAll('input[required]');
            const textarea = parentStep.querySelector('textarea');
            
            let isValid = true;

            if (inputs.length > 0) {
                // Step 6 / Input validation logic
                inputs.forEach(inp => {
                    const val = inp.value.trim();
                    if (val === "") isValid = false;
                    if (inp.type === 'email' && (!val.includes('@') || !val.includes('.'))) isValid = false;
                });
            } else if (textarea) {
                // Existing behavior for steps with textarea
                if (textarea.value.trim().length <= 5) isValid = false;
            }

            if (isValid) nextBtn.removeAttribute('disabled');
            else nextBtn.setAttribute('disabled', 'true');
        });

        if(!nextBtn.dataset.navListener) {
            nextBtn.addEventListener('click', () => goToNextStep());
            nextBtn.dataset.navListener = 'true';
        }
    });

    // Init progress
    updateProgress();

    // --- 10. ALWAYS-ACTIVE TERMINAL LOGIC & PARALLAX ---
    
    // Scramble Text Effect (v3.0)
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="d-flicker">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Initialize scramble on all dashboard titles and key messages
    document.querySelectorAll('[data-scramble]').forEach(line => {
        const scrambler = new TextScramble(line);
        const originalText = line.innerText;
        line.innerText = '';
        scrambler.setText(originalText);
    });

    // Mouse Parallax for Immersive BG
    const immersiveBg = document.querySelector('.fused-immersive-bg');
    if (immersiveBg) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            gsap.to(immersiveBg, {
                x: x, y: y,
                duration: 2.5,
                ease: "power2.out"
            });
        });
    }

    // Real-time counter logic
    const runtimeDisplay = document.querySelector('.runtime-counter');
    if (runtimeDisplay) {
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            runtimeDisplay.innerText = `SESSION_TIME: ${h}:${m}:${s}`;
        }, 1000);
    }
});
