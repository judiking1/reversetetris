import { useEffect, useRef, useCallback } from 'react';
import { GameState } from '../types/tetris';

interface UseGameLoopProps {
  gameState: GameState;
  onTick: () => void;
}

export const useGameLoop = ({
  gameState,
  onTick
}: UseGameLoopProps) => {
  const lastTickRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTickRef.current) {
      lastTickRef.current = timestamp;
    }

    const elapsed = timestamp - lastTickRef.current;

    if (elapsed >= gameState.speed) {
      onTick();
      lastTickRef.current = timestamp;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.speed, onTick]);

  useEffect(() => {
    if (!gameState.gameOver && gameState.currentPiece) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState.gameOver, gameState.currentPiece, gameLoop]);
};