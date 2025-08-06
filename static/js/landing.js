// Enhanced Landing Page Script
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeAnimations();
    setupEventListeners();
    setupTabSwitching();
    addScrollEffects();
    initializeTypewriter();
});

// Particles Canvas Animation
function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(35, 134, 54, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    function createParticles() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connect nearby particles
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.hypot(
                    particle.x - otherParticle.x,
                    particle.y - otherParticle.y
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(35, 134, 54, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
}

// Code samples for different tabs
const codeSamples = {
    python: [
        { line: 1, code: '<span class="comment"># Interactive Python Code</span>' },
        { line: 2, code: '<span class="variable">name</span> = <span class="function">input</span>(<span class="string">"Enter your name: "</span>)' },
        { line: 3, code: '<span class="function">print</span>(<span class="string">f"Hello, {name}!"</span>)' }
    ],
    javascript: [
        { line: 1, code: '<span class="comment">// JavaScript Interactive</span>' },
        { line: 2, code: '<span class="keyword">const</span> <span class="variable">name</span> = <span class="function">prompt</span>(<span class="string">"Enter name:"</span>);' },
        { line: 3, code: '<span class="function">console.log</span>(<span class="string">`Hello, ${name}!`</span>);' }
    ],
    html: [
        { line: 1, code: '<span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="string">"container"</span><span class="tag">&gt;</span>' },
        { line: 2, code: '&nbsp;&nbsp;<span class="tag">&lt;h1&gt;</span><span class="text">Hello World!</span><span class="tag">&lt;/h1&gt;</span>' },
        { line: 3, code: '<span class="tag">&lt;/div&gt;</span>' }
    ]
};

// Initialize animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.hero-title, .hero-description, .hero-features, .btn-cta, .code-preview');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            element.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Event listeners
function setupEventListeners() {
    const startCodingBtn = document.getElementById('startCodingBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const signUpBtn2 = document.getElementById('signUpBtn2');
    const searchInput = document.querySelector('.search-input');

    // Start Coding button
    if (startCodingBtn) {
        startCodingBtn.addEventListener('click', function() {
            // Add loading animation
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Editor...';
            this.disabled = true;
            
            // Create particles burst effect
            createClickEffect(event);
            
            setTimeout(() => {
                window.location.href = '/index';
            }, 1500);
        });
    }

    // Sign up buttons
    [signUpBtn, signUpBtn2].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                createClickEffect(e);
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                    showNotification('🚀 Sign up feature coming soon! Start coding now!', 'info');
                }, 150);
            });
        }
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                showSearchResults(query);
            }
        });
    }

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Stat counters animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    statNumbers.forEach(stat => observer.observe(stat));
}

// Tab switching functionality
function setupTabSwitching() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update code content based on tab
            const tabName = this.dataset.lang;
            updateCodeContent(tabName);
        });
    });
}

// Update code content based on selected tab
function updateCodeContent(tabType) {
    const codeContent = document.getElementById('codeContent');
    const sample = codeSamples[tabType] || codeSamples.python;
    
    // Animate out
    codeContent.style.opacity = '0';
    codeContent.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        codeContent.innerHTML = sample.map(line => `
            <div class="code-line">
                <span class="line-number">${line.line}</span>
                <span class="code-text">${line.code}</span>
            </div>
        `).join('');
        
        // Animate in
        codeContent.style.opacity = '1';
        codeContent.style.transform = 'translateY(0)';
    }, 200);
}

// Typewriter effect for hero title
function initializeTypewriter() {
    const titleElement = document.querySelector('.hero-title');
    if (!titleElement) return;
    
    const originalText = 'The best place to build, test, and discover code with AI.';
    const iconElement = titleElement.querySelector('.title-icon');
    
    // Store the icon HTML
    const iconHTML = iconElement ? iconElement.outerHTML : '';
    
    setTimeout(() => {
        titleElement.innerHTML = iconHTML;
        let i = 0;
        
        function typeChar() {
            if (i < originalText.length) {
                const currentText = titleElement.innerHTML;
                const textWithoutIcon = currentText.replace(iconHTML, '');
                titleElement.innerHTML = iconHTML + textWithoutIcon + originalText.charAt(i);
                i++;
                setTimeout(typeChar, 50);
            }
        }
        
        typeChar();
    }, 1000);
}

// Scroll effects
function addScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe feature cards and stats
    const elements = document.querySelectorAll('.feature-card, .stat-item');
    elements.forEach(el => observer.observe(el));

    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = scrolled * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Header background effect
        const header = document.querySelector('.header');
        if (scrolled > 50) {
            header.style.background = 'rgba(13, 17, 23, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'rgba(22, 27, 34, 0.95)';
        }
    });
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = element.textContent.replace(/[\d,]/g, target.toLocaleString());
            clearInterval(timer);
        } else {
            const suffix = element.textContent.replace(/[\d,]/g, '');
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }
    }, 16);
}

// Click effect
function createClickEffect(event) {
    const ripple = document.createElement('div');
    const rect = event.target.getBoundingClientRect();
    const size = 60;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(35, 134, 54, 0.6) 0%, transparent 70%);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    event.target.style.position = 'relative';
    event.target.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--accent-primary);
        border-left: 4px solid var(--accent-primary);
        border-radius: 12px;
        padding: 1rem 1.5rem;
        color: var(--text-primary);
        box-shadow: var(--shadow-hover);
        z-index: 10000;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 4000);
    
    // Manual close
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    });
}

// Search results simulation
function showSearchResults(query) {
    const suggestions = {
        'python': 'Try our Python editor with input handling!',
        'java': 'Java development made easy!',
        'html': 'Build amazing websites with our web editor!',
        'help': 'Click "Start Coding" to begin your journey!',
        'input': 'Our editor supports interactive input handling!',
        'ai': 'Get AI-powered code suggestions!'
    };
    
    for (const [key, message] of Object.entries(suggestions)) {
        if (query.includes(key)) {
            showNotification(`💡 ${message}`, 'info');
            break;
        }
    }
}

// Mouse trail effect
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.1) {
        createMouseTrail(e.clientX, e.clientY);
    }
});

function createMouseTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: var(--accent-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
        animation: trailFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
        }
    }, 1000);
}

// Add CSS animations
const styles = document.createElement('style');
styles.textContent = `
    @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
    }
    
    @keyframes trailFade {
        0% { transform: scale(1); opacity: 0.6; }
        100% { transform: scale(0); opacity: 0; }
    }
    
    .animate-in {
        animation: slideInUp 1s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: var(--transition);
    }
    
    .notification-close:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }
`;

document.head.appendChild(styles);