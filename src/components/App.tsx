import { useChessGame } from '../hooks/useChessGame';
import { MainMenu } from './MainMenu';
import { Board } from './Board';
import { PromotionModal } from './PromotionModal';
import { GameOverModal } from './GameOverModal';
import '../styles/App.css';
import '../styles/Board.css';
import { useState, useMemo } from 'react';

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
    undoMove,
    redoMove,
    canUndo,
    canRedo,
    resign,
    offerDraw,
    flipBoard,
    whiteTime,
    blackTime,
    playerProfile,
    capturedPiecesWhite,
    capturedPiecesBlack,
    moveNumber,
    currentOpening,
    evaluationScore,
    accuracy,
    toggleSound,
    soundEnabled,
    toggleCoordinates,
    showCoordinates,
    toggleHints,
    hintsEnabled,
    setBoardTheme,
    boardTheme,
    exportFEN,
    importFEN,
    exportPGN,
    analysisMode,
    toggleAnalysisMode,
    engineEvaluation,
    hintMove,
    goToMove,
    autoQueen,
    setAutoQueen,
    requestTakeback,
    sendChatMessage,
    chatMessages,
  } = useChessGame();

  const [fenInput, setFenInput] = useState('');
  const [showFenImport, setShowFenImport] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate evaluation bar percentage
  const evalPercentage = useMemo(() => {
    if (!evaluationScore) return 50;
    const clampedScore = Math.max(-10, Math.min(10, evaluationScore));
    return 50 + (clampedScore * 5);
  }, [evaluationScore]);

  // Get piece symbol for captured pieces
  const getPieceSymbol = (pieceType: string) => {
    const symbols: Record<string, string> = {
      pawn: '♟',
      knight: '♞',
      bishop: '♝',
      rook: '♜',
      queen: '♛',
      king: '♚'
    };
    return symbols[pieceType] || '';
  };

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
            <div className="user-stats-mini">
              <span className="elo-rating">{playerProfile.elo}</span>
            </div>
            <div className="user-avatar">{playerProfile.username[0]}</div>
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

  const handleSendChat = () => {
    if (chatInput.trim()) {
      sendChatMessage(chatInput);
      setChatInput('');
    }
  };

  const handleFenImport = () => {
    if (fenInput.trim()) {
      importFEN(fenInput);
      setShowFenImport(false);
      setFenInput('');
    }
  };

  const copyFEN = () => {
    const fen = exportFEN();
    navigator.clipboard.writeText(fen);
  };

  const copyPGN = () => {
    const pgn = exportPGN();
    navigator.clipboard.writeText(pgn);
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
          <div className="user-stats-mini">
            <span className="elo-rating">{playerProfile.elo}</span>
            <span className="games-count">{playerProfile.gamesPlayed} games</span>
          </div>
          <div className="user-avatar">{playerProfile.username[0]}</div>
        </div>
      </header>

      <button className="back-button" onClick={goToMenu}>
        ← Menu
      </button>

      <div className="game-container">
        {/* Left Panel - Settings & Tools */}
        <aside className="left-sidebar">
          <div className="sidebar-section tools-section">
            <h3>Game Tools</h3>
            <div className="tools-grid">
              <button 
                className="tool-btn" 
                onClick={undoMove} 
                disabled={!canUndo}
                title="Undo Move (Ctrl+Z)"
              >
                <span className="tool-icon">↶</span>
                <span>Undo</span>
              </button>
              <button 
                className="tool-btn" 
                onClick={redoMove} 
                disabled={!canRedo}
                title="Redo Move (Ctrl+Y)"
              >
                <span className="tool-icon">↷</span>
                <span>Redo</span>
              </button>
              <button 
                className="tool-btn" 
                onClick={flipBoard}
                title="Flip Board (F)"
              >
                <span className="tool-icon">⇅</span>
                <span>Flip</span>
              </button>
              <button 
                className="tool-btn" 
                onClick={hintMove}
                disabled={analysisMode}
                title="Get Hint"
              >
                <span className="tool-icon">💡</span>
                <span>Hint</span>
              </button>
            </div>
          </div>

          <div className="sidebar-section settings-section">
            <h3>Display Options</h3>
            <label className="toggle-option">
              <input 
                type="checkbox" 
                checked={showCoordinates} 
                onChange={toggleCoordinates}
              />
              <span>Show Coordinates</span>
            </label>
            <label className="toggle-option">
              <input 
                type="checkbox" 
                checked={hintsEnabled} 
                onChange={toggleHints}
              />
              <span>Show Legal Moves</span>
            </label>
            <label className="toggle-option">
              <input 
                type="checkbox" 
                checked={soundEnabled} 
                onChange={toggleSound}
              />
              <span>Sound Effects</span>
            </label>
            <label className="toggle-option">
              <input 
                type="checkbox" 
                checked={autoQueen} 
                onChange={(e) => setAutoQueen(e.target.checked)}
              />
              <span>Auto Queen Promotion</span>
            </label>
          </div>

          <div className="sidebar-section theme-section">
            <h3>Board Theme</h3>
            <div className="theme-options">
              {['classic', 'blue', 'green', 'brown', 'gray'].map((theme) => (
                <button
                  key={theme}
                  className={`theme-btn ${boardTheme === theme ? 'active' : ''}`}
                  onClick={() => setBoardTheme(theme)}
                  title={`${theme} theme`}
                >
                  {theme[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section analysis-section">
            <h3>Analysis</h3>
            <label className="toggle-option">
              <input 
                type="checkbox" 
                checked={analysisMode} 
                onChange={toggleAnalysisMode}
              />
              <span>Engine Analysis</span>
            </label>
            {true && evaluationScore !== null && (
              <div className="eval-bar-container">
                <div className="eval-bar">
                  <div 
                    className="eval-fill white-eval" 
                    style={{ height: `${evalPercentage}%` }}
                  />
                </div>
                <div className="eval-score">
                  {evaluationScore > 0 ? '+' : ''}{evaluationScore.toFixed(2)}
                </div>
              </div>
            )}
            {engineEvaluation && (
              <div className="engine-info">
                <div className="engine-name">Stockfish 16</div>
                <div className="engine-depth">Depth: {engineEvaluation.depth}</div>
              </div>
            )}
          </div>

          <div className="sidebar-section export-section">
            <h3>Export & Import</h3>
            <div className="export-buttons">
              <button className="export-btn" onClick={copyFEN}>
                📋 Copy FEN
              </button>
              <button className="export-btn" onClick={copyPGN}>
                📋 Copy PGN
              </button>
              <button 
                className="export-btn" 
                onClick={() => setShowFenImport(!showFenImport)}
              >
                📥 Import FEN
              </button>
            </div>
            {showFenImport && (
              <div className="fen-import-box">
                <textarea
                  value={fenInput}
                  onChange={(e) => setFenInput(e.target.value)}
                  placeholder="Enter FEN position..."
                  rows={3}
                />
                <button className="action-btn primary" onClick={handleFenImport}>
                  Load Position
                </button>
              </div>
            )}
          </div>
        </aside>

        <div className="board-section">
          {/* Evaluation Bar (Vertical) */}
          {true && evaluationScore !== null && (
            <div className="vertical-eval-bar">
              <div 
                className="vertical-eval-fill" 
                style={{ height: `${evalPercentage}%` }}
              />
              <div className="vertical-eval-score">
                {evaluationScore > 0 ? '+' : ''}{evaluationScore.toFixed(1)}
              </div>
            </div>
          )}

          {/* Black player bar */}
          <div className="player-bar">
            <div className="player-info">
              <div className="player-avatar-small">
                {settings.mode === 'pass-and-play' ? 'P2' : 'AI'}
              </div>
              <div className="player-details">
                <span className="player-name">
                  {settings.mode === 'pass-and-play' ? 'Player 2' : 'Stockfish'}
                </span>
                <span className="player-rating">
                  {settings.mode === 'pass-and-play' ? '-' : getAiRating()}
                </span>
              </div>
            </div>
            <div className={`timer ${gameState.turn === 'black' ? 'active' : ''} ${blackTime < 30 ? 'low-time' : ''}`}>
              {formatTime(blackTime)}
            </div>
            <div className="captured-pieces captured-by-black">
              {capturedPiecesWhite.map((piece, i) => (
                <span key={i} className="captured-piece">{getPieceSymbol(piece)}</span>
              ))}
            </div>
          </div>

          <Board
            gameState={gameState}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            flipped={shouldFlipBoard}
            onSquareClick={handleSquareClick}
            showCoordinates={showCoordinates}
            showLegalMoves={hintsEnabled}
            boardTheme={boardTheme}
          />

          {/* White player bar */}
          <div className="player-bar">
            <div className="player-info">
              <div className="player-avatar-small">You</div>
              <div className="player-details">
                <span className="player-name">Player</span>
                <span className="player-rating">1500</span>
              </div>
            </div>
            <div className={`timer ${gameState.turn === 'white' ? 'active' : ''} ${whiteTime < 30 ? 'low-time' : ''}`}>
              {formatTime(whiteTime)}
            </div>
            <div className="captured-pieces captured-by-white">
              {capturedPiecesBlack.map((piece, i) => (
                <span key={i} className="captured-piece">{getPieceSymbol(piece)}</span>
              ))}
            </div>
          </div>

          {/* Game Status Bar */}
          <div className="game-status-bar">
            <span className="game-turn">
              {gameState.turn === 'white' ? '⚪ White' : '⚫ Black'} to move
            </span>
            <span className="move-count">Move {moveNumber}</span>
            {currentOpening && (
              <span className="opening-name">📖 {currentOpening}</span>
            )}
            <div className="game-actions-inline">
              <button className="inline-action-btn" onClick={offerDraw}>
                Offer Draw
              </button>
              <button className="inline-action-btn danger" onClick={resign}>
                Resign
              </button>
              <button className="inline-action-btn" onClick={requestTakeback}>
                Takeback
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="sidebar">
          {/* Player Stats */}
          {true && (
            <div className="sidebar-section stats-section">
              <h3>Your Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">{playerProfile.elo}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Games</span>
                  <span className="stat-value">{playerProfile.gamesPlayed}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Wins</span>
                  <span className="stat-value wins">{playerProfile.wins}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Losses</span>
                  <span className="stat-value losses">{playerProfile.losses}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Draws</span>
                  <span className="stat-value draws">{playerProfile.draws}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Win Rate</span>
                  <span className="stat-value">
                    {playerProfile.gamesPlayed > 0 
                      ? Math.round((playerProfile.wins / playerProfile.gamesPlayed) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Accuracy Stats */}
          <div className="sidebar-section accuracy-section">
            <h3>Accuracy</h3>
            <div className="accuracy-bars">
              <div className="accuracy-row">
                <span className="accuracy-label">White</span>
                <div className="accuracy-bar-bg">
                  <div 
                    className="accuracy-bar-fill" 
                    style={{ width: `${accuracy.white}%` }}
                  />
                </div>
                <span className="accuracy-value">{accuracy.white}%</span>
              </div>
              <div className="accuracy-row">
                <span className="accuracy-label">Black</span>
                <div className="accuracy-bar-bg">
                  <div 
                    className="accuracy-bar-fill" 
                    style={{ width: `${accuracy.black}%` }}
                  />
                </div>
                <span className="accuracy-value">{accuracy.black}%</span>
              </div>
            </div>
          </div>

          {/* Captured Pieces */}
          {true && (
            <div className="sidebar-section captured-section">
              <h3>Captured Pieces</h3>
              <div className="captured-display">
                <div className="captured-row">
                  <span className="captured-label">By White:</span>
                  <div className="captured-list">
                    {capturedPiecesBlack.length === 0 ? (
                      <span className="no-captures">-</span>
                    ) : (
                      capturedPiecesBlack.map((piece, i) => (
                        <span key={i} className="captured-piece-lg">{getPieceSymbol(piece)}</span>
                      ))
                    )}
                  </div>
                </div>
                <div className="captured-row">
                  <span className="captured-label">By Black:</span>
                  <div className="captured-list">
                    {capturedPiecesWhite.length === 0 ? (
                      <span className="no-captures">-</span>
                    ) : (
                      capturedPiecesWhite.map((piece, i) => (
                        <span key={i} className="captured-piece-lg">{getPieceSymbol(piece)}</span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Move History */}
          {true && (
            <div className="sidebar-section">
              <div className="section-header">
                <h3>Move History</h3>
                <div className="history-controls">
                  <button 
                    className="history-nav-btn" 
                    onClick={() => goToMove(gameState.moveHistory.length - 2)}
                    disabled={!canUndo}
                  >
                    ⟸
                  </button>
                  <button 
                    className="history-nav-btn" 
                    onClick={() => goToMove(gameState.moveHistory.length)}
                    disabled={!canRedo}
                  >
                    ⟹
                  </button>
                </div>
              </div>
              <div className="move-history-sidebar">
                {gameState.moveHistory.length === 0 ? (
                  <div className="no-moves">No moves yet</div>
                ) : (
                  gameState.moveHistory.reduce((rows: React.JSX.Element[], move, index) => {
                    if (index % 2 === 0) {
                      const whiteMove = move;
                      const blackMove = gameState.moveHistory[index + 1];
                      const moveNum = Math.floor(index / 2) + 1;
                      rows.push(
                        <div key={moveNum} className="move-row">
                          <span className="move-number">{moveNum}.</span>
                          <span className="move-white">{whiteMove.symbol || `${whiteMove.from.col}${whiteMove.from.row}`}</span>
                          <span className="move-black">{blackMove?.symbol || ''}</span>
                        </div>
                      );
                    }
                    return rows;
                  }, [])
                )}
              </div>
            </div>
          )}

          <div className="sidebar-section game-actions">
            <button className="action-btn primary" onClick={resetGame}>New Game</button>
            <div className="action-row">
              <button className="action-btn half" onClick={undoMove} disabled={!canUndo}>Undo</button>
              <button className="action-btn half" onClick={redoMove} disabled={!canRedo}>Redo</button>
            </div>
            <div className="action-row">
              <button className="action-btn half" onClick={offerDraw}>Draw</button>
              <button className="action-btn half danger" onClick={resign}>Resign</button>
            </div>
            <button className="action-btn secondary" onClick={() => () => {}}>
              ⚙ Settings
            </button>
          </div>

          {/* Chat Section */}
          <div className="chat-section">
            <div className="chat-header">
              <h3>Game Chat</h3>
              <span className="chat-badge">{chatMessages.length}</span>
            </div>
            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <p className="chat-placeholder">Say something nice!</p>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="chat-message">
                    <span className="chat-sender">{msg.sender}:</span>
                    <span className="chat-text">{msg.message}</span>
                  </div>
                ))
              )}
            </div>
            <div className="chat-input-row">
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Send a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button className="chat-send-btn" onClick={handleSendChat}>
                ➤
              </button>
            </div>
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
