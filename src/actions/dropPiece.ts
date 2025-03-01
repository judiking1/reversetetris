import { Board, Piece, Position } from '../types/tetris';
import { checkCollision } from '../logic/checkCollision';
import { mergePiece, clearLines } from '../logic/manageBoard';
import { createPiece } from '../logic/createPiece';

interface DropPieceProps {
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

export const dropPiece = ({
  board,
  currentPiece,
  position,
  setBoard,
  setCurrentPiece,
  setPosition,
  setGameOver,
  setScore,
  setSpeed,
}: DropPieceProps) => () => {
  if (!currentPiece) return;

  let newY = position.y;
  while (!checkCollision(currentPiece.shape, position.x, newY - 1, board)) {
    newY--;
  }
  const newPosition = { x: position.x, y: newY };
  const newBoard = clearLines(mergePiece(board, currentPiece, newPosition), setScore, setSpeed);
  setBoard(newBoard);
  const newPiece = createPiece();
  if (checkCollision(newPiece.shape, newPiece.x, newPiece.y, newBoard)) {
    setGameOver(true);
  } else {
    setCurrentPiece(newPiece);
    setPosition({ x: newPiece.x, y: newPiece.y });
  }
};