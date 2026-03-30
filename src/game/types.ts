export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type Color = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  promotion?: PieceType;
  castling?: 'kingside' | 'queenside';
  enPassant?: boolean;
  capturedPiece?: Piece;
}

export interface CastlingRights {
  white: { kingside: boolean; queenside: boolean };
  black: { kingside: boolean; queenside: boolean };
}

export interface GameState {
  board: (Piece | null)[][];
  turn: Color;
  castlingRights: CastlingRights;
  enPassantTarget: Position | null;
  moveHistory: Move[];
  halfMoveClock: number;
  fullMoveNumber: number;
}

export type GameMode = 'menu' | 'pass-and-play' | 'vs-ai';
export type Difficulty = 'beginner' | 'intermediate' | 'master';

export interface GameSettings {
  mode: GameMode;
  difficulty?: Difficulty;
  playerColor?: Color;
  playerElo?: number;
}

export type GameResult = 'white-wins' | 'black-wins' | 'draw' | 'stalemate' | null;
