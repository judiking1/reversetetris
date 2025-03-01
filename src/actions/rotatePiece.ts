import { Board, Piece, Position } from '../types/tetris';
import { checkCollision } from '../logic/checkCollision';
import { BOARD_WIDTH } from '../hooks/useGameState';

interface RotatePieceProps {
  board: Board;
  currentPiece: Piece | null;
  position: Position;
  setCurrentPiece: (piece: Piece | null) => void;
  setPosition: (position: Position) => void;
}

export const rotatePiece = ({
  board,
  currentPiece,
  position,
  setCurrentPiece,
  setPosition,
}: RotatePieceProps) => () => {
  if (!currentPiece) return;

  const rotated = currentPiece.shape[0].map((_, index) =>
    currentPiece.shape.map(row => row[index]).reverse()
  );

  let offsetX = position.x;
  if (offsetX + rotated[0].length > BOARD_WIDTH) {
    offsetX = BOARD_WIDTH - rotated[0].length;
  } else if (offsetX < 0) {
    offsetX = 0;
  }

  if (!checkCollision(rotated, offsetX, position.y, board)) {
    setCurrentPiece({ shape: rotated, x: offsetX, y: position.y });
    setPosition({ x: offsetX, y: position.y });
  }
};