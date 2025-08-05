from flask import Flask, render_template, request, jsonify
import requests
import json

app = Flask(__name__)

# Hardcoded Gemini API key
GEMINI_API_KEY = "AIzaSyAyGU_zjaL44gIuFFdEXEjlMtzgrOpdCAY"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Language configurations
LANGUAGE_CONFIGS = {
    'python': {
        'name': 'Python',
        'icon': '🐍',
        'extension': '.py',
        'template': '# Python Code\nprint("Hello, World!")\n\n# Your code here'
    },
    'javascript': {
        'name': 'JavaScript',
        'icon': '⚡',
        'extension': '.js',
        'template': '// JavaScript Code\nconsole.log("Hello, World!");\n\n// Your code here'
    },
    'html': {
        'name': 'HTML',
        'icon': '🌐',
        'extension': '.html',
        'template': '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>'
    },
    'css': {
        'name': 'CSS',
        'icon': '🎨',
        'extension': '.css',
        'template': '/* CSS Styles */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background-color: #f0f0f0;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}'
    },
    'java': {
        'name': 'Java',
        'icon': '☕',
        'extension': '.java',
        'template': 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'
    },
    'c': {
        'name': 'C',
        'icon': '⚙️',
        'extension': '.c',
        'template': '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
    },
    'cpp': {
        'name': 'C++',
        'icon': '⚡',
        'extension': '.cpp',
        'template': '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}'
    }
}

@app.route('/')
def index():
    return render_template('index.html', languages=LANGUAGE_CONFIGS)

@app.route('/run_code', methods=['POST'])
def run_code():
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', 'python')
        
        if language not in LANGUAGE_CONFIGS:
            return jsonify({'error': 'Unsupported language'}), 400
        
        # For web languages, return message about live preview
        if language in ['html', 'css']:
            return jsonify({'output': 'This language is displayed in live preview mode'})
        
        # Create prompt for Gemini to execute the code
        prompt = f"""
You are a code execution simulator. Execute the following {language.upper()} code and provide the output exactly as it would appear when run.

Language: {language.upper()}
Code:
```{language}
{code}
```

Instructions:
1. Simulate the execution of this code
2. Return ONLY the output that would be printed/displayed
3. If there are errors, return the error message as it would appear
4. Do not include explanations, just the raw output
5. If the code runs successfully but produces no output, return "Code executed successfully (no output)"

Output:
"""

        # Call Gemini API
        headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY
        }
        
        payload = {
            'contents': [{
                'parts': [{'text': prompt}]
            }]
        }
        
        response = requests.post(GEMINI_API_URL, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                output = result['candidates'][0]['content']['parts'][0]['text'].strip()
                return jsonify({'output': output})
            else:
                return jsonify({'error': 'No response from AI'}), 500
        else:
            return jsonify({'error': f'API Error: {response.status_code}'}), 500
            
    except requests.RequestException as e:
        return jsonify({'error': f'Network error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Execution error: {str(e)}'}), 500

@app.route('/suggest_code', methods=['POST'])
def suggest_code():
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', 'python')
        prompt = data.get('prompt', '')
        
        # Create prompt for Gemini to suggest code improvements
        full_prompt = f"""
You are a code assistant. Help improve the following {language.upper()} code based on the user's request.

Current code:
```{language}
{code}
```

User request: {prompt}

Please provide an improved version of the code. Return only the code without explanations or markdown formatting.
"""
        
        headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY
        }
        
        payload = {
            'contents': [{
                'parts': [{'text': full_prompt}]
            }]
        }
        
        response = requests.post(GEMINI_API_URL, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                suggestion = result['candidates'][0]['content']['parts'][0]['text'].strip()
                return jsonify({'suggestion': suggestion})
            else:
                return jsonify({'error': 'No response from AI'}), 500
        else:
            return jsonify({'error': f'API Error: {response.status_code}'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)