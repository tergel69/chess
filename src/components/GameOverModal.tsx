import type { GameResult } from '../game/types';
import '../styles/components.css';

interface GameOverModalProps {
  result: GameResult;
  onNewGame: () => void;
  onMainMenu: () => void;
}

export function GameOverModal({ result, onNewGame, onMainMenu }: GameOverModalProps) {
  const getTitle = () => {
    switch (result) {
      case 'white-wins':
        return 'White Wins!';
      case 'black-wins':
        return 'Black Wins!';
      case 'draw':
        return 'Draw!';
      case 'stalemate':
        return 'Stalemate!';
      default:
        return 'Game Over';
    }
  };

  const getMessage = () => {
    switch (result) {
      case 'white-wins':
        return 'White has checkmated Black.';
      case 'black-wins':
        return 'Black has checkmated White.';
      case 'draw':
        return 'The game ended in a draw.';
      case 'stalemate':
        return 'No legal moves available - stalemate!';
      default:
        return '';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{getTitle()}</h2>
        <p>{getMessage()}</p>
        <div className="modal-buttons">
          <button className="modal-button primary" onClick={onNewGame}>
            New Game
          </button>
          <button className="modal-button secondary" onClick={onMainMenu}>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
