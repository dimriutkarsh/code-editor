// DOM Elements
const startCodingBtn = document.getElementById('startCodingBtn');
const signUpBtn = document.getElementById('signUpBtn');
const searchInput = document.querySelector('.search-input');
const tabs = document.querySelectorAll('.tab');

// Code samples for different tabs
const codeSamples = {
    html: [
        { line: 1, code: '<span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="string">"container"</span><span class="tag">&gt;</span>' },
        { line: 2, code: '&nbsp;&nbsp;<span class="tag">&lt;h1&gt;</span><span class="text">Hello World!</span><span class="tag">&lt;/h1&gt;</span>' },
        { line: 3, code: '<span class="tag">&lt;/div&gt;</span>' }
    ],
    css: [
        { line: 1, code: '<span class="attr">.container</span> <span class="tag">{</span>' },
        { line: 2, code: '&nbsp;&nbsp;<span class="attr">background</span>: <span class="string">linear-gradient(</span>' },
        { line: 3, code: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">135deg, #667eea 0%, #764ba2 100%</span>' }
    ],
    js: [
        { line: 1, code: '<span class="attr">const</span> <span class="text">colors</span> = [' },
        { line: 2, code: '&nbsp;&nbsp;<span class="string">"#4ade80"</span>, <span class="string">"#3b82f6"</span>, <span class="string">"#8b5cf6"</span>' },
        { line: 3, code: '];' }
    ]
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupEventListeners();
    setupTabSwitching();
    addScrollEffects();
});

// Event Listeners
function setupEventListeners() {
    // Start Coding button - opens the editor (replace with your Flask route)
    startCodingBtn.addEventListener('click', function() {
        // Add loading animation
        this.innerHTML = '<span class="loading-spinner"></span>Opening Editor...';
        this.disabled = true;
        
        // Simulate loading then redirect to your Flask editor
        setTimeout(() => {
            // Replace this URL with your Flask editor route
            window.location.href = '/index';  // or wherever your editor is located
        }, 1000);
    });

    // Sign Up button
    signUpBtn.addEventListener('click', function() {
        // Add some interaction feedback
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
            // Replace with your sign up logic
            showNotification('Sign up feature coming soon!', 'info');
        }, 150);
    });

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        if (query.length > 2) {
            // Simulate search functionality
            showSearchResults(query);
        }
    });

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Tab switching functionality
function setupTabSwitching() {
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update code content based on tab
            const tabName = this.textContent.toLowerCase();
            updateCodeContent(tabName);
        });
    });
}

// Update code content based on selected tab
function updateCodeContent(tabType) {
    const codeContent = document.querySelector('.code-content');
    const sample = codeSamples[tabType] || codeSamples.html;
    
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

// Initialize animations
function initializeAnimations() {
    // Animate elements on page load
    const animatedElements = document.querySelectorAll('.hero-title, .hero-description, .btn-cta, .code-preview');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Typing animation for hero title
    setTimeout(() => {
        typeWriterEffect();
    }, 1000);
}

// Typewriter effect for hero title
function typeWriterEffect() {
    const titleElement = document.querySelector('.hero-title');
    const originalText = 'The best place to build, test, and discover front-end code.';
    const iconElement = titleElement.querySelector('.title-icon');
    
    // Store the icon HTML
    const iconHTML = iconElement ? iconElement.outerHTML : '';
    
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

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => observer.observe(card));
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
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        border: 1px solid var(--accent-primary);
        border-radius: 8px;
        padding: 1rem;
        color: var(--text-primary);
        box-shadow: var(--shadow);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
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
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Manual close
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Simulate search results
function showSearchResults(query) {
    // This is a placeholder - replace with actual search functionality
    console.log(`Searching for: ${query}`);
    
    // You could show a dropdown with search results here
    // For now, just show a notification
    if (query === 'help') {
        showNotification('Try creating a new project!', 'info');
    }
}

// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = scrolled * speed;
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Add some interactive particles on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.05) { // Only create particles occasionally
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: var(--accent-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        opacity: 0.8;
        animation: particle-float 2s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 2000);
}

// Add the particle animation CSS
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes particle-float {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px) scale(0);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

document.head.appendChild(particleStyles);