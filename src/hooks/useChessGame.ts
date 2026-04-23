import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  GameState,
  Position,
  Move,
  GameSettings,
  GameResult,
  PieceType,
  PlayerProfile,
  Achievement,
  TimeControl,
  AnalysisEval,
} from '../game/types';
import { createInitialGameState, TIME_CONTROLS, ACHIEVEMENTS, OPENINGS } from '../game/constants';
import {
  getLegalMoves,
  makeMove,
  isCheckmate,
  isStalemate,
  isDraw,
  getPieceAt,
} from '../game/moves';
import { getBestMove } from '../game/ai';

interface PendingPromotion {
  from: Position;
  to: Position;
}

interface UseChessGameReturn {
  gameState: GameState;
  selectedSquare: Position | null;
  legalMoves: Move[];
  gameResult: GameResult;
  isAiThinking: boolean;
  pendingPromotion: PendingPromotion | null;
  settings: GameSettings;
  handleSquareClick: (position: Position) => void;
  handlePromotion: (pieceType: PieceType) => void;
  resetGame: () => void;
  startGame: (settings: GameSettings) => void;
  goToMenu: () => void;
  // New features
  undoMove: () => void;
  redoMove: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resign: () => void;
  offerDraw: () => void;
  flipBoard: () => void;
  isBoardFlipped: boolean;
  whiteTime: number;
  blackTime: number;
  timerRunning: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  setTimeControl: (control: TimeControl) => void;
  playerProfile: PlayerProfile;
  unlockedAchievements: Achievement[];
  capturedPiecesWhite: PieceType[];
  capturedPiecesBlack: PieceType[];
  moveNumber: number;
  currentOpening: string | null;
  evaluationScore: number | null;
  accuracy: { white: number; black: number };
  bestMove: Move | null;
  toggleSound: () => void;
  soundEnabled: boolean;
  toggleCoordinates: () => void;
  showCoordinates: boolean;
  toggleHints: () => void;
  hintsEnabled: boolean;
  setBoardTheme: (theme: string) => void;
  boardTheme: string;
  exportFEN: () => string;
  importFEN: (fen: string) => void;
  exportPGN: () => string;
  analysisMode: boolean;
  toggleAnalysisMode: () => void;
  engineEvaluation: AnalysisEval | null;
  hintMove: () => void;
  goToMove: (moveIndex: number) => void;
  autoQueen: boolean;
  setAutoQueen: (enabled: boolean) => void;
  takebackRequest: boolean;
  requestTakeback: () => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (message: string) => void;
  premove: Move | null;
  setPremove: (move: Move | null) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'menu',
  timeControl: 'rapid',
  timeSettings: TIME_CONTROLS.rapid,
  showCoordinates: true,
  showMoveHints: false,
  showLegalMoves: true,
  soundEnabled: true,
  autoPromote: false,
  boardTheme: 'classic',
  pieceTheme: 'classic',
  enableEngineAnalysis: false,
  engineDepth: 10,
};

