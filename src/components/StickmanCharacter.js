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
  animation: ${props => {
    if (props.animationState === 'running') {
      return 'running 0.4s ease-in-out infinite';
    } else if (props.animationState === 'laughing') {
      return 'laughing 0.5s ease-in-out infinite';
    } else if (props.isAnimating) {
      return 'bounce 0.6s ease-in-out infinite alternate';
    }
    return 'none';
  }};
  
  @keyframes bounce {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-5px); }
  }
  
  @keyframes running {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-2px) translateX(1px); }
    50% { transform: translateY(0px) translateX(0px); }
    75% { transform: translateY(-2px) translateX(-1px); }
  }
  
  @keyframes laughing {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-3px) rotate(-2deg); }
    50% { transform: translateY(-5px) rotate(0deg); }
    75% { transform: translateY(-3px) rotate(2deg); }
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
  isAnimating = false,
  features = {}, // e.g., { glasses: true, hat: false, beard: false }
  animationState = 'idle' // 'idle', 'running', 'laughing', 'sitting'
}) {
  const [isPointing, setIsPointing] = useState(false);

  useEffect(() => {
    if (isAnimating && animationState === 'idle') {
      setIsPointing(true);
      const timer = setTimeout(() => {
        setIsPointing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, animationState]);

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
    if (animationState === 'laughing') {
      return 'M 12 25 Q 20 35 28 25'; // Wide open laughing mouth
    } else if (animationState === 'running') {
      return 'M 15 25 Q 20 28 25 25'; // Slightly open mouth
    } else if (isActive) {
      return 'M 15 25 Q 20 30 25 25'; // Smile
    }
    return 'M 15 25 Q 20 22 25 25'; // Neutral
  };

  const getBodyY = () => {
    if (animationState === 'sitting') {
      return { start: 23, end: 50 }; // Longer body for sitting
    }
    return { start: 23, end: 45 }; // Normal body
  };

  const getArms = () => {
    const bodyY = getBodyY();
    
    if (animationState === 'running') {
      // Running arms - bent and moving
      return (
        <>
          <line x1="20" y1="30" x2="12" y2="35" stroke="#000" strokeWidth="2"/>
          <line x1="20" y1="30" x2="28" y2="38" stroke="#000" strokeWidth="2"/>
        </>
      );
    } else if (animationState === 'laughing') {
      // Laughing arms - raised up
      return (
        <>
          <line x1="20" y1="30" x2="15" y2="25" stroke="#000" strokeWidth="2"/>
          <line x1="20" y1="30" x2="25" y2="25" stroke="#000" strokeWidth="2"/>
        </>
      );
    } else if (animationState === 'sitting') {
      // Sitting arms - on sides
      return (
        <>
          <line x1="20" y1="35" x2="15" y2="45" stroke="#000" strokeWidth="2"/>
          <line x1="20" y1="35" x2="25" y2="45" stroke="#000" strokeWidth="2"/>
        </>
      );
    } else {
      // Normal arms
      return (
        <>
          <line x1="20" y1="30" x2="15" y2="40" stroke="#000" strokeWidth="2"/>
          <PointingGroup isPointing={isPointing}>
            <line x1="20" y1="30" x2="25" y2="40" stroke="#000" strokeWidth="2"/>
            <line x1="25" y1="40" x2="28" y2="38" stroke="#000" strokeWidth="2"/>
          </PointingGroup>
        </>
      );
    }
  };

  const getLegs = () => {
    const bodyY = getBodyY();
    
    if (animationState === 'running') {
      // Running legs - bent and spread
      return (
        <>
          <line x1="20" y1={bodyY.end} x2="15" y2="58" stroke="#000" strokeWidth="2"/>
          <line x1="20" y1={bodyY.end} x2="25" y2="58" stroke="#000" strokeWidth="2"/>
        </>
      );
    } else if (animationState === 'sitting') {
      // Sitting legs - bent at knees
      return (
        <>
          <line x1="20" y1={bodyY.end} x2="18" y2="58" stroke="#000" strokeWidth="2"/>
          <line x1="20" y1={bodyY.end} x2="22" y2="58" stroke="#000" strokeWidth="2"/>
          {/* Chair representation */}
          <line x1="12" y1="58" x2="28" y2="58" stroke="#000" strokeWidth="2" strokeDasharray="2,2"/>
        </>
      );
    } else {
      // Normal legs
      return (
        <>
          <line x1="20" y1={bodyY.end} x2="15" y2="55" stroke="#000" strokeWidth="2"/>
          <line x1="20" y1={bodyY.end} x2="25" y2="55" stroke="#000" strokeWidth="2"/>
        </>
      );
    }
  };

  const bodyY = getBodyY();

  return (
    <CharacterContainer x={x} y={y}>
      <SVGContainer 
        viewBox="0 0 40 60" 
        isActive={isActive}
        style={{ transform: getFacingTransform() }}
      >
        <AnimatedGroup isAnimating={isAnimating} animationState={animationState}>
          {/* Head */}
          <circle cx="20" cy="15" r="8" fill="none" stroke="#000" strokeWidth="2"/>
          
          {/* Hat (rendered before eyes so it appears on top) */}
          {features.hat && (
            <g>
              <ellipse cx="20" cy="8" rx="9" ry="3" fill="#000" />
              <rect x="16" y="8" width="8" height="4" fill="#000" />
            </g>
          )}
          
          {/* Glasses (rendered before eyes) */}
          {features.glasses && (
            <g>
              {/* Left lens */}
              <circle cx="17" cy="12" r="3.5" fill="none" stroke="#000" strokeWidth="1.5" />
              {/* Right lens */}
              <circle cx="23" cy="12" r="3.5" fill="none" stroke="#000" strokeWidth="1.5" />
              {/* Bridge */}
              <line x1="20.5" y1="12" x2="19.5" y2="12" stroke="#000" strokeWidth="1.5" />
            </g>
          )}
          
          {/* Eyes */}
          <Eye cx="17" cy="12" r="1.5" />
          <Eye cx="23" cy="12" r="1.5" />
          
          {/* Beard */}
          {features.beard && (
            <path d="M 14 18 Q 20 22 26 18 Q 20 25 14 18" fill="#000" opacity="0.6" />
          )}
          
          {/* Mustache */}
          {features.mustache && (
            <path d="M 15 20 Q 20 21 25 20" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          )}
          
          {/* Mouth */}
          <Mouth d={getMouthExpression()} />
          
          {/* Body */}
          <line x1="20" y1={bodyY.start} x2="20" y2={bodyY.end} stroke="#000" strokeWidth="2"/>
          
          {/* Arms */}
          {getArms()}
          
          {/* Legs */}
          {getLegs()}
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
