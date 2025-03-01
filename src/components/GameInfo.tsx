import React from 'react';
import '../styles/GameInfo.css';

interface GameInfoProps {
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  onRestart: () => void;
}

const GameInfo: React.FC<GameInfoProps> = ({
  score,
  level,
  linesCleared,
  gameOver,
  onRestart
}) => {
  return (
    <div className="game-info">
      <div className="stats">
        <div>Score: {score}</div>
        <div>Level: {level}</div>
        <div>Lines: {linesCleared}</div>
      </div>
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <button onClick={onRestart}>New Game</button>
        </div>
      )}
    </div>
  );
};

export default GameInfo;