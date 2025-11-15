import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 150px;
  border: 2px dashed #e1e5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  overflow: hidden;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderText = styled.span`
  color: #666;
  font-style: italic;
`;

const ExampleText = styled.div`
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

function InputPanel({
  backgroundImage,
  setBackgroundImage,
  script,
  setScript,
  sceneDescription,
  setSceneDescription,
  onGenerate,
  isAnimating
}) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PanelContainer>
      <Section>
        <Label htmlFor="background">Background Image</Label>
        <Input
          id="background"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <ImagePreview>
          {backgroundImage ? (
            <img src={backgroundImage} alt="Background preview" />
          ) : (
            <PlaceholderText>No image selected</PlaceholderText>
          )}
        </ImagePreview>
      </Section>

      <Section>
        <Label htmlFor="script">Conversation Script</Label>
        <TextArea
          id="script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter your conversation script here..."
        />
        <ExampleText>
          Example format:<br/>
          person1: Hello, how are you?<br/>
          person2: I'm doing great, thanks!<br/>
          person1: That's wonderful to hear.
        </ExampleText>
      </Section>

      <Section>
        <Label htmlFor="scene">Scene Description</Label>
        <TextArea
          id="scene"
          value={sceneDescription}
          onChange={(e) => setSceneDescription(e.target.value)}
          placeholder="Describe the scene setup..."
        />
        <ExampleText>
          Examples:<br/>
          • "Two people standing face to face"<br/>
          • "person1 chasing person2" (both will run)<br/>
          • "person1 laughing in dialog1" (person1 laughs when speaking)<br/>
          • "Two people sitting on chairs"
        </ExampleText>
      </Section>

      <Button onClick={onGenerate} disabled={isAnimating}>
        {isAnimating ? 'Animating...' : 'Generate Animation'}
      </Button>
    </PanelContainer>
  );
}

export default InputPanel;
