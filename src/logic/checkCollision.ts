import { Board } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../hooks/useGameState';

export const checkCollision = (
  shape: number[][],
  posX: number,
  posY: number,
  board: Board
): boolean => {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newY = posY - y;
        const newX = posX + x;
        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY < 0 ||
          (newY < BOARD_HEIGHT && board[newY][newX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
};