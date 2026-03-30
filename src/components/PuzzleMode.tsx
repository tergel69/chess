import type { GameSettings } from '../game/types';
import { Board } from './Board';
import { useState, useEffect } from 'react';
import { puzzleEngine } from '../game/puzzleEngine';
import type { PuzzlePosition } from '../game/puzzleEngine';
import { createGameStateFromFEN, makeMove, getLegalMoves } from '../game/moves';
import '../styles/components.css';

interface PuzzleModeProps {
  settings: GameSettings;
  onBack: () => void;
}

export function PuzzleMode({ settings, onBack }: PuzzleModeProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzlePosition | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gameState, setGameState] = useState<any>(null);
  const [selectedSquare, setSelectedSquare] = useState<any>(null);
  const [legalMoves, setLegalMoves] = useState<any[]>([]);

  const startPuzzle = () => {
    const puzzle = puzzleEngine.startPuzzle(settings.puzzleDifficulty || 'beginner');
    setCurrentPuzzle(puzzle);
    setPuzzleSolved(false);
    setMoveHistory([]);
    setIsAnalyzing(false);
    
    // Create game state from FEN
    const state = createGameStateFromFEN(puzzle.fen);
    setGameState(state);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  useEffect(() => {
    if (currentPuzzle) {
      const interval = setInterval(() => {
        setTimeElapsed(puzzleEngine.getTimeElapsed());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentPuzzle]);

  const handleSquareClick = (position: any) => {
    if (!currentPuzzle || puzzleSolved || puzzleEngine.isTimeUp() || !gameState) return;

    // If no square is selected, select this square if it has a piece
    if (!selectedSquare) {
      const piece = gameState.board[position.row][position.col];
      if (piece && piece.color === gameState.turn) {
        setSelectedSquare(position);
        const moves = getLegalMoves(gameState, position);
        setLegalMoves(moves);
      }
      return;
    }

    // If a square is already selected, try to move
    if (selectedSquare.row === position.row && selectedSquare.col === position.col) {
      // Deselect if clicking the same square
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // Check if this is a legal move
    const isLegalMove = legalMoves.some(
      (move: any) => move.to.row === position.row && move.to.col === position.col
    );

    if (isLegalMove) {
      // Find the move object
      const move = legalMoves.find(
        (m: any) => m.to.row === position.row && m.to.col === position.col
      );

      if (move) {
        // Convert the move to algebraic notation
        const file = String.fromCharCode(97 + move.to.col); // a-h
        const rank = 8 - move.to.row; // 1-8
        const notation = `${file}${rank}`;

        // Check if this is the correct move for the puzzle
        const result = puzzleEngine.checkMove(notation);
        
        if (result.correct) {
          // Apply the move to the game state
          const newGameState = makeMove(gameState, move);
          setGameState(newGameState);
          setMoveHistory(puzzleEngine.getMoveHistory());
          setSelectedSquare(null);
          setLegalMoves([]);
          
          if (result.isSolutionComplete) {
            setPuzzleSolved(true);
          }
        } else {
          setIsAnalyzing(true);
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    } else {
      // Try to select a different piece
      const piece = gameState.board[position.row][position.col];
      if (piece && piece.color === gameState.turn) {
        setSelectedSquare(position);
        const moves = getLegalMoves(gameState, position);
        setLegalMoves(moves);
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    }
  };

  const getEloGain = () => {
    if (!currentPuzzle) return 0;
    switch (currentPuzzle.difficulty) {
      case 'beginner': return 10;
      case 'intermediate': return 25;
      case 'advanced': return 50;
      default: return 10;
    }
  };

  if (!currentPuzzle) {
    return (
      <div className="puzzle-mode">
        <div className="puzzle-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Menu
          </button>
          <h1>Chess Puzzles</h1>
          <div className="puzzle-stats">
            <div className="stat-box">
              <span className="stat-label">Current ELO</span>
              <span className="stat-number elo">{settings.playerElo || 1200}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Difficulty</span>
              <span className="stat-number">{settings.puzzleDifficulty?.toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        <div className="puzzle-start">
          <div className="puzzle-info">
            <h2>{settings.puzzleDifficulty?.toUpperCase()} PUZZLES</h2>
            <p>Train your tactical skills and improve your ELO rating</p>
            <div className="difficulty-features">
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>1-3 moves for beginner</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⏱️</span>
                <span>{settings.puzzleDifficulty === 'beginner' ? '30s' : settings.puzzleDifficulty === 'intermediate' ? '60s' : '120s'} time limit</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📈</span>
                <span>+{getEloGain()} ELO for correct solutions</span>
              </div>
            </div>
          </div>
          
          <button className="start-puzzle-btn" onClick={startPuzzle}>
            Start Puzzle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="puzzle-mode">
      <div className="puzzle-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Menu
        </button>
        <h1>{currentPuzzle.name}</h1>
        <div className="puzzle-stats">
          <div className="stat-box">
            <span className="stat-label">ELO RANGE</span>
            <span className="stat-number">{currentPuzzle.eloRange}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">TIME LIMIT</span>
            <span className="stat-number">{currentPuzzle.timeLimit}s</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">MOVES</span>
            <span className="stat-number">{moveHistory.length + 1}/{currentPuzzle.solution.length}</span>
          </div>
        </div>
      </div>

      <div className="puzzle-content">
        <div className="puzzle-board">
          <div className="puzzle-description">
            <h3>{currentPuzzle.description}</h3>
            <p>Find the winning combination! Side to move: <strong>{currentPuzzle.sideToMove.toUpperCase()}</strong></p>
            <div className="puzzle-theme">
              Theme: <span className="theme-badge">{currentPuzzle.theme.join(', ')}</span>
            </div>
          </div>
          
          {/* Real chess board with actual game state */}
          {gameState && (
            <div className="puzzle-board-container">
              <div className="board-debug">
                Debug: Board has {gameState.board.flat().filter((p:any) => p).length} pieces
              </div>
              <Board
                gameState={gameState}
                selectedSquare={selectedSquare}
                legalMoves={legalMoves}
                flipped={false}
                onSquareClick={handleSquareClick}
              />
            </div>
          )}
          
          {/* Time display */}
          <div className="time-display">
            <div className="time-label">Time Remaining</div>
            <div className="time-value" style={{ 
              color: puzzleEngine.getTimeRemaining() < 10 ? '#f44336' : '#fff' 
            }}>
              {puzzleEngine.getTimeRemaining()}s
            </div>
          </div>
        </div>

        <div className="puzzle-sidebar">
          <div className="move-history">
            <h3>Move History</h3>
            <div className="moves-list">
              {moveHistory.map((move, index) => (
                <div key={index} className="move-item">
                  <span className="move-number">{index + 1}.</span>
                  <span className="move-text">{move}</span>
                </div>
              ))}
            </div>
          </div>

          {isAnalyzing && (
            <div className="analysis-panel">
              <h3>Engine Analysis</h3>
              <div className="analysis-content">
                <div className="win-probability">
                  <div className="prob-label">Position Evaluation</div>
                  <div className="prob-bar">
                    <div className="prob-fill" style={{ height: '45%' }}></div>
                  </div>
                  <div className="prob-value">-0.5</div>
                </div>
                <p className="analysis-text">
                  This move loses the advantage. The correct continuation was {currentPuzzle.solution[moveHistory.length]}.
                </p>
              </div>
            </div>
          )}

          {puzzleSolved && (
            <div className="success-panel">
              <div className="success-icon">✅</div>
              <h3>Puzzle Solved!</h3>
              <p>+{getEloGain()} ELO gained</p>
              <button className="next-puzzle-btn" onClick={startPuzzle}>
                Next Puzzle
              </button>
            </div>
          )}

          {/* Puzzle stats */}
          <div className="puzzle-stats-panel">
            <h3>Puzzle Stats</h3>
            <div className="stat-item">
              <span>Accuracy</span>
              <span className="stat-value">{Math.round((moveHistory.length / currentPuzzle.solution.length) * 100)}%</span>
            </div>
            <div className="stat-item">
              <span>Time Used</span>
              <span className="stat-value">{timeElapsed}s</span>
            </div>
            <div className="stat-item">
              <span>Moves Made</span>
              <span className="stat-value">{moveHistory.length}/{currentPuzzle.solution.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}