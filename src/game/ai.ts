import type { GameState, Move, Color, Difficulty, PieceType } from './types';
import {
  PIECE_VALUES,
  PAWN_TABLE,
  KNIGHT_TABLE,
  BISHOP_TABLE,
  ROOK_TABLE,
  QUEEN_TABLE,
  KING_MIDDLE_TABLE,
  KING_END_TABLE,
  BOARD_SIZE,
} from './constants';
import { getAllLegalMoves, makeMove, isCheckmate, isDraw } from './moves';

const PIECE_SQUARE_TABLES: Record<PieceType, number[][]> = {
  pawn: PAWN_TABLE,
  knight: KNIGHT_TABLE,
  bishop: BISHOP_TABLE,
  rook: ROOK_TABLE,
  queen: QUEEN_TABLE,
  king: KING_MIDDLE_TABLE,
};

function isEndgame(state: GameState): boolean {
  let queens = 0;
  let minorMajorPieces = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = state.board[row][col];
      if (piece) {
        if (piece.type === 'queen') queens++;
        if (piece.type === 'rook' || piece.type === 'bishop' || piece.type === 'knight') {
          minorMajorPieces++;
        }
      }
    }
  }

  return queens === 0 || (queens === 2 && minorMajorPieces <= 2);
}

function getPieceSquareValue(type: PieceType, row: number, col: number, color: Color, isEndgamePhase: boolean): number {
  const table = type === 'king' && isEndgamePhase ? KING_END_TABLE : PIECE_SQUARE_TABLES[type];

  // Mirror the table for black pieces
  const tableRow = color === 'white' ? row : 7 - row;
  return table[tableRow][col];
}

function evaluateBoard(state: GameState): number {
  let score = 0;
  const isEndgamePhase = isEndgame(state);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = state.board[row][col];
      if (piece) {
        const pieceValue = PIECE_VALUES[piece.type];
        const positionValue = getPieceSquareValue(piece.type, row, col, piece.color, isEndgamePhase);
        const totalValue = pieceValue + positionValue;

        // Add bonuses for piece development
        let developmentBonus = 0;
        if (piece.type === 'knight' || piece.type === 'bishop') {
          // Knights and bishops get bonus for being developed
          const startRow = piece.color === 'white' ? 7 : 0;
          if (Math.abs(row - startRow) >= 2) {
            developmentBonus += 20;
          }
        }

        // King safety bonus
        let kingSafetyBonus = 0;
        if (piece.type === 'king') {
          const isKingSafe = (piece.color === 'white' && row >= 6) || 
                           (piece.color === 'black' && row <= 1);
          if (!isEndgamePhase && isKingSafe) {
            kingSafetyBonus += 30;
          }
        }

        const finalValue = totalValue + developmentBonus + kingSafetyBonus;

        if (piece.color === 'white') {
          score += finalValue;
        } else {
          score -= finalValue;
        }
      }
    }
  }

  return score;
}

function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean
): number {
  if (depth === 0) {
    return evaluateBoard(state);
  }

  if (isCheckmate(state)) {
    return maximizingPlayer ? -100000 + (10 - depth) : 100000 - (10 - depth);
  }

  if (isDraw(state)) {
    return 0;
  }

  const moves = getAllLegalMoves(state);

  if (moves.length === 0) {
    return evaluateBoard(state);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newState = makeMove(state, move);
      const evaluation = minimax(newState, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newState = makeMove(state, move);
      const evaluation = minimax(newState, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function orderMoves(state: GameState, moves: Move[]): Move[] {
  return moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Prioritize captures (MVV-LVA: Most Valuable Victim - Least Valuable Attacker)
    if (a.capturedPiece) {
      scoreA += PIECE_VALUES[a.capturedPiece.type] * 10;
      // Get the moving piece from the board
      const movingPiece = state.board[a.from.row][a.from.col];
      if (movingPiece) {
        scoreA -= PIECE_VALUES[movingPiece.type];
      }
    }
    if (b.capturedPiece) {
      scoreB += PIECE_VALUES[b.capturedPiece.type] * 10;
      // Get the moving piece from the board
      const movingPiece = state.board[b.from.row][b.from.col];
      if (movingPiece) {
        scoreB -= PIECE_VALUES[movingPiece.type];
      }
    }

    // Prioritize promotions
    if (a.promotion) scoreA += PIECE_VALUES[a.promotion] * 5;
    if (b.promotion) scoreB += PIECE_VALUES[b.promotion] * 5;

    // Prioritize checks (simplified - moves toward center are more likely to give checks)
    const aCenterDist = Math.abs(a.to.row - 3.5) + Math.abs(a.to.col - 3.5);
    const bCenterDist = Math.abs(b.to.row - 3.5) + Math.abs(b.to.col - 3.5);
    scoreA -= aCenterDist * 10;
    scoreB -= bCenterDist * 10;

    // Prioritize castling
    if (a.castling) scoreA += 50;
    if (b.castling) scoreB += 50;

    return scoreB - scoreA;
  });
}

function getDepthForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'beginner':
      return 2;
    case 'intermediate':
      return 3;
    case 'master':
      return 4;
    default:
      return 3;
  }
}

export function getBestMove(state: GameState, difficulty: Difficulty): Move | null {
  const moves = getAllLegalMoves(state);

  if (moves.length === 0) return null;

  const depth = getDepthForDifficulty(difficulty);
  const isMaximizing = state.turn === 'white';

  // Order moves for better alpha-beta pruning
  const orderedMoves = orderMoves(state, moves);

  let bestMove: Move | null = null;
  let bestEval = isMaximizing ? -Infinity : Infinity;

  const evaluatedMoves: { move: Move; eval: number }[] = [];

  for (const move of orderedMoves) {
    const newState = makeMove(state, move);
    const evaluation = minimax(
      newState,
      depth - 1,
      -Infinity,
      Infinity,
      !isMaximizing
    );

    evaluatedMoves.push({ move, eval: evaluation });

    if (isMaximizing) {
      if (evaluation > bestEval) {
        bestEval = evaluation;
        bestMove = move;
      }
    } else {
      if (evaluation < bestEval) {
        bestEval = evaluation;
        bestMove = move;
      }
    }
  }

  // For beginner difficulty, add some randomness
  if (difficulty === 'beginner' && evaluatedMoves.length > 1) {
    // Sort moves by evaluation
    evaluatedMoves.sort((a, b) =>
      isMaximizing ? b.eval - a.eval : a.eval - b.eval
    );

    // Pick randomly from top 5 moves (or less if fewer available)
    const topMoves = evaluatedMoves.slice(0, Math.min(5, evaluatedMoves.length));
    const randomIndex = Math.floor(Math.random() * topMoves.length);
    return topMoves[randomIndex].move;
  }

  return bestMove;
}
