import React from 'react';
import { Board as BoardType, Piece, Position } from '../types/tetris';
import '../styles/TetrisGame.css';

interface BoardProps {
  board: BoardType;
  currentPiece: Piece | null;
  position: Position;
}

const Board: React.FC<BoardProps> = ({ board, currentPiece, position }) => {
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          const boardY = position.y - y;
          if (value && boardY >= 0 && boardY < board.length) {
            displayBoard[boardY][position.x + x] = 1;
          }
        });
      });
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="row">
        {row.map((cell, x) => (
          <div key={x} className={`cell ${cell ? 'filled' : ''}`} />
        ))}
      </div>
    ));
  };

  return <div className="game-board">{renderBoard()}</div>;
};

export default Board;