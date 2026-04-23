import type { Piece, PieceType, CastlingRights, GameState, TimeSettings, Achievement, Opening } from './types';

export const BOARD_SIZE = 8;

export const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

// Piece-square tables for positional evaluation (from white's perspective)
// Values encourage pieces to move to strategically good squares
export const PAWN_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

export const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

export const BISHOP_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

export const ROOK_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
];

export const QUEEN_TABLE = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-5,  0,  5,  5,  5,  5,  0, -5],
  [0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
];

export const KING_MIDDLE_TABLE = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
];

export const KING_END_TABLE = [
  [-50,-40,-30,-20,-20,-30,-40,-50],
  [-30,-20,-10,  0,  0,-10,-20,-30],
  [-30,-10, 20, 30, 30, 20,-10,-30],
  [-30,-10, 30, 40, 40, 30,-10,-30],
  [-30,-10, 30, 40, 40, 30,-10,-30],
  [-30,-10, 20, 30, 30, 20,-10,-30],
  [-30,-30,  0,  0,  0,  0,-30,-30],
  [-50,-30,-30,-30,-30,-30,-30,-50]
];

export function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  // Set up black pieces (row 0 and 1)
  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRow[col], color: 'black' };
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
    board[7][col] = { type: backRow[col], color: 'white' };
  }

  return board;
}

export function createInitialCastlingRights(): CastlingRights {
  return {
    white: { kingside: true, queenside: true },
    black: { kingside: true, queenside: true },
  };
}

export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    turn: 'white',
    castlingRights: createInitialCastlingRights(),
    enPassantTarget: null,
    moveHistory: [],
    halfMoveClock: 0,
    fullMoveNumber: 1,
    capturedPieces: { white: [], black: [] },
    lastMove: null,
  };
}

export const TIME_CONTROLS: Record<string, TimeSettings> = {
  bullet: { initialTime: 60, increment: 0 },
  blitz: { initialTime: 300, increment: 2 },
  rapid: { initialTime: 600, increment: 5 },
  classical: { initialTime: 1800, increment: 10 },
  custom: { initialTime: 600, increment: 0 },
};

export const BOARD_THEMES = {
  classic: { light: '#eeeed2', dark: '#769656' },
  blue: { light: '#dee3e6', dark: '#4a6f8a' },
  green: { light: '#f0f0f0', dark: '#3d6b3d' },
  brown: { light: '#f5dcb3', dark: '#8b5a2b' },
  gray: { light: '#e8e8e8', dark: '#5a5a5a' },
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', name: 'First Victory', description: 'Win your first game', icon: '🏆', unlocked: false },
  { id: 'checkmate_master', name: 'Checkmate Master', description: 'Deliver 10 checkmates', icon: '♔', unlocked: false },
  { id: 'puzzle_solver', name: 'Puzzle Solver', description: 'Solve 5 puzzles', icon: '🧩', unlocked: false },
  { id: 'win_streak_5', name: 'On Fire', description: 'Win 5 games in a row', icon: '🔥', unlocked: false },
  { id: 'grandmaster_defeat', name: 'Giant Slayer', description: 'Defeat a Grandmaster AI', icon: '⚔️', unlocked: false },
];

export const OPENINGS: Opening[] = [
  { name: "Italian Game", eco: "C50", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"], description: "A classic opening focusing on rapid development" },
  { name: "Sicilian Defense", eco: "B20", moves: ["e4", "c5"], description: "The most popular response to 1.e4" },
  { name: "Ruy Lopez", eco: "C60", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"], description: "One of the oldest and most respected openings" },
  { name: "Queen's Gambit", eco: "D06", moves: ["d4", "d5", "c4"], description: "White offers a pawn for central control" },
];
