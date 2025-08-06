class CodeEditor {
    constructor() {
        this.webCodes = {
            html: '',
            css: '',
            javascript: ''
        };
        this.currentWebLanguage = 'html';
        this.code = '';
        this.isOutputVisible = true;
        this.livePreviewEnabled = false;
        
        this.webTemplates = {
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Project</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to your web development project! This is just a sample code remove the code and start your coding...!</p>
</body>
</html>`,
            css: `/* CSS Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
}

h1 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

p {
    text-align: center;
    font-size: 1.2rem;
}`,
            javascript: `// JavaScript Code
console.log("Hello, World!");

// DOM Manipulation
document.addEventListener("DOMContentLoaded", function() {
    console.log("Page loaded successfully!");
    
    // Add some interactivity
    const heading = document.querySelector("h1");
    if (heading) {
        heading.addEventListener("click", function() {
            this.style.color = this.style.color === "yellow" ? "white" : "yellow";
        });
    }
});`
        };
        
        this.templates = {
            'python': '# Python Code\nprint("Hello, World!")\n\n# Your code here\n',
            'javascript': '// JavaScript Code\nconsole.log("Hello, World!");\n\n// Your code here\n',
            'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        \n        // Example with user input:\n        // Scanner scanner = new Scanner(System.in);\n        // System.out.print("Enter your name: ");\n        // String name = scanner.nextLine();\n        // System.out.println("Hello, " + name + "!");\n    }\n}',
            'c': '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    \n    // Example with user input:\n    // char name[50];\n    // printf("Enter your name: ");\n    // scanf("%s", name);\n    // printf("Hello, %s!\\n", name);\n    \n    return 0;\n}',
            'cpp': '#include <iostream>\n#include <string>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    \n    // Example with user input:\n    // std::string name;\n    // std::cout << "Enter your name: ";\n    // std::cin >> name;\n    // std::cout << "Hello, " << name << "!" << std::endl;\n    \n    return 0;\n}'
        };
    }

    initialize() {
        this.setupEditor();
        this.setupEventListeners();
        
        if (window.CodeStudioApp.currentMode === 'web') {
            this.setupWebDevelopment();
        } else {
            this.setupProgramming();
        }
    }

    setupEditor() {
        const codeInput = document.getElementById('code-input');
        if (!codeInput) return;
        
        const lineNumbers = document.getElementById('line-numbers');
        
        // Sync scrolling
        codeInput.addEventListener('scroll', () => {
            if (lineNumbers) {
                lineNumbers.scrollTop = codeInput.scrollTop;
            }
        });

        // Update line numbers on input
        codeInput.addEventListener('input', () => {
            this.updateLineNumbers();
            this.code = codeInput.value;
        });

        // Handle tab key
        codeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = codeInput.selectionStart;
                const end = codeInput.selectionEnd;
                codeInput.value = codeInput.value.substring(0, start) + '    ' + codeInput.value.substring(end);
                codeInput.selectionStart = codeInput.selectionEnd = start + 4;
                this.updateLineNumbers();
                this.code = codeInput.value;
            }
        });
    }

    setupWebDevelopment() {
        document.getElementById('web-editor').classList.remove('hidden');
        document.getElementById('programming-editor').classList.add('hidden');
        document.getElementById('current-language-badge').textContent = '🌐 Web Development';
        document.getElementById('run-btn').classList.add('hidden');
        
        // Set output terminal to web mode (white background)
        const outputTerminal = document.getElementById('output-display');
        outputTerminal.classList.remove('programming-mode');
        outputTerminal.classList.add('web-mode');
        
        this.loadWebTemplates();
        this.livePreviewEnabled = true;
        this.updateWebPreview();
        this.setupWebEditor();
    }

    setupProgramming() {
        document.getElementById('programming-editor').classList.remove('hidden');
        document.getElementById('web-editor').classList.add('hidden');
        
        // Set output terminal to programming mode (dark background)
        const outputTerminal = document.getElementById('output-display');
        outputTerminal.classList.remove('web-mode');
        outputTerminal.classList.add('programming-mode');
        
        const languageConfigs = {
            'python': { name: 'Python', icon: '🐍' },
            'javascript': { name: 'JavaScript', icon: '⚡' },
            'java': { name: 'Java', icon: '☕' },
            'c': { name: 'C', icon: '⚙️' },
            'cpp': { name: 'C++', icon: '⚡' }
        };
        
        const config = languageConfigs[window.CodeStudioApp.currentLanguage];
        document.getElementById('current-language-badge').textContent = `${config.icon} ${config.name}`;
        document.getElementById('current-language-title').textContent = `${config.name} Editor`;
        document.getElementById('run-btn').classList.remove('hidden');
        
        this.loadTemplate();
        this.livePreviewEnabled = false;
    }

    loadWebTemplates() {
        this.webCodes.html = this.webTemplates.html;
        this.webCodes.css = this.webTemplates.css;  
        this.webCodes.javascript = this.webTemplates.javascript;
        
        const webCodeInput = document.getElementById('web-code-input');
        webCodeInput.value = this.webCodes[this.currentWebLanguage];
        this.updateWebLineNumbers();
    }

    setupWebEditor() {
        const webCodeInput = document.getElementById('web-code-input');
        const webTabs = document.querySelectorAll('.web-tab');
        
        // Web tab switching
        webTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.webCodes[this.currentWebLanguage] = webCodeInput.value;
                
                webTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                this.currentWebLanguage = tab.dataset.lang;
                webCodeInput.value = this.webCodes[this.currentWebLanguage];
                
                document.getElementById('web-current-language').textContent = tab.textContent.trim();
                this.updateWebLineNumbers();
                
                if (this.livePreviewEnabled) {
                    this.updateWebPreview();
                }
            });
        });
        
        // Sync scrolling and input
        const webLineNumbers = document.getElementById('web-line-numbers');
        webCodeInput.addEventListener('scroll', () => {
            webLineNumbers.scrollTop = webCodeInput.scrollTop;
        });

        webCodeInput.addEventListener('input', () => {
            this.webCodes[this.currentWebLanguage] = webCodeInput.value;
            this.updateWebLineNumbers();
            
            if (this.livePreviewEnabled) {
                this.updateWebPreview();
            }
        });
    }

    setupEventListeners() {
        // Control buttons
        document.getElementById('clear-btn')?.addEventListener('click', () => this.clearCode());
        document.getElementById('copy-btn')?.addEventListener('click', () => this.copyCode());
        document.getElementById('download-btn')?.addEventListener('click', () => this.downloadFile());
        
        document.getElementById('web-clear-btn')?.addEventListener('click', () => this.clearWebCode());
        document.getElementById('web-copy-btn')?.addEventListener('click', () => this.copyWebCode());
        document.getElementById('web-download-btn')?.addEventListener('click', () => this.downloadWebFile());
        
        document.getElementById('toggle-output-btn')?.addEventListener('click', () => this.toggleOutput());
        document.getElementById('clear-output-btn')?.addEventListener('click', () => this.clearOutput());
        document.getElementById('new-window-btn')?.addEventListener('click', () => this.openInNewWindow());
        document.getElementById('run-btn')?.addEventListener('click', () => this.runCode());
    }

    loadTemplate() {
        const codeInput = document.getElementById('code-input');
        if (codeInput && this.templates[window.CodeStudioApp.currentLanguage]) {
            codeInput.value = this.templates[window.CodeStudioApp.currentLanguage];
            this.code = codeInput.value;
            this.updateLineNumbers();
        }
    }

    updateLineNumbers() {
        const codeInput = document.getElementById('code-input');
        const lineNumbers = document.getElementById('line-numbers');
        
        if (!codeInput || !lineNumbers) return;
        
        const lines = codeInput.value.split('\n').length;
        let lineNumbersText = '';
        for (let i = 1; i <= lines; i++) {
            lineNumbersText += i + '\n';
        }
        lineNumbers.textContent = lineNumbersText;
    }

    updateWebLineNumbers() {
        const webCodeInput = document.getElementById('web-code-input');
        const webLineNumbers = document.getElementById('web-line-numbers');
        const lines = webCodeInput.value.split('\n').length;
        
        let lineNumbersText = '';
        for (let i = 1; i <= lines; i++) {
            lineNumbersText += i + '\n';
        }
        webLineNumbers.textContent = lineNumbersText;
    }

    updateWebPreview() {
        if (!this.livePreviewEnabled) return;
        
        const outputDisplay = document.getElementById('output-display');
        let htmlContent = this.webCodes.html;
        
        if (this.webCodes.css.trim()) {
            const cssStyleTag = `<style>${this.webCodes.css}</style>`;
            if (htmlContent.includes('</head>')) {
                htmlContent = htmlContent.replace('</head>', cssStyleTag + '</head>');
            } else {
                htmlContent = cssStyleTag + htmlContent;
            }
        }
        
        if (this.webCodes.javascript.trim()) {
            const jsScriptTag = `<script>${this.webCodes.javascript}</script>`;
            if (htmlContent.includes('</body>')) {
                htmlContent = htmlContent.replace('</body>', jsScriptTag + '</body>');
            } else {
                htmlContent = htmlContent + jsScriptTag;
            }
        }
        
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.background = '#ffffff';
        
        outputDisplay.innerHTML = '';
        outputDisplay.appendChild(iframe);
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
    }

    runCode() {
        if (!this.code.trim()) {
            window.CodeStudioApp.outputManager.addToOutput('No code to run!', 'error');
            return;
        }

        // Check if we're already in input mode
        if (window.CodeStudioApp.inputHandler.isInInputMode()) {
            window.CodeStudioApp.outputManager.addToOutput('Please finish providing inputs first.', 'error');
            return;
        }

        window.CodeStudioApp.outputManager.showLoading();
        window.CodeStudioApp.outputManager.addToOutput(`Running ${window.CodeStudioApp.currentLanguage} code...`, 'output');

        fetch('/run_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: this.code,
                language: window.CodeStudioApp.currentLanguage,
                inputs: []
            })
        })
        .then(response => response.json())
        .then(data => {
            window.CodeStudioApp.outputManager.hideLoading();
            
            if (data.needs_input) {
                // Code requires input - show input interface
                window.CodeStudioApp.inputHandler.showInputInterface(data.message);
            } else if (data.error) {
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

    clearCode() {
        const codeInput = document.getElementById('code-input');
        if (codeInput) {
            codeInput.value = '';
            this.code = '';
            this.updateLineNumbers();
            window.CodeStudioApp.outputManager.addToOutput('Code cleared.', 'success');
        }
    }

    clearWebCode() {
        const webCodeInput = document.getElementById('web-code-input');
        webCodeInput.value = '';
        this.webCodes[this.currentWebLanguage] = '';
        this.updateWebLineNumbers();
        
        if (this.livePreviewEnabled) {
            this.updateWebPreview();
        }
        
        window.CodeStudioApp.outputManager.addToOutput('Code cleared.', 'success');
    }

    copyCode() {
        const codeToopy = window.CodeStudioApp.currentMode === 'web' ? 
            this.webCodes[this.currentWebLanguage] : this.code;
            
        navigator.clipboard.writeText(codeToopy).then(() => {
            window.CodeStudioApp.outputManager.addToOutput('Code copied to clipboard!', 'success');
        }).catch(() => {
            window.CodeStudioApp.outputManager.addToOutput('Failed to copy code.', 'error');
        });
    }

    copyWebCode() {
        const currentCode = this.webCodes[this.currentWebLanguage];
        navigator.clipboard.writeText(currentCode).then(() => {
            window.CodeStudioApp.outputManager.addToOutput('Code copied to clipboard!', 'success');
        }).catch(() => {
            window.CodeStudioApp.outputManager.addToOutput('Failed to copy code.', 'error');
        });
    }

    downloadFile() {
        if (window.CodeStudioApp.currentMode === 'web') {
            this.downloadWebFile();
            return;
        }
        
        const extensions = {
            'python': '.py',
            'javascript': '.js',
            'java': '.java',
            'c': '.c',
            'cpp': '.cpp'
        };
        
        const extension = extensions[window.CodeStudioApp.currentLanguage];
        const blob = new Blob([this.code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${window.CodeStudioApp.projectName}${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.CodeStudioApp.outputManager.addToOutput(`File downloaded: ${window.CodeStudioApp.projectName}${extension}`, 'success');
    }

    downloadWebFile() {
        const currentCode = this.webCodes[this.currentWebLanguage];
        const extensions = { html: '.html', css: '.css', javascript: '.js' };
        const extension = extensions[this.currentWebLanguage];
        
        const blob = new Blob([currentCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${window.CodeStudioApp.projectName}${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.CodeStudioApp.outputManager.addToOutput(`File downloaded: ${window.CodeStudioApp.projectName}${extension}`, 'success');
    }

    toggleOutput() {
        const outputPanel = document.getElementById('output-panel');
        const editorPanel = window.CodeStudioApp.currentMode === 'web' ? 
            document.getElementById('web-editor') : 
            document.getElementById('programming-editor');
        const toggleBtn = document.getElementById('toggle-output-btn');
        
        if (this.isOutputVisible) {
            outputPanel.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                outputPanel.style.display = 'none';
                editorPanel.style.width = '100%';
                toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Show Output';
                this.isOutputVisible = false;
            }, 300);
        } else {
            outputPanel.style.display = 'flex';
            outputPanel.style.animation = 'slideIn 0.3s ease-out forwards';
            editorPanel.style.width = '50%';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Output';
            this.isOutputVisible = true;
        }
    }

    clearOutput() {
        const outputDisplay = document.getElementById('output-display');
        if (window.CodeStudioApp.currentMode === 'web') {
            outputDisplay.innerHTML = '<div style="padding: 1rem; color: #666;">Live preview ready...</div>';
        } else {
            outputDisplay.innerHTML = '<div class="terminal-prompt">Output cleared...</div>';
        }
        
        // Also hide input interface if visible
        window.CodeStudioApp.inputHandler.hideInputInterface();
    }

    openInNewWindow() {
        if (window.CodeStudioApp.currentMode === 'web') {
            let htmlContent = this.webCodes.html;
            
            if (this.webCodes.css.trim()) {
                const cssStyleTag = `<style>${this.webCodes.css}</style>`;
                if (htmlContent.includes('</head>')) {
                    htmlContent = htmlContent.replace('</head>', cssStyleTag + '</head>');
                } else {
                    htmlContent = cssStyleTag + htmlContent;
                }
            }
            
            if (this.webCodes.javascript.trim()) {
                const jsScriptTag = `<script>${this.webCodes.javascript}</script>`;
                if (htmlContent.includes('</body>')) {
                    htmlContent = htmlContent.replace('</body>', jsScriptTag + '</body>');
                } else {
                    htmlContent = htmlContent + jsScriptTag;
                }
            }
            
            const newWindow = window.open('', '_blank');
            newWindow.document.write(htmlContent);
            newWindow.document.close();
            return;
        }
        
        if (!this.code.trim()) {
            window.CodeStudioApp.outputManager.addToOutput('No code to open in new window!', 'error');
            return;
        }

        const extensions = {
            'python': '.py',
            'javascript': '.js', 
            'java': '.java',
            'c': '.c',
            'cpp': '.cpp'
        };
        
        const extension = extensions[window.CodeStudioApp.currentLanguage];
        const newWindow = window.open('', '_blank');
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${window.CodeStudioApp.projectName}${extension}</title>
                <style>
                    body { font-family: 'JetBrains Mono', monospace; background: #0d1117; color: #e6edf3; margin: 0; padding: 20px; }
                    pre { background: #161b22; padding: 20px; border-radius: 8px; border: 1px solid #30363d; overflow-x: auto; }
                    h1 { color: #238636; }
                </style>
            </head>
            <body>
                <h1>${window.CodeStudioApp.projectName}${extension}</h1>
                <pre><code>${this.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
            </body>
            </html>
        `;
        newWindow.document.write(html);
        newWindow.document.close();
        
        window.CodeStudioApp.outputManager.addToOutput('Code opened in new window!', 'success');
    }
}