import { useState, useCallback } from 'react';
import { Board, GameState } from '../types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const INITIAL_SPEED = 500;

export const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
];

const createEmptyBoard = (): Board => 
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    position: { x: 0, y: 0 },
    gameOver: false,
    score: 0,
    speed: INITIAL_SPEED,
    level: 1,
    linesCleared: 0
  });

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: null,
      position: { x: 0, y: 0 },
      gameOver: false,
      score: 0,
      speed: INITIAL_SPEED,
      level: 1,
      linesCleared: 0
    });
  }, []);

  return {
    gameState,
    updateGameState,
    resetGame
  };
};