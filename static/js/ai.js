class AIAssistant {
    constructor() {
        this.currentSuggestion = '';
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('ai-suggest-btn')?.addEventListener('click', () => this.showModal());
        document.getElementById('close-modal')?.addEventListener('click', () => this.hideModal());
        document.getElementById('get-suggestion')?.addEventListener('click', () => this.getSuggestion());
        document.getElementById('apply-suggestion')?.addEventListener('click', () => this.applySuggestion());
        document.getElementById('copy-suggestion')?.addEventListener('click', () => this.copySuggestion());

        const modal = document.getElementById('ai-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            });
        }
    }

    showModal() {
        const modal = document.getElementById('ai-modal');
        const prompt = document.getElementById('ai-prompt');
        const response = document.getElementById('ai-response');
        
        if (modal && prompt && response) {
            modal.classList.remove('hidden');
            prompt.value = '';
            response.classList.add('hidden');
            prompt.focus();
        }
    }

    hideModal() {
        const modal = document.getElementById('ai-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    getSuggestion() {
        const prompt = document.getElementById('ai-prompt').value.trim();
        if (!prompt) {
            window.CodeStudioApp.outputManager.addToOutput('Please enter a prompt for AI assistance!', 'error');
            return;
        }

        window.CodeStudioApp.outputManager.showLoading();

        const codeToAnalyze = window.CodeStudioApp.currentMode === 'web' ? 
            window.CodeStudioApp.codeEditor.webCodes[window.CodeStudioApp.codeEditor.currentWebLanguage] : 
            window.CodeStudioApp.codeEditor.code;
        const language = window.CodeStudioApp.currentMode === 'web' ? 
            window.CodeStudioApp.codeEditor.currentWebLanguage : 
            window.CodeStudioApp.currentLanguage;

        fetch('/suggest_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: codeToAnalyze,
                language: language,
                prompt: prompt
            })
        })
        .then(response => response.json())
        .then(data => {
            window.CodeStudioApp.outputManager.hideLoading();
            const responseDiv = document.getElementById('ai-response');
            const suggestionPre = document.getElementById('ai-suggestion');
            
            if (data.error) {
                window.CodeStudioApp.outputManager.addToOutput('AI Error: ' + data.error, 'error');
            } else {
                suggestionPre.textContent = data.suggestion;
                responseDiv.classList.remove('hidden');
                this.currentSuggestion = data.suggestion;
                window.CodeStudioApp.outputManager.addToOutput('AI suggestion generated!', 'success');
            }
        })
        .catch(error => {
            window.CodeStudioApp.outputManager.hideLoading();
            window.CodeStudioApp.outputManager.addToOutput('Network error: ' + error.message, 'error');
        });
    }

    applySuggestion() {
        if (this.currentSuggestion) {
            if (window.CodeStudioApp.currentMode === 'web') {
                const webCodeInput = document.getElementById('web-code-input');
                webCodeInput.value = this.currentSuggestion;
                window.CodeStudioApp.codeEditor.webCodes[window.CodeStudioApp.codeEditor.currentWebLanguage] = this.currentSuggestion;
                window.CodeStudioApp.codeEditor.updateWebLineNumbers();
                if (window.CodeStudioApp.codeEditor.livePreviewEnabled) {
                    window.CodeStudioApp.codeEditor.updateWebPreview();
                }
            } else {
                const codeInput = document.getElementById('code-input');
                codeInput.value = this.currentSuggestion;
                window.CodeStudioApp.codeEditor.code = this.currentSuggestion;
                window.CodeStudioApp.codeEditor.updateLineNumbers();
            }
            this.hideModal();
            window.CodeStudioApp.outputManager.addToOutput('AI suggestion applied!', 'success');
        }
    }

    copySuggestion() {
        if (this.currentSuggestion) {
            navigator.clipboard.writeText(this.currentSuggestion).then(() => {
                window.CodeStudioApp.outputManager.addToOutput('AI suggestion copied to clipboard!', 'success');
            }).catch(() => {
                window.CodeStudioApp.outputManager.addToOutput('Failed to copy suggestion.', 'error');
            });
        }
    }
}