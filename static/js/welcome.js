class WelcomeScreen {
    constructor() {
        this.developmentMode = null;
        this.currentLanguage = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const welcomeForm = document.getElementById('welcome-form');
        const modeOptions = document.querySelectorAll('.mode-option');
        const languageSelection = document.getElementById('language-selection');
        const languageOptions = document.querySelectorAll('.language-option');
        
        // Mode selection
        modeOptions.forEach(option => {
            option.addEventListener('click', () => {
                modeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.developmentMode = option.dataset.mode;
                
                if (this.developmentMode === 'programming') {
                    languageSelection.classList.remove('hidden');
                } else {
                    languageSelection.classList.add('hidden');
                    this.currentLanguage = 'web';
                }
            });
        });
        
        // Programming language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                languageOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.currentLanguage = option.dataset.lang;
            });
        });
        
        // Form submission
        welcomeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const projectname = document.getElementById('projectname').value.trim();
            
            if (username && projectname && this.developmentMode) {
                if (this.developmentMode === 'programming' && !this.currentLanguage) {
                    alert('Please select a programming language');
                    return;
                }
                this.startEditor(username, projectname);
            } else {
                alert('Please fill all required fields and select a development mode');
            }
        });
    }

    startEditor(username, projectname) {
        // Store in global app
        window.CodeStudioApp.currentMode = this.developmentMode;
        window.CodeStudioApp.currentLanguage = this.currentLanguage;
        window.CodeStudioApp.username = username;
        window.CodeStudioApp.projectName = projectname;
        
        // Hide welcome screen and show editor
        const welcomeScreen = document.getElementById('welcome-screen');
        const editorScreen = document.getElementById('editor-screen');
        
        welcomeScreen.style.animation = 'slideOut 0.5s ease-out forwards';
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            editorScreen.classList.remove('hidden');
            editorScreen.style.animation = 'fadeIn 0.5s ease-out';
            
            // Initialize editor
            window.CodeStudioApp.codeEditor.initialize();
        }, 500);
        
        // Update header
        document.getElementById('workbench-title').textContent = `${username}'s Workspace`;
        document.getElementById('project-name').textContent = projectname;
    }
}