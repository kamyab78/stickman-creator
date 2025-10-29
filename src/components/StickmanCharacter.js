import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CharacterContainer = styled.div`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  z-index: 2;
`;

const SVGContainer = styled.svg`
  width: 80px;
  height: 120px;
  filter: ${props => props.isActive ? 'drop-shadow(0 0 10px #ffd700)' : 'none'};
  transition: filter 0.3s ease;
`;

const AnimatedGroup = styled.g`
  animation: ${props => props.isAnimating ? 'bounce 0.6s ease-in-out infinite alternate' : 'none'};
  
  @keyframes bounce {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-5px); }
  }
`;

const PointingGroup = styled.g`
  animation: ${props => props.isPointing ? 'point 0.8s ease-in-out infinite alternate' : 'none'};
  
  @keyframes point {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(10deg); }
  }
`;

const Eye = styled.circle`
  fill: #000;
  transition: all 0.3s ease;
`;

const Mouth = styled.path`
  fill: none;
  stroke: #000;
  stroke-width: 2;
  stroke-linecap: round;
  transition: all 0.3s ease;
`;

function StickmanCharacter({ 
  id, 
  x, 
  y, 
  facing = 'front', 
  isActive = false, 
  isAnimating = false 
}) {
  const [isPointing, setIsPointing] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      setIsPointing(true);
      const timer = setTimeout(() => {
        setIsPointing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const getFacingTransform = () => {
    switch (facing) {
      case 'left':
        return 'scaleX(-1)';
      case 'right':
        return 'scaleX(1)';
      case 'front':
      default:
        return 'scaleX(1)';
    }
  };

  const getMouthExpression = () => {
    if (isActive) {
      return 'M 15 25 Q 20 30 25 25'; // Smile
    }
    return 'M 15 25 Q 20 22 25 25'; // Neutral
  };

  return (
    <CharacterContainer x={x} y={y}>
      <SVGContainer 
        viewBox="0 0 40 60" 
        isActive={isActive}
        style={{ transform: getFacingTransform() }}
      >
        <AnimatedGroup isAnimating={isAnimating}>
          {/* Head */}
          <circle cx="20" cy="15" r="8" fill="none" stroke="#000" strokeWidth="2"/>
          
          {/* Eyes */}
          <Eye cx="17" cy="12" r="1.5" />
          <Eye cx="23" cy="12" r="1.5" />
          
          {/* Mouth */}
          <Mouth d={getMouthExpression()} />
          
          {/* Body */}
          <line x1="20" y1="23" x2="20" y2="45" stroke="#000" strokeWidth="2"/>
          
          {/* Arms */}
          <line x1="20" y1="30" x2="15" y2="40" stroke="#000" strokeWidth="2"/>
          <PointingGroup isPointing={isPointing}>
            <line x1="20" y1="30" x2="25" y2="40" stroke="#000" strokeWidth="2"/>
            <line x1="25" y1="40" x2="28" y2="38" stroke="#000" strokeWidth="2"/>
          </PointingGroup>
          
          {/* Legs */}
          <line x1="20" y1="45" x2="15" y2="55" stroke="#000" strokeWidth="2"/>
          <line x1="20" y1="45" x2="25" y2="55" stroke="#000" strokeWidth="2"/>
        </AnimatedGroup>
        
        {/* Character ID Label */}
        <text 
          x="20" 
          y="65" 
          textAnchor="middle" 
          fontSize="8" 
          fill="#666"
          style={{ transform: getFacingTransform() }}
        >
          {id}
        </text>
      </SVGContainer>
    </CharacterContainer>
  );
}

export default StickmanCharacter;
