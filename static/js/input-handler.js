class InputHandler {
    constructor() {
        this.inputs = [];
        this.isInputMode = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const submitBtn = document.getElementById('submit-input');
        const finishBtn = document.getElementById('finish-input');
        const userInput = document.getElementById('user-input');

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.addInput());
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', () => this.finishInput());
        }

        if (userInput) {
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addInput();
                }
            });
        }
    }

    showInputInterface(message = 'This code requires user input') {
        const inputInterface = document.getElementById('input-interface');
        const outputTitleText = document.getElementById('output-title-text');
        
        if (inputInterface && outputTitleText) {
            outputTitleText.textContent = 'Input Required';
            inputInterface.classList.remove('hidden');
            this.isInputMode = true;
            this.inputs = [];
            this.updateInputDisplay();
            
            // Focus on input field
            const userInput = document.getElementById('user-input');
            if (userInput) {
                userInput.focus();
            }

            // Add message to output
            window.CodeStudioApp.outputManager.addToOutput(message, 'output');
            window.CodeStudioApp.outputManager.addToOutput('Please provide the required inputs below:', 'output');
        }
    }

    hideInputInterface() {
        const inputInterface = document.getElementById('input-interface');
        const outputTitleText = document.getElementById('output-title-text');
        
        if (inputInterface && outputTitleText) {
            inputInterface.classList.add('hidden');
            outputTitleText.textContent = 'Output';
            this.isInputMode = false;
        }
    }

    addInput() {
        const userInputField = document.getElementById('user-input');
        const inputValue = userInputField.value.trim();
        
        if (inputValue) {
            this.inputs.push(inputValue);
            userInputField.value = '';
            this.updateInputDisplay();
            window.CodeStudioApp.outputManager.addToOutput(`Input ${this.inputs.length}: ${inputValue}`, 'success');
            userInputField.focus();
        }
    }

    removeInput(index) {
        this.inputs.splice(index, 1);
        this.updateInputDisplay();
        window.CodeStudioApp.outputManager.addToOutput(`Removed input ${index + 1}`, 'output');
    }

    updateInputDisplay() {
        const inputDisplay = document.getElementById('input-display');
        
        if (inputDisplay) {
            if (this.inputs.length === 0) {
                inputDisplay.innerHTML = '<div style="color: var(--text-muted); font-style: italic; padding: 1rem;">No inputs provided yet</div>';
            } else {
                inputDisplay.innerHTML = this.inputs.map((input, index) => `
                    <div class="input-item">
                        <span class="input-item-text">${index + 1}: ${input}</span>
                        <button class="input-item-remove" onclick="window.CodeStudioApp.inputHandler.removeInput(${index})" title="Remove input">
                            ×
                        </button>
                    </div>
                `).join('');
            }
        }
    }

    finishInput() {
        if (this.inputs.length === 0) {
            window.CodeStudioApp.outputManager.addToOutput('Please provide at least one input before running the code.', 'error');
            return;
        }

        this.hideInputInterface();
        window.CodeStudioApp.outputManager.addToOutput(`Running code with ${this.inputs.length} input(s)...`, 'output');
        
        // Run the code with inputs
        this.runCodeWithInputs();
    }

    runCodeWithInputs() {
        const codeToRun = window.CodeStudioApp.currentMode === 'web' ? 
            window.CodeStudioApp.codeEditor.webCodes[window.CodeStudioApp.codeEditor.currentWebLanguage] : 
            window.CodeStudioApp.codeEditor.code;
        
        const language = window.CodeStudioApp.currentMode === 'web' ? 
            window.CodeStudioApp.codeEditor.currentWebLanguage : 
            window.CodeStudioApp.currentLanguage;

        window.CodeStudioApp.outputManager.showLoading();

        fetch('/run_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: codeToRun,
                language: language,
                inputs: this.inputs
            })
        })
        .then(response => response.json())
        .then(data => {
            window.CodeStudioApp.outputManager.hideLoading();
            if (data.error) {
                window.CodeStudioApp.outputManager.addToOutput('Error:', 'error');
                window.CodeStudioApp.outputManager.addToOutput(data.error, 'error');
            } else {
                window.CodeStudioApp.outputManager.addToOutput('Output:', 'success');
                window.CodeStudioApp.outputManager.addToOutput(data.output || 'Code executed successfully (no output)', 'output');
            }
        })
        .catch(error => {
            window.CodeStudioApp.outputManager.hideLoading();
            window.CodeStudioApp.outputManager.addToOutput('Network error: ' + error.message, 'error');
        });
    }

    clearInputs() {
        this.inputs = [];
        this.updateInputDisplay();
        const userInput = document.getElementById('user-input');
        if (userInput) {
            userInput.value = '';
        }
        window.CodeStudioApp.outputManager.addToOutput('All inputs cleared.', 'output');
    }

    getInputs() {
        return this.inputs;
    }

    isInInputMode() {
        return this.isInputMode;
    }
}