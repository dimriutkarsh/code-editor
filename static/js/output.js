class OutputManager {
    constructor() {
        this.isVisible = true;
    }

    addToOutput(message, type = 'output') {
        if (window.CodeStudioApp.currentMode === 'web') return;
        
        const outputDisplay = document.getElementById('output-display');
        const div = document.createElement('div');
        div.className = `terminal-${type}`;
        div.textContent = message;
        outputDisplay.appendChild(div);
        outputDisplay.scrollTop = outputDisplay.scrollHeight;
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    clear() {
        const outputDisplay = document.getElementById('output-display');
        if (window.CodeStudioApp.currentMode === 'web') {
            outputDisplay.innerHTML = '<div style="padding: 1rem; color: #666;">Live preview ready...</div>';
        } else {
            outputDisplay.innerHTML = '<div class="terminal-prompt">Output cleared...</div>';
        }
    }
}