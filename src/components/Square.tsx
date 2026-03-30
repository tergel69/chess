import type { Piece as PieceType, Position } from '../game/types';
import { Piece } from './Piece';

interface SquareProps {
  position: Position;
  piece: PieceType | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  flipped: boolean;
  onClick: () => void;
  showCoordinates?: boolean;
}

export function Square({
  position,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isLastMove,
  isCheck,
  flipped,
  onClick,
  showCoordinates,
}: SquareProps) {
  const classNames = [
    'square',
    isLight ? 'light' : 'dark',
    isSelected && 'selected',
    isLegalMove && (piece ? 'legal-capture' : 'legal-move'),
    isLastMove && 'last-move',
    isCheck && 'check',
  ]
    .filter(Boolean)
    .join(' ');

  const files = 'abcdefgh';
  // Show coordinates on the edge squares based on board orientation
  const showFile = flipped ? position.row === 0 : position.row === 7;
  const showRank = flipped ? position.col === 7 : position.col === 0;

  return (
    <div className={classNames} onClick={onClick}>
      {piece && <Piece piece={piece} />}
      {showCoordinates && showFile && (
        <span className="coordinates file">{files[position.col]}</span>
      )}
      {showCoordinates && showRank && (
        <span className="coordinates rank">{8 - position.row}</span>
      )}
    </div>
  );
}
