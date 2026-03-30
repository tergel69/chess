import type { Piece as PieceType, Color, PieceType as PieceKind } from '../game/types';

const PIECE_SYMBOLS: Record<Color, Record<PieceKind, string>> = {
  white: {
    king: '\u2654',
    queen: '\u2655',
    rook: '\u2656',
    bishop: '\u2657',
    knight: '\u2658',
    pawn: '\u2659',
  },
  black: {
    king: '\u265A',
    queen: '\u265B',
    rook: '\u265C',
    bishop: '\u265D',
    knight: '\u265E',
    pawn: '\u265F',
  },
};

interface PieceProps {
  piece: PieceType;
}

export function Piece({ piece }: PieceProps) {
  const symbol = PIECE_SYMBOLS[piece.color][piece.type];

  return (
    <div className="piece">
      {symbol}
    </div>
  );
}
