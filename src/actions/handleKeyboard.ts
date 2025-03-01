import { useEffect } from 'react';

interface HandleKeyboardProps {
  movePiece: (dx: number, dy: number) => boolean;
  rotatePiece: () => void;
  dropPiece: () => void;
  gameOver: boolean;
}

export const handleKeyboard = ({
  movePiece,
  rotatePiece,
  dropPiece,
  gameOver,
}: HandleKeyboardProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, -1);
          break;
        case ' ':
          dropPiece();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotatePiece, dropPiece, gameOver]);
};