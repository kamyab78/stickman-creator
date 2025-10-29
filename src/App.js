import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import InputPanel from './components/InputPanel';
import AnimationCanvas from './components/AnimationCanvas';
import StickmanCharacter from './components/StickmanCharacter';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.h1`
  text-align: center;
  color: white;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const MainContent = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const RightPanel = styled.div`
  flex: 1;
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  position: relative;
  overflow: hidden;
`;

function App() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [script, setScript] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);

  const canvasRef = useRef(null);

  const handleGenerateAnimation = () => {
    if (!script || !sceneDescription) {
      alert('Please provide both script and scene description');
      return;
    }
    
    setIsAnimating(true);
    setAnimationStep(0);
    
    // Parse script to get speakers and their lines
    const scriptLines = script.split('\n').filter(line => line.trim());
    let step = 0;
    
    const animate = () => {
      if (step < scriptLines.length) {
        const line = scriptLines[step];
        const speakerMatch = line.match(/^(person1|person2):\s*(.+)/i);
        
        if (speakerMatch) {
          const [, speaker, dialogue] = speakerMatch;
          setCurrentSpeaker(speaker);
          setAnimationStep(step);
          
          // Move to next line after 3 seconds
          setTimeout(() => {
            step++;
            animate();
          }, 3000);
        } else {
          step++;
          animate();
        }
      } else {
        setIsAnimating(false);
        setCurrentSpeaker(null);
      }
    };
    
    animate();
  };

  return (
    <AppContainer>
      <Header>🎭 Stickman Animation Generator</Header>
      <MainContent>
        <LeftPanel>
          <InputPanel
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            script={script}
            setScript={setScript}
            sceneDescription={sceneDescription}
            setSceneDescription={setSceneDescription}
            onGenerate={handleGenerateAnimation}
            isAnimating={isAnimating}
          />
        </LeftPanel>
        <RightPanel>
          <AnimationCanvas
            ref={canvasRef}
            backgroundImage={backgroundImage}
            sceneDescription={sceneDescription}
            currentSpeaker={currentSpeaker}
            animationStep={animationStep}
            script={script}
          />
        </RightPanel>
      </MainContent>
    </AppContainer>
  );
}

export default App;
