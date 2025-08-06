// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    const welcomeScreen = new WelcomeScreen();
    const codeEditor = new CodeEditor();
    const outputManager = new OutputManager();
    const aiAssistant = new AIAssistant();
    const inputHandler = new InputHandler();
    
    // Create global app instance
    window.CodeStudioApp = {
        welcomeScreen,
        codeEditor,
        outputManager,
        aiAssistant,
        inputHandler,
        currentMode: null,
        currentLanguage: null,
        username: '',
        projectName: ''
    };
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Add enhanced interactions
    setupEnhancedInteractions();
});

// Global keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to run code
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const runBtn = document.getElementById('run-btn');
            if (runBtn && !runBtn.disabled && !runBtn.classList.contains('hidden')) {
                runBtn.click();
            }
        }
        
        // Ctrl/Cmd + S to save (download)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const downloadBtn = document.getElementById('download-btn') || document.getElementById('web-download-btn');
            if (downloadBtn) {
                downloadBtn.click();
            }
        }
        
        // Escape to close modal or input interface
        if (e.key === 'Escape') {
            const modal = document.getElementById('ai-modal');
            if (modal && !modal.classList.contains('hidden')) {
                window.CodeStudioApp.aiAssistant.hideModal();
            } else if (window.CodeStudioApp.inputHandler.isInInputMode()) {
                window.CodeStudioApp.inputHandler.hideInputInterface();
            }
        }
        
        // Ctrl/Cmd + I to toggle input interface (when in programming mode)
        if ((e.ctrlKey || e.metaKey) && e.key === 'i' && window.CodeStudioApp.currentMode === 'programming') {
            e.preventDefault();
            if (window.CodeStudioApp.inputHandler.isInInputMode()) {
                window.CodeStudioApp.inputHandler.hideInputInterface();
            } else {
                window.CodeStudioApp.inputHandler.showInputInterface('Manual input mode activated');
            }
        }
        
        // Enter to submit input when in input mode
        if (e.key === 'Enter' && window.CodeStudioApp.inputHandler.isInInputMode()) {
            const userInput = document.getElementById('user-input');
            if (document.activeElement === userInput) {
                e.preventDefault();
                window.CodeStudioApp.inputHandler.addInput();
            }
        }
        
        // Ctrl/Cmd + Shift + Enter to finish input and run code
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter' && window.CodeStudioApp.inputHandler.isInInputMode()) {
            e.preventDefault();
            window.CodeStudioApp.inputHandler.finishInput();
        }
    });
}

// Enhanced interactions
function setupEnhancedInteractions() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add subtle click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add contextual help system
    setupContextualHelp();
    
    // Add auto-save functionality
    setupAutoSave();
    
    // Add enhanced error handling
    setupErrorHandling();
}

// Contextual help system
function setupContextualHelp() {
    const helpTips = {
        'code-input': 'Press Ctrl+Enter to run your code. Use Ctrl+I to add inputs for interactive programs.',
        'web-code-input': 'Your changes are automatically previewed in real-time.',
        'user-input': 'Press Enter to add input, or Ctrl+Shift+Enter to run with all inputs.',
        'run-btn': 'Run your code. If your program needs input, you\'ll be prompted to provide it.',
    };
    
    Object.entries(helpTips).forEach(([id, tip]) => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tip;
            
            // Add focus hint
            element.addEventListener('focus', () => {
                showTooltip(element, tip);
            });
            
            element.addEventListener('blur', () => {
                hideTooltip();
            });
        }
    });
}

// Tooltip system
let currentTooltip = null;

function showTooltip(element, text) {
    hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'context-tooltip';
    tooltip.textContent = text;
    
    tooltip.style.cssText = `
        position: absolute;
        background: var(--secondary-bg);
        color: var(--text-primary);
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.8rem;
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow);
        z-index: 10000;
        max-width: 200px;
        word-wrap: break-word;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.2s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + 5}px`;
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 50);
    
    currentTooltip = tooltip;
}

