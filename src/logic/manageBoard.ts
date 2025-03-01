import { Board, Piece, Position } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../hooks/useGameState';

export const mergePiece = (board: Board, piece: Piece, position: Position): Board => {
  const newBoard = board.map(row => [...row]);
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      const boardY = position.y - y;
      if (value && boardY >= 0 && boardY < BOARD_HEIGHT) {
        newBoard[boardY][position.x + x] = 1;
      }
    });
  });
  return newBoard;
};

export const clearLines = (
  currentBoard: Board,
  setScore: (score: number | ((prev: number) => number)) => void,
  setSpeed: (speed: number | ((prev: number) => number)) => void
): Board => {
  let linesCleared = 0;
  const newBoard = currentBoard.filter(row => {
    const isFull = row.every(cell => cell === 1);
    if (isFull) linesCleared++;
    return !isFull;
  });

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.push(Array(BOARD_WIDTH).fill(0));
  }

  if (linesCleared > 0) {
    setScore(prev => prev + linesCleared * 100);
    setSpeed(prev => Math.max(100, prev - linesCleared * 20));
  }
  return newBoard;
};