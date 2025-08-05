// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    const welcomeScreen = new WelcomeScreen();
    const codeEditor = new CodeEditor();
    const outputManager = new OutputManager();
    const aiAssistant = new AIAssistant();
    
    // Create global app instance
    window.CodeStudioApp = {
        welcomeScreen,
        codeEditor,
        outputManager,
        aiAssistant,
        currentMode: null,
        currentLanguage: null,
        username: '',
        projectName: ''
    };
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
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
        
        // Escape to close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('ai-modal');
            if (modal && !modal.classList.contains('hidden')) {
                window.CodeStudioApp.aiAssistant.hideModal();
            }
        }
    });
}