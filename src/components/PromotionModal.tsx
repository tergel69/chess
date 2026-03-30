import type { PieceType, Color } from '../game/types';
import '../styles/components.css';

const PIECE_SYMBOLS: Record<Color, Record<string, string>> = {
  white: {
    queen: '\u2655',
    rook: '\u2656',
    bishop: '\u2657',
    knight: '\u2658',
  },
  black: {
    queen: '\u265B',
    rook: '\u265C',
    bishop: '\u265D',
    knight: '\u265E',
  },
};

interface PromotionModalProps {
  color: Color;
  onSelect: (pieceType: PieceType) => void;
}

export function PromotionModal({ color, onSelect }: PromotionModalProps) {
  const pieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <div className="modal-overlay">
      <div className="promotion-modal">
        <h3>Choose promotion piece</h3>
        <div className="promotion-pieces">
          {pieces.map((piece) => (
            <button
              key={piece}
              className="promotion-piece"
              onClick={() => onSelect(piece)}
            >
              {PIECE_SYMBOLS[color][piece]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
