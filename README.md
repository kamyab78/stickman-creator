# 🎭 Stickman Animation Generator

A React-based web application that generates animated stickman characters with high-quality offline text-to-speech and audio-synced mouth animation.

## Features

- **Classic Stickman Characters**: Thin-line stickman design matching reference style
- **High-Quality Offline TTS**: Uses Piper TTS for natural-sounding speech
- **Audio-Synced Mouth Animation**: Mouth moves based on actual audio amplitude
- **Background Image Support**: Upload any background image for your scene
- **Conversation Scripts**: Enter dialogue in `person1: ...` and `person2: ...` format
- **Scene Descriptions**: Describe character positioning (face to face, sitting, etc.)
- **Vertical Export**: Export 1080x1920 PNG frames for mobile/shorts
- **Offline Operation**: No internet required once set up

## Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
python3 setup_piper.py
```

This script will:
- Create a virtual environment
- Install Piper TTS and Flask
- Download the voice model from Hugging Face
- Start an HTTP server on port 5000

### Option 2: Manual Setup
```bash
# Create virtual environment
python3 -m venv piper_env
source piper_env/bin/activate

# Install dependencies
pip install piper-tts flask

# Download voice model manually from:
# https://huggingface.co/rhasspy/piper-voices/tree/v1.0.0/en/en_US/lessac/medium

# Create a Flask server (see setup_piper.py for reference)
```

## How to Use

1. **Setup Piper TTS**: Run the setup script or follow manual instructions
2. **Open Application**: Open `index.html` in your web browser
3. **Check Status**: Click "Check" to verify Piper TTS is running
4. **Upload Background**: Click "Choose File" to upload a background image (optional)
5. **Enter Script**: Type your conversation:
   ```
   person1: Hello, how are you?
   person2: I'm doing great, thanks!
   person1: That's wonderful to hear.
   ```
6. **Describe Scene**: Enter positioning like "Two people standing face to face"
7. **Generate Animation**: Click "Generate Animation" to start!

## Character Features

- **Classic Design**: Simple circle head, dot eyes, thin lines
- **Audio-Synced Mouth**: Mouth opens/closes based on speech audio
- **Golden Glow**: Speaking character highlights with golden light
- **Smooth Animation**: Natural mouth movement synchronized to voice

## TTS Features

- **High Quality**: Piper TTS provides natural-sounding speech
- **Offline**: No internet required after setup
- **Audio Analysis**: Real-time audio analysis for mouth sync
- **Fallback**: Uses browser TTS if Piper isn't available

## Export Features

- **Vertical Format**: 1080x1920 PNG export
- **Mobile Optimized**: Perfect for YouTube Shorts, TikTok, etc.
- **High Resolution**: Crisp, scalable output

## Technical Details

- **Frontend**: React 18 with CDN links (no npm required)
- **TTS**: Piper TTS with Web Audio API analysis
- **Graphics**: SVG-based stickman characters
- **Audio**: Web Audio API for real-time analysis
- **Export**: Canvas-based PNG generation

## Troubleshooting

### Piper TTS Issues
- **Voice not found**: Run `piper --download-voice en_US-lessac-medium`
- **Server won't start**: Check if port 5000 is available
- **Audio not working**: Ensure browser allows audio playback

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile**: Works on modern mobile browsers

## Example Usage

1. Setup Piper TTS using the setup script
2. Upload a park background image
3. Enter script:
   ```
   person1: What a beautiful day!
   person2: Yes, perfect for a walk.
   person1: Should we go to the lake?
   ```
4. Describe scene: "Two people standing face to face in a park"
5. Click "Generate Animation" and watch characters speak with synced mouth movement!

The characters will speak with high-quality audio and their mouths will move naturally with the speech!
