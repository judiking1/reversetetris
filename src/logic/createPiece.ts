import { BOARD_HEIGHT, BOARD_WIDTH, SHAPES } from '../hooks/useGameState';
import { Piece } from '../types/tetris';

export const createPiece = (): Piece => {
  const shapeIndex = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[shapeIndex];
  const x = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
  const y = BOARD_HEIGHT - 1; // 상단에서 시작
  return { shape, x, y };
};