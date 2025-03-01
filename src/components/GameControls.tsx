import React from 'react';
import '../styles/GameControls.css';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onDrop: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onDrop
}) => {
  return (
    <div className="game-controls">
      <div className="control-row">
        <button onClick={onRotate}>Rotate</button>
      </div>
      <div className="control-row">
        <button onClick={onMoveLeft}>Left</button>
        <button onClick={onMoveDown}>Down</button>
        <button onClick={onMoveRight}>Right</button>
      </div>
      <div className="control-row">
        <button onClick={onDrop}>Drop</button>
      </div>
    </div>
  );
};

export default GameControls;