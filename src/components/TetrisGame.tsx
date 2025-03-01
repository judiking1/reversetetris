import React, { useEffect } from 'react';
import Board from './Board';
import GameInfo from './GameInfo';
import GameControls from './GameControls';
import { useGameState } from '../hooks/useGameState';
import { useGameController } from '../hooks/useGameController';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { createPiece } from '../logic/gameLogic';
import '../styles/TetrisGame.css';

const TetrisGame: React.FC = () => {
  const { gameState, updateGameState, resetGame } = useGameState();
  const { movePiece, rotatePiece, dropPiece } = useGameController({
    gameState,
    updateGameState
  });

  useGameLoop({
    gameState,
    onTick: () => movePiece(0, -1)
  });

  useKeyboardControls({
    movePiece,
    rotatePiece,
    dropPiece,
    gameOver: gameState.gameOver
  });

  useEffect(() => {
    if (!gameState.currentPiece) {
      const newPiece = createPiece();
      updateGameState({
        currentPiece: newPiece,
        position: { x: newPiece.x, y: newPiece.y }
      });
    }
  }, [gameState.currentPiece, updateGameState]);

  return (
    <div className="tetris-container">
      <div className="game-wrapper">
        <GameInfo
          score={gameState.score}
          level={gameState.level}
          linesCleared={gameState.linesCleared}
          gameOver={gameState.gameOver}
          onRestart={resetGame}
        />
        <div className="game-content">
          <Board
            board={gameState.board}
            currentPiece={gameState.currentPiece}
            position={gameState.position}
          />
          <GameControls
            onMoveLeft={() => movePiece(-1, 0)}
            onMoveRight={() => movePiece(1, 0)}
            onMoveDown={() => movePiece(0, -1)}
            onRotate={rotatePiece}
            onDrop={dropPiece}
          />
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;