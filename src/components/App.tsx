import { useChessGame } from '../hooks/useChessGame';
import { MainMenu } from './MainMenu';
import { Board } from './Board';
import { GameInfo } from './GameInfo';
import { PromotionModal } from './PromotionModal';
import { GameOverModal } from './GameOverModal';
import '../styles/App.css';
import '../styles/Board.css';

export function App() {
  const {
    gameState,
    selectedSquare,
    legalMoves,
    gameResult,
    isAiThinking,
    pendingPromotion,
    settings,
    handleSquareClick,
    handlePromotion,
    resetGame,
    startGame,
    goToMenu,
  } = useChessGame();

  if (settings.mode === 'menu') {
    return (
      <div className="app">
        <MainMenu onStartGame={startGame} />
      </div>
    );
  }

  // Determine if board should be flipped
  // For Pass and Play: flip based on whose turn it is
  // For VS AI: flip if player is black (static, doesn't change)
  const shouldFlipBoard =
    settings.mode === 'pass-and-play'
      ? gameState.turn === 'black'
      : settings.playerColor === 'black';

  return (
    <div className="app">
      <button className="back-button" onClick={goToMenu}>
        Menu
      </button>
      <div className="game-container">
        <GameInfo
          turn={gameState.turn}
          isAiThinking={isAiThinking}
          status={
            settings.mode === 'pass-and-play'
              ? 'Pass and Play'
              : `VS AI (${settings.difficulty})`
          }
        />
        <Board
          gameState={gameState}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          flipped={shouldFlipBoard}
          onSquareClick={handleSquareClick}
        />
      </div>

      {pendingPromotion && (
        <PromotionModal color={gameState.turn} onSelect={handlePromotion} />
      )}

      {gameResult && (
        <GameOverModal
          result={gameResult}
          onNewGame={resetGame}
          onMainMenu={goToMenu}
        />
      )}
    </div>
  );
}
