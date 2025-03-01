import { Board, Piece, Position, GameState } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT, SHAPES } from '../hooks/useGameState';

export const createPiece = (): Piece => {
  const shapeIndex = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[shapeIndex];
  const x = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
  const y = BOARD_HEIGHT - 1;
  return { shape, x, y };
};

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

export const clearLines = (currentBoard: Board): {
  board: Board;
  linesCleared: number;
} => {
  let linesCleared = 0;
  const newBoard = currentBoard.filter(row => {
    const isFull = row.every(cell => cell === 1);
    if (isFull) linesCleared++;
    return !isFull;
  });

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.push(Array(BOARD_WIDTH).fill(0));
  }

  return {
    board: newBoard,
    linesCleared
  };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const basePoints = [0, 40, 100, 300, 1200];
  return basePoints[linesCleared] * level;
};

export const calculateLevel = (totalLinesCleared: number): number => {
  return Math.floor(totalLinesCleared / 10) + 1;
};

export const calculateSpeed = (level: number): number => {
  return Math.max(100, 1000 - (level - 1) * 100);
};

export const rotatePiece = (piece: Piece): number[][] => {
  return piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
};

export const getUpdatedGameState = (
  currentState: GameState,
  updates: Partial<GameState>
): GameState => {
  const newState = { ...currentState, ...updates };
  
  if (updates.linesCleared !== undefined) {
    const totalLinesCleared = currentState.linesCleared + updates.linesCleared;
    const level = calculateLevel(totalLinesCleared);
    const speed = calculateSpeed(level);
    const score = currentState.score + calculateScore(updates.linesCleared, level);
    
    Object.assign(newState, {
      linesCleared: totalLinesCleared,
      level,
      speed,
      score
    });
  }
  
  return newState;
}; 