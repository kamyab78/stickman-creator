#!/usr/bin/env python3
"""
Simple TTS Setup Script for Stickman Animation Generator
This script sets up a simple TTS server using pyttsx3 (more reliable than Piper)
"""

import subprocess
import sys
import os
import time

def run_command(cmd, description, cwd=None):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True, cwd=cwd)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("🎭 Setting up Simple TTS for Stickman Animation Generator")
    print("=" * 60)
    
    # Create virtual environment
    venv_path = "tts_env"
    if not os.path.exists(venv_path):
        print("\n📦 Creating virtual environment...")
        if not run_command("python3 -m venv tts_env", "Creating virtual environment"):
            print("❌ Failed to create virtual environment")
            return False
    
    # Install dependencies
    print("\n📦 Installing TTS dependencies...")
    if not run_command("source tts_env/bin/activate && pip install --upgrade pip", "Upgrading pip"):
        print("⚠️ Failed to upgrade pip, continuing...")
    
    if not run_command("source tts_env/bin/activate && pip install pyttsx3 flask", "Installing pyttsx3 and Flask"):
        print("❌ Failed to install dependencies")
        return False
    
    # Create TTS server script
    server_script = os.path.join(venv_path, "tts_server.py")
    with open(server_script, "w") as f:
        f.write('''#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "lib", "python3.9", "site-packages"))

from flask import Flask, request, jsonify, send_file
import pyttsx3
import tempfile
import threading
import time

app = Flask(__name__)

# Initialize TTS engine
try:
    engine = pyttsx3.init()
    # Configure voice properties
    voices = engine.getProperty('voices')
    if voices:
        # Try to use different voices for different speakers
        engine.setProperty('voice', voices[0].id)
    engine.setProperty('rate', 150)  # Speed of speech
    engine.setProperty('volume', 0.8)  # Volume level (0.0 to 1.0)
    print(f"✅ TTS engine initialized successfully")
    print(f"Available voices: {len(voices) if voices else 0}")
except Exception as e:
    print(f"❌ Failed to initialize TTS engine: {e}")
    engine = None

def save_audio_to_file(text, filename):
    """Save TTS audio to file"""
    if not engine:
        return False
    
    try:
        engine.save_to_file(text, filename)
        engine.runAndWait()
        return True
    except Exception as e:
        print(f"Error generating audio: {e}")
        return False

@app.route('/api/tts', methods=['POST'])
def tts():
    if not engine:
        return jsonify({"error": "TTS engine not available"}), 500
    
    data = request.get_json()
    text = data.get('text', '')
    voice_name = data.get('voice', 'default')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            tmp_file_path = tmp_file.name
        
        # Generate audio
        if save_audio_to_file(text, tmp_file_path):
            return send_file(tmp_file_path, as_attachment=True, download_name='speech.wav')
        else:
            return jsonify({"error": "Failed to generate audio"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "tts_available": engine is not None})

if __name__ == '__main__':
    print("🚀 Starting TTS server on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
''')
    
    # Start the server
    print("\n🚀 Starting TTS server...")
    print("Server will run on http://localhost:5001")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        # Start the server in the foreground
        subprocess.run(
            "source tts_env/bin/activate && python tts_server.py",
            cwd=venv_path, shell=True, check=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
