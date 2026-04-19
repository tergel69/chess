import { useChessGame } from '../hooks/useChessGame';
import { MainMenu } from './MainMenu';
import { Board } from './Board';
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
        <header className="header">
          <div className="header-logo">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 22H5v-2h14v2zM17 2H7v2h10V2zm-2 4H9v2h6V6zm-1 4h-4v2h4v-2z"/>
            </svg>
            <span>Chess</span>
          </div>
          <nav className="header-nav">
            <button className="nav-btn active">Play</button>
            <button className="nav-btn">Puzzles</button>
            <button className="nav-btn">Learn</button>
            <button className="nav-btn">Watch</button>
          </nav>
          <div className="user-section">
            <div className="user-avatar">U</div>
          </div>
        </header>
        <MainMenu onStartGame={startGame} />
      </div>
    );
  }

  // Determine if board should be flipped
  const shouldFlipBoard =
    settings.mode === 'pass-and-play'
      ? gameState.turn === 'black'
      : settings.playerColor === 'black';

  // Get AI rating based on difficulty
  const getAiRating = () => {
    switch (settings.difficulty) {
      case 'master': return '2800';
      case 'intermediate': return '1800';
      case 'beginner': 
      default: return '1200';
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 22H5v-2h14v2zM17 2H7v2h10V2zm-2 4H9v2h6V6zm-1 4h-4v2h4v-2z"/>
          </svg>
          <span>Chess</span>
        </div>
        <nav className="header-nav">
          <button className="nav-btn active">Play</button>
          <button className="nav-btn">Puzzles</button>
          <button className="nav-btn">Learn</button>
          <button className="nav-btn">Watch</button>
        </nav>
        <div className="user-section">
          <div className="user-avatar">U</div>
        </div>
      </header>

      <button className="back-button" onClick={goToMenu}>
        ← Menu
      </button>

      <div className="game-container">
        <div className="board-section">
          {/* Black player bar */}
          <div className="player-bar">
            <div className="player-info">
              <div className="player-avatar-small">
                {settings.mode === 'pass-and-play' ? 'P2' : 'AI'}
              </div>
              <span className="player-name">
                {settings.mode === 'pass-and-play' ? 'Player 2' : 'Stockfish'}
              </span>
              <span className="player-rating">
                {settings.mode === 'pass-and-play' ? '-' : getAiRating()}
              </span>
            </div>
            <div className={`timer ${gameState.turn === 'black' ? 'active' : ''}`}>
              10:00
            </div>
          </div>

          <Board
            gameState={gameState}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            flipped={shouldFlipBoard}
            onSquareClick={handleSquareClick}
          />

          {/* White player bar */}
          <div className="player-bar">
            <div className="player-info">
              <div className="player-avatar-small">You</div>
              <span className="player-name">Player</span>
              <span className="player-rating">1500</span>
            </div>
            <div className={`timer ${gameState.turn === 'white' ? 'active' : ''}`}>
              10:00
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Move History</h3>
            <div className="move-history-sidebar">
              <div className="move-row">
                <span className="move-number">1.</span>
                <span className="move-white">e4</span>
                <span className="move-black">e5</span>
              </div>
              <div className="move-row">
                <span className="move-number">2.</span>
                <span className="move-white">Nf3</span>
                <span className="move-black">Nc6</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section game-actions">
            <button className="action-btn primary" onClick={resetGame}>New Game</button>
            <button className="action-btn">Undo Move</button>
            <button className="action-btn">Resign</button>
            <button className="action-btn">Draw</button>
          </div>

          <div className="chat-section">
            <div className="chat-messages">
              <p>Good luck! Have fun!</p>
            </div>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Send a message..."
            />
          </div>
        </aside>
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