function hideTooltip() {
    if (currentTooltip) {
        currentTooltip.style.opacity = '0';
        currentTooltip.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (currentTooltip && currentTooltip.parentNode) {
                currentTooltip.parentNode.removeChild(currentTooltip);
            }
            currentTooltip = null;
        }, 200);
    }
}

// Auto-save functionality
function setupAutoSave() {
    let autoSaveTimer = null;
    
    function autoSave() {
        if (!window.CodeStudioApp.projectName) return;
        
        const data = {
            projectName: window.CodeStudioApp.projectName,
            username: window.CodeStudioApp.username,
            mode: window.CodeStudioApp.currentMode,
            language: window.CodeStudioApp.currentLanguage,
            code: window.CodeStudioApp.currentMode === 'web' ? 
                window.CodeStudioApp.codeEditor.webCodes : 
                window.CodeStudioApp.codeEditor.code,
            timestamp: Date.now()
        };
        
        localStorage.setItem('codestudio_autosave', JSON.stringify(data));
    }
    
    function scheduleAutoSave() {
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(autoSave, 3000); // Auto-save after 3 seconds of inactivity
    }
    
    // Listen for code changes
    document.addEventListener('input', (e) => {
        if (e.target.id === 'code-input' || e.target.id === 'web-code-input') {
            scheduleAutoSave();
        }
    });
    
    // Try to restore auto-saved data on load
    const savedData = localStorage.getItem('codestudio_autosave');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            const timeDiff = Date.now() - data.timestamp;
            
            // Only restore if saved within last hour
            if (timeDiff < 3600000) {
                setTimeout(() => {
                    if (confirm(`Restore previous session for "${data.projectName}"?`)) {
                        restoreSession(data);
                    }
                }, 1000);
            }
        } catch (e) {
            console.warn('Failed to parse auto-save data');
        }
    }
}

function restoreSession(data) {
    // This would need to be implemented based on your specific needs
    console.log('Restoring session:', data);
}

// Enhanced error handling
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        
        if (window.CodeStudioApp && window.CodeStudioApp.outputManager) {
            window.CodeStudioApp.outputManager.addToOutput(
                'Application error occurred. Please refresh the page if issues persist.', 
                'error'
            );
        }
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        
        if (window.CodeStudioApp && window.CodeStudioApp.outputManager) {
            window.CodeStudioApp.outputManager.addToOutput(
                'Network or processing error occurred. Please try again.', 
                'error'
            );
        }
    });
}

// Utility functions
window.CodeStudioUtils = {
    // Format code with basic indentation
    formatCode: (code, language) => {
        // Basic code formatting - could be enhanced with proper parsers
        const lines = code.split('\n');
        let indentLevel = 0;
        const indentChar = '    ';
        
        return lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            
            // Decrease indent for closing brackets/braces
            if (trimmed.match(/^[\}\]\)]/)) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            const formatted = indentChar.repeat(indentLevel) + trimmed;
            
            // Increase indent for opening brackets/braces
            if (trimmed.match(/[\{\[\(]$/)) {
                indentLevel++;
            }
            
            return formatted;
        }).join('\n');
    },
    
    // Detect if code contains common input patterns
    detectInputRequirements: (code, language) => {
        const patterns = {
            python: [/input\s*\(/g, /raw_input\s*\(/g],
            java: [/Scanner\s*\(/g, /System\.in/g, /nextLine\s*\(/g],
            c: [/scanf\s*\(/g, /getchar\s*\(/g],
            cpp: [/cin\s*>>/g, /getline\s*\(/g]
        };
        
        const langPatterns = patterns[language] || [];
        return langPatterns.some(pattern => pattern.test(code));
    },
    
    // Show notification
    showNotification: (message, type = 'info', duration = 3000) => {
        const notification = document.createElement('div');
        notification.className = `app-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-bg);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border-left: 4px solid var(--accent-color);
            box-shadow: var(--shadow);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        
        if (type === 'error') {
            notification.style.borderLeftColor = 'var(--error-color)';
        } else if (type === 'success') {
            notification.style.borderLeftColor = 'var(--success-color)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
};