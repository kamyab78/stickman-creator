import React, { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import StickmanCharacter from './StickmanCharacter';

const CanvasContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.7;
  z-index: 1;
`;

const CharactersContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const DialogueBox = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  max-width: 80%;
  text-align: center;
  z-index: 3;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const SpeakerLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #ffd700;
`;

const DialogueText = styled.div`
  font-size: 14px;
`;

const AnimationCanvas = forwardRef(({
  backgroundImage,
  sceneDescription,
  currentSpeaker,
  animationStep,
  script
}, ref) => {
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [currentSpeakerName, setCurrentSpeakerName] = useState('');

  useEffect(() => {
    if (script && animationStep >= 0) {
      const scriptLines = script.split('\n').filter(line => line.trim());
      const currentLine = scriptLines[animationStep];
      
      if (currentLine) {
        const speakerMatch = currentLine.match(/^(person1|person2):\s*(.+)/i);
        if (speakerMatch) {
          const [, speaker, dialogue] = speakerMatch;
          setCurrentSpeakerName(speaker);
          setCurrentDialogue(dialogue);
        }
      }
    }
  }, [script, animationStep]);

  // Parse scene description to determine character positions
  const getCharacterPositions = () => {
    const description = sceneDescription.toLowerCase();
    
    if (description.includes('face to face') || description.includes('standing')) {
      return {
        person1: { x: 30, y: 50, facing: 'right' },
        person2: { x: 70, y: 50, facing: 'left' }
      };
    } else if (description.includes('sitting') && description.includes('behind')) {
      return {
        person1: { x: 25, y: 60, facing: 'right' },
        person2: { x: 75, y: 60, facing: 'left' }
      };
    } else if (description.includes('side by side')) {
      return {
        person1: { x: 40, y: 50, facing: 'front' },
        person2: { x: 60, y: 50, facing: 'front' }
      };
    } else {
      // Default positioning
      return {
        person1: { x: 30, y: 50, facing: 'right' },
        person2: { x: 70, y: 50, facing: 'left' }
      };
    }
  };

  const positions = getCharacterPositions();

  return (
    <CanvasContainer ref={ref}>
      {backgroundImage && (
        <BackgroundImage src={backgroundImage} />
      )}
      
      <CharactersContainer>
        <StickmanCharacter
          id="person1"
          x={positions.person1.x}
          y={positions.person1.y}
          facing={positions.person1.facing}
          isActive={currentSpeaker === 'person1'}
          isAnimating={currentSpeaker === 'person1'}
        />
        <StickmanCharacter
          id="person2"
          x={positions.person2.x}
          y={positions.person2.y}
          facing={positions.person2.facing}
          isActive={currentSpeaker === 'person2'}
          isAnimating={currentSpeaker === 'person2'}
        />
      </CharactersContainer>

      {currentDialogue && (
        <DialogueBox>
          <SpeakerLabel>{currentSpeakerName}</SpeakerLabel>
          <DialogueText>{currentDialogue}</DialogueText>
        </DialogueBox>
      )}
    </CanvasContainer>
  );
});

AnimationCanvas.displayName = 'AnimationCanvas';

export default AnimationCanvas;
