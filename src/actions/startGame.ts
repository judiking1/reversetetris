import { Board, Piece, Position } from '../types/tetris';
import { createPiece } from '../logic/createPiece';
import { BOARD_HEIGHT, BOARD_WIDTH, INITIAL_SPEED } from '../hooks/useGameState';

interface StartGameProps {
  setBoard: (board: Board) => void;
  setCurrentPiece: (piece: Piece | null) => void;
  setPosition: (position: Position) => void;
  setGameOver: (gameOver: boolean) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setSpeed: (speed: number | ((prev: number) => number)) => void;
}

export const startGame = ({
  setBoard,
  setCurrentPiece,
  setPosition,
  setGameOver,
  setScore,
  setSpeed,
}: StartGameProps) => () => {
  setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
  const newPiece = createPiece();
  setCurrentPiece(newPiece);
  setPosition({ x: newPiece.x, y: newPiece.y });
  setGameOver(false);
  setScore(0);
  setSpeed(INITIAL_SPEED);
};