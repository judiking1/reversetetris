import { useState, useCallback } from 'react';
import { Board, Piece, Position } from '../types/tetris';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 500;

const SHAPES: number[][][] = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
];

export const useGameLogic = () => {
  const [board, setBoard] = useState<Board>(
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  const createNewPiece = useCallback((): Piece => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIndex];
    const x = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
    const y = BOARD_HEIGHT - 1; // 조각이 보드 상단에서 시작
    return { shape, x, y };
  }, []);

  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    const newPiece = createNewPiece();
    setCurrentPiece(newPiece);
    setPosition({ x: newPiece.x, y: newPiece.y });
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  const checkCollision = (shape: number[][], posX: number, posY: number): boolean => {
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

  const mergePiece = (): Board => {
    const newBoard = board.map(row => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          const boardY = position.y - y;
          if (value && boardY >= 0 && boardY < BOARD_HEIGHT) {
            newBoard[boardY][position.x + x] = 1;
          }
        });
      });
    }
    return newBoard;
  };

  const clearLines = (currentBoard: Board): Board => {
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

  const movePiece = useCallback(
    (dx: number = 0, dy: number = 0): boolean => {
      if (!currentPiece) return false;

      const newX = position.x + dx;
      const newY = position.y + dy;

      if (!checkCollision(currentPiece.shape, newX, newY)) {
        setPosition({ x: newX, y: newY });
        return true;
      } else if (dy < 0) {
        const newBoard = clearLines(mergePiece());
        setBoard(newBoard);
        const newPiece = createNewPiece();
        if (checkCollision(newPiece.shape, newPiece.x, newPiece.y)) {
          setGameOver(true);
        } else {
          setCurrentPiece(newPiece);
          setPosition({ x: newPiece.x, y: newPiece.y });
        }
      }
      return false;
    },
    [currentPiece, position]
  );

  const dropPiece = useCallback(() => {
    if (!currentPiece) return;

    let newY = position.y;
    while (!checkCollision(currentPiece.shape, position.x, newY - 1)) {
      newY--;
    }
    // 바닥까지 즉시 이동 후 병합 및 새 조각 생성
    const newBoard = clearLines(mergePiece());
    setBoard(newBoard);
    const newPiece = createNewPiece();
    if (checkCollision(newPiece.shape, newPiece.x, newPiece.y)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
      setPosition({ x: newPiece.x, y: newPiece.y });
    }
  }, [currentPiece, position]);

  const rotatePiece = useCallback(() => {
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

    if (!checkCollision(rotated, offsetX, position.y)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
      setPosition(prev => ({ ...prev, x: offsetX }));
      // 회전 후 즉시 아래로 이동
      movePiece(0, -1);
    }
  }, [currentPiece, position, movePiece]);

  return {
    board,
    currentPiece,
    position,
    gameOver,
    score,
    speed,
    startGame,
    movePiece,
    dropPiece,
    rotatePiece,
  };
};