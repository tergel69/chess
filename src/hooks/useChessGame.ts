import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  GameState,
  Position,
  Move,
  GameSettings,
  GameResult,
  PieceType,
} from '../game/types';
import { createInitialGameState } from '../game/constants';
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
}

export function useChessGame(): UseChessGameReturn {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
  const [settings, setSettings] = useState<GameSettings>({ mode: 'menu' });

  const aiThinkingRef = useRef(false);

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

      const newState = makeMove(gameState, move);
      setGameState(newState);
      setSelectedSquare(null);
      setLegalMoves([]);
      setPendingPromotion(null);

      const result = checkGameOver(newState);
      if (result) {
        setGameResult(result);
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
            setPendingPromotion({ from: selectedSquare, to: position });
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
    ]
  );

  const handlePromotion = useCallback(
    (pieceType: PieceType) => {
      if (!pendingPromotion) return;
      executeMove(pendingPromotion.from, pendingPromotion.to, pieceType);
    },
    [pendingPromotion, executeMove]
  );

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setGameResult(null);
    setIsAiThinking(false);
    setPendingPromotion(null);
  }, []);

  const startGame = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    setGameState(createInitialGameState());
    setSelectedSquare(null);
    setLegalMoves([]);
    setGameResult(null);
    setIsAiThinking(false);
    setPendingPromotion(null);
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
  };
}