export function useChessGame(): UseChessGameReturn {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  
  // History for undo/redo
  const [history, setHistory] = useState<GameState[]>([]);
  const [future, setFuture] = useState<GameState[]>([]);
  
  // Board flip state
  const [isBoardFlipped, setIsBoardFlipped] = useState(false);
  
  // Timer states
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);
  
  // Player profile and achievements
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    username: 'Player',
    elo: 1400,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    bestWinStreak: 0,
    totalTimePlayed: 0,
    favoriteOpening: '',
    achievements: ACHIEVEMENTS,
  });
  
  // Analysis and evaluation
  const [evaluationScore, setEvaluationScore] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState({ white: 50, black: 50 });
  const [bestMove, setBestMove] = useState<Move | null>(null);
  const [engineEvaluation, setEngineEvaluation] = useState<AnalysisEval | null>(null);
  const [analysisMode, setAnalysisMode] = useState(false);
  
  // Settings toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [boardTheme, setBoardThemeState] = useState('classic');
  const [autoQueen, setAutoQueen] = useState(false);
  
  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'System', message: 'Welcome! Good luck and have fun!', timestamp: new Date() }
  ]);
  
  // Premove
  const [premove, setPremove] = useState<Move | null>(null);
  
  // Takeback request
  const [takebackRequest, setTakebackRequest] = useState(false);
  
  const aiThinkingRef = useRef(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Start/stop timer based on game state
  useEffect(() => {
    if (timerRunning && !gameResult && settings.mode !== 'menu') {
      timerIntervalRef.current = window.setInterval(() => {
        if (gameState.turn === 'white') {
          setWhiteTime(prev => {
            if (prev <= 1) {
              setGameResult('timeout');
              setTimerRunning(false);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setBlackTime(prev => {
            if (prev <= 1) {
              setGameResult('timeout');
              setTimerRunning(false);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning, gameState.turn, gameResult, settings.mode]);

  // Check for game over conditions
  const checkGameOver = useCallback((state: GameState): GameResult => {
    if (isCheckmate(state)) {
      return state.turn === 'white' ? 'black-wins' : 'white-wins';
    }
    if (isStalemate(state)) {
      return 'stalemate';
    }
    if (isDraw(state)) {
      return 'draw';
    }
    return null;
  }, []);

  // Update player stats on game end
  useEffect(() => {
    if (gameResult && gameResult !== 'stalemate' && gameResult !== 'draw') {
      setPlayerProfile(prev => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: (gameResult === 'white-wins' && settings.playerColor !== 'black') || 
              (gameResult === 'black-wins' && settings.playerColor === 'black') 
          ? prev.wins + 1 : prev.wins,
        losses: (gameResult === 'black-wins' && settings.playerColor !== 'black') || 
                (gameResult === 'white-wins' && settings.playerColor === 'black') 
          ? prev.losses + 1 : prev.losses,
        winStreak: ((gameResult === 'white-wins' && settings.playerColor !== 'black') || 
                   (gameResult === 'black-wins' && settings.playerColor === 'black'))
          ? prev.winStreak + 1 : 0,
        bestWinStreak: ((gameResult === 'white-wins' && settings.playerColor !== 'black') || 
                       (gameResult === 'black-wins' && settings.playerColor === 'black'))
          ? Math.max(prev.bestWinStreak, prev.winStreak + 1) : prev.bestWinStreak,
      }));
    }
  }, [gameResult, settings.playerColor]);

  // Handle AI move
  useEffect(() => {
    if (
      settings.mode !== 'vs-ai' ||
      !settings.difficulty ||
      !settings.playerColor ||
      gameResult
    ) {
      return;
    }

    const isAiTurn = gameState.turn !== settings.playerColor;

    if (isAiTurn && !aiThinkingRef.current) {
      aiThinkingRef.current = true;
      setIsAiThinking(true);

      // Use shorter timeout for faster AI response
      const timeoutId = setTimeout(() => {
        const aiMove = getBestMove(gameState, settings.difficulty!);

        if (aiMove) {
          const newState = makeMove(gameState, aiMove);
          setGameState(newState);
          setSelectedSquare(null);
          setLegalMoves([]);

          const result = checkGameOver(newState);
          if (result) {
            setGameResult(result);
          }
        }

        aiThinkingRef.current = false;
        setIsAiThinking(false);
      }, 200);

      return () => {
        clearTimeout(timeoutId);
        aiThinkingRef.current = false;
      };
    }
  }, [gameState, settings, gameResult, checkGameOver]);

  const executeMove = useCallback(
    (from: Position, to: Position, promotion?: PieceType) => {
      const move = legalMoves.find(
        (m) =>
          m.from.row === from.row &&
          m.from.col === from.col &&
          m.to.row === to.row &&
          m.to.col === to.col &&
          (promotion ? m.promotion === promotion : !m.promotion)
      );

      if (!move) return;

      // Save current state to history for undo
      setHistory(prev => [...prev, gameState]);
      setFuture([]); // Clear redo stack on new move

      const newState = makeMove(gameState, move);
      setGameState(newState);
      setSelectedSquare(null);
      setLegalMoves([]);
      setPendingPromotion(null);

      const result = checkGameOver(newState);
      if (result) {
        setGameResult(result);
        setTimerRunning(false);
      }
      
      // Start timer on first move
      if (newState.moveHistory.length === 1) {
        setTimerRunning(true);
      }
    },
    [gameState, legalMoves, checkGameOver]
  );

  const handleSquareClick = useCallback(
    (position: Position) => {
      if (gameResult || isAiThinking) return;

      // In VS AI mode, don't allow moves when it's AI's turn
      if (settings.mode === 'vs-ai' && settings.playerColor !== gameState.turn) {
        return;
      }

      const clickedPiece = getPieceAt(gameState.board, position);

      // If clicking on a legal move destination
      if (selectedSquare) {
        const moveToPosition = legalMoves.find(
          (m) => m.to.row === position.row && m.to.col === position.col
        );

        if (moveToPosition) {
          // Check if this is a promotion move
          const promotionMoves = legalMoves.filter(
            (m) =>
              m.to.row === position.row &&
              m.to.col === position.col &&
              m.promotion
          );

          if (promotionMoves.length > 0) {
            if (autoQueen) {
              executeMove(selectedSquare, position, 'queen');
            } else {
              setPendingPromotion({ from: selectedSquare, to: position });
            }
            return;
          }

          executeMove(selectedSquare, position);
          return;
        }
      }

      // If clicking on own piece, select it
      if (clickedPiece && clickedPiece.color === gameState.turn) {
        setSelectedSquare(position);
        setLegalMoves(getLegalMoves(gameState, position));
        return;
      }

      // Clicking elsewhere deselects
      setSelectedSquare(null);
      setLegalMoves([]);
    },
    [
      gameState,
      selectedSquare,
      legalMoves,
      gameResult,
      isAiThinking,
      settings,
      executeMove,
      autoQueen,
    ]
  );

  const handlePromotion = useCallback(
    (pieceType: PieceType) => {
      if (!pendingPromotion) return;
      executeMove(pendingPromotion.from, pendingPromotion.to, pieceType);
    },
    [pendingPromotion, executeMove]
  );

  // Undo/Redo functions
  const undoMove = useCallback(() => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setFuture(prev => [gameState, ...prev]);
    setHistory(prev => prev.slice(0, -1));
    setGameState(previousState);
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [history, gameState]);

  const redoMove = useCallback(() => {
    if (future.length === 0) return;
    const nextState = future[0];
    setHistory(prev => [...prev, gameState]);
    setFuture(prev => prev.slice(1));
    setGameState(nextState);
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [future, gameState]);

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;

  // Resign and Draw
  const resign = useCallback(() => {
    setGameResult(settings.playerColor === 'white' ? 'black-wins' : 'white-wins');
    setTimerRunning(false);
  }, [settings.playerColor]);

  const offerDraw = useCallback(() => {
    setGameResult('draw');
    setTimerRunning(false);
  }, []);

  // Board flip
  const flipBoard = useCallback(() => {
    setIsBoardFlipped(prev => !prev);
  }, []);

  // Timer controls
  const pauseTimer = useCallback(() => setTimerRunning(false), []);
  const resumeTimer = useCallback(() => setTimerRunning(true), []);

  const setTimeControl = useCallback((control: TimeControl) => {
    const timeSettings = TIME_CONTROLS[control];
    setSettings(prev => ({ ...prev, timeControl: control, timeSettings }));
    setWhiteTime(timeSettings.initialTime);
    setBlackTime(timeSettings.initialTime);
  }, []);

  // Settings toggles
  const toggleSound = useCallback(() => setSoundEnabled(prev => !prev), []);
  const toggleCoordinates = useCallback(() => setShowCoordinates(prev => !prev), []);
  const toggleHints = useCallback(() => setHintsEnabled(prev => !prev), []);
  const setBoardTheme = useCallback((theme: string) => setBoardThemeState(theme), []);

  // FEN export/import
  const exportFEN = useCallback((): string => {
    // Simplified FEN export
    let fen = '';
    for (let row = 0; row < 8; row++) {
      let empty = 0;
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece) {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          const symbol = piece.type === 'knight' ? 'N' : piece.type === 'bishop' ? 'B' : 
                        piece.type === 'rook' ? 'R' : piece.type === 'queen' ? 'Q' : 
                        piece.type === 'king' ? 'K' : 'P';
          fen += piece.color === 'white' ? symbol : symbol.toLowerCase();
        } else {
          empty++;
        }
      }
      if (empty > 0) fen += empty;
      if (row < 7) fen += '/';
    }
    fen += ` ${gameState.turn === 'white' ? 'w' : 'b'} `;
    return fen;
  }, [gameState]);

  const importFEN = useCallback((fen: string) => {
    // Simplified FEN import - would need full implementation
    console.log('Import FEN:', fen);
  }, []);

  // PGN export
  const exportPGN = useCallback((): string => {
    return gameState.moveHistory.map((m, i) => {
      const moveNum = Math.floor(i / 2) + 1;
      const notation = `${m.isCapture ? 'x' : ''}`;
      return i % 2 === 0 ? `${moveNum}. ${notation}` : notation;
    }).join(' ');
  }, [gameState.moveHistory]);

  // Analysis mode
  const toggleAnalysisMode = useCallback(() => {
    setAnalysisMode(prev => !prev);
    setSettings(prev => ({ ...prev, enableEngineAnalysis: !prev }));
  }, []);

  // Hint move
  const hintMove = useCallback(() => {
    if (settings.mode === 'vs-ai' || analysisMode) {
      const hint = getBestMove(gameState, 'intermediate');
      setBestMove(hint || null);
    }
  }, [gameState, settings.mode, analysisMode]);

  // Go to specific move
  const goToMove = useCallback((moveIndex: number) => {
    // Would need full implementation with move navigation
    console.log('Go to move:', moveIndex);
  }, []);

  // Request takeback
  const requestTakeback = useCallback(() => {
    setTakebackRequest(true);
  }, []);

  // Chat
  const sendChatMessage = useCallback((message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  }, []);

  // Derived values
  const moveNumber = Math.floor(gameState.moveHistory.length / 2) + 1;
  const capturedPiecesWhite = gameState.capturedPieces?.white || [];
  const capturedPiecesBlack = gameState.capturedPieces?.black || [];
  
  // Simple opening detection
  const currentOpening = gameState.moveHistory.length <= 6 
    ? OPENINGS.find(o => o.moves.every((m, i) => {
        const actualMove = gameState.moveHistory[i];
        if (!actualMove) return false;
        // Simplified comparison
        return true;
      }))?.name || null
    : null;

  const unlockedAchievements = playerProfile.achievements.filter(a => a.unlocked);

  // Add resetGame and startGame back
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setGameResult(null);
    setIsAiThinking(false);
    setPendingPromotion(null);
    setHistory([]);
    setFuture([]);
    setWhiteTime(settings.timeSettings?.initialTime || 600);
    setBlackTime(settings.timeSettings?.initialTime || 600);
    setTimerRunning(false);
  }, [settings.timeSettings]);

  const startGame = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setGameResult(null);
    setIsAiThinking(false);
    setPendingPromotion(null);
    setHistory([]);
    setFuture([]);
    if (newSettings.timeSettings) {
      setWhiteTime(newSettings.timeSettings.initialTime);
      setBlackTime(newSettings.timeSettings.initialTime);
    }
    setTimerRunning(false);
  }, []);

  const goToMenu = useCallback(() => {
    setSettings({ mode: 'menu' });
    resetGame();
  }, [resetGame]);

  return {
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
    // New features
    undoMove,
    redoMove,
    canUndo,
    canRedo,
    resign,
    offerDraw,
    flipBoard,
    isBoardFlipped,
    whiteTime,
    blackTime,
    timerRunning,
    pauseTimer,
    resumeTimer,
    setTimeControl,
    playerProfile,
    unlockedAchievements,
    capturedPiecesWhite,
    capturedPiecesBlack,
    moveNumber,
    currentOpening,
    evaluationScore,
    accuracy,
    bestMove,
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
    takebackRequest,
    requestTakeback,
    chatMessages,
    sendChatMessage,
    premove,
    setPremove,
  };
}
