import { Board, Piece, Position } from '../types/tetris';
import { checkCollision } from '../logic/checkCollision';
import { mergePiece, clearLines } from '../logic/manageBoard';
import { createPiece } from '../logic/createPiece';

interface MovePieceProps {
  board: Board;
  currentPiece: Piece | null;
  position: Position;
  setBoard: (board: Board) => void;
  setCurrentPiece: (piece: Piece | null) => void;
  setPosition: (position: Position) => void;
  setGameOver: (gameOver: boolean) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setSpeed: (speed: number | ((prev: number) => number)) => void;
}

export const movePiece = ({
  board,
  currentPiece,
  position,
  setBoard,
  setCurrentPiece,
  setPosition,
  setGameOver,
  setScore,
  setSpeed,
}: MovePieceProps) => (dx: number = 0, dy: number = 0): boolean => {
  if (!currentPiece) return false;

  const newX = position.x + dx;
  const newY = position.y + dy;

  if (!checkCollision(currentPiece.shape, newX, newY, board)) {
    setPosition({ x: newX, y: newY });
    return true;
  } else if (dy < 0) {
    const newBoard = clearLines(mergePiece(board, currentPiece, position), setScore, setSpeed);
    setBoard(newBoard);
    const newPiece = createPiece();
    if (checkCollision(newPiece.shape, newPiece.x, newPiece.y, newBoard)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
      setPosition({ x: newPiece.x, y: newPiece.y });
    }
  }
  return false;
};