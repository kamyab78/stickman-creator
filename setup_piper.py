#!/usr/bin/env python3
"""
Piper TTS Setup Script for Stickman Animation Generator
This script sets up a virtual environment, installs Piper TTS, downloads a voice model, and starts the server.
"""

import subprocess
import sys
import os
import time
import urllib.request
import json

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

def download_file(url, filename, description):
    """Download a file from URL"""
    print(f"🔄 {description}...")
    try:
        urllib.request.urlretrieve(url, filename)
        print(f"✅ {description} completed successfully")
        return True
    except Exception as e:
        print(f"❌ {description} failed: {e}")
        return False

def main():
    print("🎭 Setting up Piper TTS for Stickman Animation Generator")
    print("=" * 60)
    
    # Create virtual environment
    venv_path = "piper_env"
    if not os.path.exists(venv_path):
        print("\n📦 Creating virtual environment...")
        if not run_command("python3 -m venv piper_env", "Creating virtual environment"):
            print("❌ Failed to create virtual environment")
            return False
    
    # Activate virtual environment and install piper
    print("\n📦 Installing Piper TTS...")
    if not run_command("source piper_env/bin/activate && pip install --upgrade pip", "Upgrading pip"):
        print("⚠️ Failed to upgrade pip, continuing...")
    
    if not run_command("source piper_env/bin/activate && pip install piper-tts==1.2.0", "Installing Piper TTS 1.2.0"):
        print("❌ Failed to install Piper TTS 1.2.0, trying alternative...")
        if not run_command("source piper_env/bin/activate && pip install piper-tts==1.1.0", "Installing Piper TTS 1.1.0"):
            print("❌ Failed to install any version of Piper TTS")
            return False
    
    # Create voices directory
    voices_dir = os.path.join(venv_path, "voices")
    os.makedirs(voices_dir, exist_ok=True)
    
    # Download a simple voice model (using a smaller model for easier setup)
    print("\n🎵 Downloading voice model...")
    model_url = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx"
    config_url = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json"
    
    model_path = os.path.join(voices_dir, "en_US-lessac-medium.onnx")
    config_path = os.path.join(voices_dir, "en_US-lessac-medium.onnx.json")
    
    if not os.path.exists(model_path):
        if not download_file(model_url, model_path, "Downloading voice model"):
            print("❌ Failed to download voice model")
            return False
    
    if not os.path.exists(config_path):
        if not download_file(config_url, config_path, "Downloading voice config"):
            print("❌ Failed to download voice config")
            return False
    
    print(f"✅ Voice model ready at {model_path}")
    
    # Create a simple HTTP server script for Piper
    server_script = os.path.join(venv_path, "piper_server.py")
    with open(server_script, "w") as f:
        f.write('''#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "lib", "python3.9", "site-packages"))

from flask import Flask, request, jsonify, send_file
import piper
import io
import tempfile

app = Flask(__name__)

# Initialize Piper
model_path = os.path.join(os.path.dirname(__file__), "voices", "en_US-lessac-medium.onnx")
config_path = os.path.join(os.path.dirname(__file__), "voices", "en_US-lessac-medium.onnx.json")

try:
    voice = piper.PiperVoice.load(model_path, config_path)
    print(f"✅ Piper voice loaded successfully")
except Exception as e:
    print(f"❌ Failed to load Piper voice: {e}")
    voice = None

@app.route('/api/tts', methods=['POST'])
def tts():
    if not voice:
        return jsonify({"error": "Voice not loaded"}), 500
    
    data = request.get_json()
    text = data.get('text', '')
    voice_name = data.get('voice', 'en_US-lessac-medium')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        # Generate audio
        audio_data = voice.synthesize(text)
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            tmp_file.write(audio_data)
            tmp_file.flush()
            
            return send_file(tmp_file.name, as_attachment=True, download_name='speech.wav')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "voice_loaded": voice is not None})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
''')
    
    # Install Flask
    print("\n📦 Installing Flask...")
    if not run_command("source piper_env/bin/activate && pip install flask", "Installing Flask"):
        print("❌ Failed to install Flask")
        return False
    
    # Start the server
    print("\n🚀 Starting Piper TTS server...")
    print("Server will run on http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        # Start the server in the foreground
        subprocess.run([
            "source", "piper_env/bin/activate", "&&", 
            "python", "piper_server.py"
        ], cwd=venv_path, shell=True, check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
