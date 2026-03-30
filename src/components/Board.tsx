import type { GameState, Position, Move } from '../game/types';
import { Square } from './Square';
import { isInCheck, findKing } from '../game/moves';
import '../styles/Board.css';

interface BoardProps {
  gameState: GameState;
  selectedSquare: Position | null;
  legalMoves: Move[];
  flipped: boolean;
  onSquareClick: (position: Position) => void;
}

export function Board({
  gameState,
  selectedSquare,
  legalMoves,
  flipped,
  onSquareClick,
}: BoardProps) {
  const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
  const kingInCheck = isInCheck(gameState.board, gameState.turn);
  const checkedKingPos = kingInCheck ? findKing(gameState.board, gameState.turn) : null;

  const renderBoard = () => {
    const squares = [];

    // When flipped, render from row 7 to 0 and col 7 to 0
    // When not flipped, render from row 0 to 7 and col 0 to 7
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const row = flipped ? 7 - i : i;
        const col = flipped ? 7 - j : j;
        const position: Position = { row, col };
        const piece = gameState.board[row][col];
        const isLight = (row + col) % 2 === 0;

        const isSelected =
          selectedSquare?.row === row && selectedSquare?.col === col;

        const isLegalMove = legalMoves.some(
          (move) => move.to.row === row && move.to.col === col
        );

        const isLastMove =
          lastMove &&
          ((lastMove.from.row === row && lastMove.from.col === col) ||
            (lastMove.to.row === row && lastMove.to.col === col));

        const isCheck =
          checkedKingPos?.row === row && checkedKingPos?.col === col;

        squares.push(
          <Square
            key={`${row}-${col}`}
            position={position}
            piece={piece}
            isLight={isLight}
            isSelected={isSelected}
            isLegalMove={isLegalMove}
            isLastMove={!!isLastMove}
            isCheck={isCheck}
            flipped={flipped}
            onClick={() => onSquareClick(position)}
            showCoordinates={true}
          />
        );
      }
    }

    return squares;
  };

  return (
    <div className="board-wrapper">
      <div className="board">{renderBoard()}</div>
    </div>
  );
}
