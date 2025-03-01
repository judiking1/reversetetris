export type Board = number[][];

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  shape: number[][];
  x: number;
  y: number;
}

export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  position: Position;
  gameOver: boolean;
  score: number;
  speed: number;
  level: number;
  linesCleared: number;
}