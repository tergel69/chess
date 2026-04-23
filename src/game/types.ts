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
  isCheck?: boolean;
  isCapture?: boolean;
  symbol?: string;
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
  capturedPieces: { white: PieceType[]; black: PieceType[] };
  lastMove: Move | null;
}

export type GameMode = 'menu' | 'pass-and-play' | 'vs-ai' | 'puzzle' | 'analysis' | 'online' | 'computer-analysis';
export type Difficulty = 'beginner' | 'intermediate' | 'master' | 'grandmaster';
export type PuzzleDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TimeControl = 'bullet' | 'blitz' | 'rapid' | 'classical' | 'custom';

export interface TimeSettings {
  initialTime: number; // in seconds
  increment: number; // in seconds
}

export interface GameSettings {
  mode: GameMode;
  difficulty?: Difficulty;
  puzzleDifficulty?: PuzzleDifficulty;
  playerColor?: Color;
  playerElo?: number;
  timeControl?: TimeControl;
  timeSettings?: TimeSettings;
  showCoordinates?: boolean;
  showMoveHints?: boolean;
  showLegalMoves?: boolean;
  soundEnabled?: boolean;
  autoPromote?: boolean;
  boardTheme?: 'classic' | 'blue' | 'green' | 'brown' | 'gray';
  pieceTheme?: 'classic' | 'modern' | 'minimal';
  enableEngineAnalysis?: boolean;
  engineDepth?: number;
}

export type GameResult = 'white-wins' | 'black-wins' | 'draw' | 'stalemate' | 'timeout' | 'resignation' | 'repetition' | 'fifty-move' | null;

export interface PlayerProfile {
  username: string;
  elo: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestWinStreak: number;
  totalTimePlayed: number;
  favoriteOpening: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface Opening {
  name: string;
  eco: string;
  moves: string[];
  description: string;
}

export interface AnalysisEval {
  score: number;
  depth: number;
  bestMove?: Move;
  pv?: Move[];
}
