import { useCallback } from 'react';
import { GameState } from '../types/tetris';
import {
  checkCollision,
  createPiece,
  mergePiece,
  clearLines,
  rotatePiece,
  getUpdatedGameState
} from '../logic/gameLogic';

interface UseGameControllerProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export const useGameController = ({
  gameState,
  updateGameState
}: UseGameControllerProps) => {
  const movePiece = useCallback(
    (dx: number = 0, dy: number = 0): boolean => {
      if (!gameState.currentPiece || gameState.gameOver) return false;

      const newX = gameState.position.x + dx;
      const newY = gameState.position.y + dy;

      if (!checkCollision(gameState.currentPiece.shape, newX, newY, gameState.board)) {
        updateGameState({ position: { x: newX, y: newY } });
        return true;
      } else if (dy < 0) {
        const newBoard = mergePiece(gameState.board, gameState.currentPiece, gameState.position);
        const { board: clearedBoard, linesCleared } = clearLines(newBoard);
        const newPiece = createPiece();

        if (checkCollision(newPiece.shape, newPiece.x, newPiece.y, clearedBoard)) {
          updateGameState({ gameOver: true });
        } else {
          const newState = getUpdatedGameState(gameState, {
            board: clearedBoard,
            currentPiece: newPiece,
            position: { x: newPiece.x, y: newPiece.y },
            linesCleared
          });
          updateGameState(newState);
        }
      }
      return false;
    },
    [gameState, updateGameState]
  );

  const rotatePieceAction = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver) return;

    const rotatedShape = rotatePiece(gameState.currentPiece);
    let offsetX = gameState.position.x;

    if (offsetX + rotatedShape[0].length > gameState.board[0].length) {
      offsetX = gameState.board[0].length - rotatedShape[0].length;
    }

    if (!checkCollision(rotatedShape, offsetX, gameState.position.y, gameState.board)) {
      updateGameState({
        currentPiece: {
          ...gameState.currentPiece,
          shape: rotatedShape
        },
        position: {
          ...gameState.position,
          x: offsetX
        }
      });
    }
  }, [gameState, updateGameState]);

  const dropPiece = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver) return;

    let newY = gameState.position.y;
    while (!checkCollision(
      gameState.currentPiece.shape,
      gameState.position.x,
      newY - 1,
      gameState.board
    )) {
      newY--;
    }

    const newBoard = mergePiece(
      gameState.board,
      gameState.currentPiece,
      { ...gameState.position, y: newY }
    );
    const { board: clearedBoard, linesCleared } = clearLines(newBoard);
    const newPiece = createPiece();

    if (checkCollision(newPiece.shape, newPiece.x, newPiece.y, clearedBoard)) {
      updateGameState({ gameOver: true });
    } else {
      const newState = getUpdatedGameState(gameState, {
        board: clearedBoard,
        currentPiece: newPiece,
        position: { x: newPiece.x, y: newPiece.y },
        linesCleared
      });
      updateGameState(newState);
    }
  }, [gameState, updateGameState]);

  return {
    movePiece,
    rotatePiece: rotatePieceAction,
    dropPiece
  };
}; 