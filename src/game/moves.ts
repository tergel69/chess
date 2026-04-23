import type { Piece, Position, Move, GameState, Color, PieceType } from './types';
import { BOARD_SIZE } from './constants';

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE;
}

export function getPieceAt(board: (Piece | null)[][], pos: Position): Piece | null {
  if (!isValidPosition(pos)) return null;
  return board[pos.row][pos.col];
}

export function getOppositeColor(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}

function addMove(moves: Move[], from: Position, to: Position, board: (Piece | null)[][]): void {
  const capturedPiece = getPieceAt(board, to) || undefined;
  moves.push({ from, to, capturedPiece });
}

function getPawnMoves(board: (Piece | null)[][], pos: Position, color: Color, enPassantTarget: Position | null): Move[] {
  const moves: Move[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  const promotionRow = color === 'white' ? 0 : 7;

  // Forward move
  const oneForward: Position = { row: pos.row + direction, col: pos.col };
  if (isValidPosition(oneForward) && !getPieceAt(board, oneForward)) {
    if (oneForward.row === promotionRow) {
      // Promotion moves
      const promotionPieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];
      for (const promotion of promotionPieces) {
        moves.push({ from: pos, to: oneForward, promotion });
      }
    } else {
      moves.push({ from: pos, to: oneForward });
    }

    // Two squares forward from starting position
    if (pos.row === startRow) {
      const twoForward: Position = { row: pos.row + 2 * direction, col: pos.col };
      if (!getPieceAt(board, twoForward)) {
        moves.push({ from: pos, to: twoForward });
      }
    }
  }

  // Captures
  const captureOffsets = [{ row: direction, col: -1 }, { row: direction, col: 1 }];
  for (const offset of captureOffsets) {
    const capturePos: Position = { row: pos.row + offset.row, col: pos.col + offset.col };
    if (!isValidPosition(capturePos)) continue;

    const targetPiece = getPieceAt(board, capturePos);
    if (targetPiece && targetPiece.color !== color) {
      if (capturePos.row === promotionRow) {
        const promotionPieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];
        for (const promotion of promotionPieces) {
          moves.push({ from: pos, to: capturePos, promotion, capturedPiece: targetPiece });
        }
      } else {
        moves.push({ from: pos, to: capturePos, capturedPiece: targetPiece });
      }
    }

    // En passant
    if (enPassantTarget && capturePos.row === enPassantTarget.row && capturePos.col === enPassantTarget.col) {
      const capturedPawnPos: Position = { row: pos.row, col: capturePos.col };
      const capturedPawn = getPieceAt(board, capturedPawnPos);
      moves.push({ from: pos, to: capturePos, enPassant: true, capturedPiece: capturedPawn || undefined });
    }
  }

  return moves;
}

function getKnightMoves(board: (Piece | null)[][], pos: Position, color: Color): Move[] {
  const moves: Move[] = [];
  const offsets = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 },
  ];

  for (const offset of offsets) {
    const newPos: Position = { row: pos.row + offset.row, col: pos.col + offset.col };
    if (!isValidPosition(newPos)) continue;

    const targetPiece = getPieceAt(board, newPos);
    if (!targetPiece || targetPiece.color !== color) {
      addMove(moves, pos, newPos, board);
    }
  }

  return moves;
}

function getSlidingMoves(board: (Piece | null)[][], pos: Position, color: Color, directions: { row: number; col: number }[]): Move[] {
  const moves: Move[] = [];

  for (const dir of directions) {
    let newPos: Position = { row: pos.row + dir.row, col: pos.col + dir.col };

    while (isValidPosition(newPos)) {
      const targetPiece = getPieceAt(board, newPos);

      if (!targetPiece) {
        addMove(moves, pos, newPos, board);
      } else {
        if (targetPiece.color !== color) {
          addMove(moves, pos, newPos, board);
        }
        break;
      }

      newPos = { row: newPos.row + dir.row, col: newPos.col + dir.col };
    }
  }

  return moves;
}

function getBishopMoves(board: (Piece | null)[][], pos: Position, color: Color): Move[] {
  const directions = [
    { row: -1, col: -1 }, { row: -1, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 1 },
  ];
  return getSlidingMoves(board, pos, color, directions);
}

function getRookMoves(board: (Piece | null)[][], pos: Position, color: Color): Move[] {
  const directions = [
    { row: -1, col: 0 }, { row: 1, col: 0 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
  ];
  return getSlidingMoves(board, pos, color, directions);
}

function getQueenMoves(board: (Piece | null)[][], pos: Position, color: Color): Move[] {
  const directions = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
  ];
  return getSlidingMoves(board, pos, color, directions);
}

function getKingMoves(board: (Piece | null)[][], pos: Position, color: Color): Move[] {
  const moves: Move[] = [];
  const offsets = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
  ];

  for (const offset of offsets) {
    const newPos: Position = { row: pos.row + offset.row, col: pos.col + offset.col };
    if (!isValidPosition(newPos)) continue;

    const targetPiece = getPieceAt(board, newPos);
    if (!targetPiece || targetPiece.color !== color) {
      addMove(moves, pos, newPos, board);
    }
  }

  return moves;
}

export function isSquareAttacked(board: (Piece | null)[][], pos: Position, byColor: Color): boolean {
  // Check pawn attacks
  const pawnDirection = byColor === 'white' ? 1 : -1;
  const pawnAttackPositions = [
    { row: pos.row + pawnDirection, col: pos.col - 1 },
    { row: pos.row + pawnDirection, col: pos.col + 1 },
  ];
  for (const pawnPos of pawnAttackPositions) {
    if (isValidPosition(pawnPos)) {
      const piece = getPieceAt(board, pawnPos);
      if (piece && piece.type === 'pawn' && piece.color === byColor) {
        return true;
      }
    }
  }

  // Check knight attacks
  const knightOffsets = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 },
  ];
  for (const offset of knightOffsets) {
    const knightPos: Position = { row: pos.row + offset.row, col: pos.col + offset.col };
    if (isValidPosition(knightPos)) {
      const piece = getPieceAt(board, knightPos);
      if (piece && piece.type === 'knight' && piece.color === byColor) {
        return true;
      }
    }
  }

  // Check king attacks
  const kingOffsets = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
  ];
  for (const offset of kingOffsets) {
    const kingPos: Position = { row: pos.row + offset.row, col: pos.col + offset.col };
    if (isValidPosition(kingPos)) {
      const piece = getPieceAt(board, kingPos);
      if (piece && piece.type === 'king' && piece.color === byColor) {
        return true;
      }
    }
  }

  // Check sliding piece attacks (bishop, rook, queen)
  const diagonals = [
    { row: -1, col: -1 }, { row: -1, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 1 },
  ];
  const straights = [
    { row: -1, col: 0 }, { row: 1, col: 0 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
  ];

  for (const dir of diagonals) {
    let checkPos: Position = { row: pos.row + dir.row, col: pos.col + dir.col };
    while (isValidPosition(checkPos)) {
      const piece = getPieceAt(board, checkPos);
      if (piece) {
        if (piece.color === byColor && (piece.type === 'bishop' || piece.type === 'queen')) {
          return true;
        }
        break;
      }
      checkPos = { row: checkPos.row + dir.row, col: checkPos.col + dir.col };
    }
  }

  for (const dir of straights) {
    let checkPos: Position = { row: pos.row + dir.row, col: pos.col + dir.col };
    while (isValidPosition(checkPos)) {
      const piece = getPieceAt(board, checkPos);
      if (piece) {
        if (piece.color === byColor && (piece.type === 'rook' || piece.type === 'queen')) {
          return true;
        }
        break;
      }
      checkPos = { row: checkPos.row + dir.row, col: checkPos.col + dir.col };
    }
  }

  return false;
}

export function findKing(board: (Piece | null)[][], color: Color): Position | null {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

export function isInCheck(board: (Piece | null)[][], color: Color): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  return isSquareAttacked(board, kingPos, getOppositeColor(color));
}

function applyMoveToBoard(board: (Piece | null)[][], move: Move): (Piece | null)[][] {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[move.from.row][move.from.col];

  if (!piece) return newBoard;

  // Handle en passant capture
  if (move.enPassant) {
    const capturedPawnRow = move.from.row;
    newBoard[capturedPawnRow][move.to.col] = null;
  }

  // Handle castling
  if (move.castling) {
    const row = move.from.row;
    if (move.castling === 'kingside') {
      newBoard[row][5] = newBoard[row][7];
      newBoard[row][7] = null;
    } else {
      newBoard[row][3] = newBoard[row][0];
      newBoard[row][0] = null;
    }
  }

  // Move the piece
  newBoard[move.to.row][move.to.col] = move.promotion
    ? { type: move.promotion, color: piece.color }
    : piece;
  newBoard[move.from.row][move.from.col] = null;

  return newBoard;
}

function wouldBeInCheck(board: (Piece | null)[][], move: Move, color: Color): boolean {
  const newBoard = applyMoveToBoard(board, move);
  return isInCheck(newBoard, color);
}

function getCastlingMoves(state: GameState, color: Color): Move[] {
  const moves: Move[] = [];
  const row = color === 'white' ? 7 : 0;
  const rights = state.castlingRights[color];

  // Can't castle if in check
  if (isInCheck(state.board, color)) return moves;

  const enemyColor = getOppositeColor(color);

  // Kingside castling
  if (rights.kingside) {
    const kingPos: Position = { row, col: 4 };
    const f1: Position = { row, col: 5 };
    const g1: Position = { row, col: 6 };

    if (
      !getPieceAt(state.board, f1) &&
      !getPieceAt(state.board, g1) &&
      !isSquareAttacked(state.board, f1, enemyColor) &&
      !isSquareAttacked(state.board, g1, enemyColor)
    ) {
      moves.push({ from: kingPos, to: g1, castling: 'kingside' });
    }
  }

  // Queenside castling
  if (rights.queenside) {
    const kingPos: Position = { row, col: 4 };
    const d1: Position = { row, col: 3 };
    const c1: Position = { row, col: 2 };
    const b1: Position = { row, col: 1 };

    if (
      !getPieceAt(state.board, d1) &&
      !getPieceAt(state.board, c1) &&
      !getPieceAt(state.board, b1) &&
      !isSquareAttacked(state.board, d1, enemyColor) &&
      !isSquareAttacked(state.board, c1, enemyColor)
    ) {
      moves.push({ from: kingPos, to: c1, castling: 'queenside' });
    }
  }

  return moves;
}

export function getPseudoLegalMoves(state: GameState, pos: Position): Move[] {
  const piece = getPieceAt(state.board, pos);
  if (!piece) return [];

  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(state.board, pos, piece.color, state.enPassantTarget);
    case 'knight':
      return getKnightMoves(state.board, pos, piece.color);
    case 'bishop':
      return getBishopMoves(state.board, pos, piece.color);
    case 'rook':
      return getRookMoves(state.board, pos, piece.color);
    case 'queen':
      return getQueenMoves(state.board, pos, piece.color);
    case 'king':
      return getKingMoves(state.board, pos, piece.color);
    default:
      return [];
  }
}

export function getLegalMoves(state: GameState, pos: Position): Move[] {
  const piece = getPieceAt(state.board, pos);
  if (!piece || piece.color !== state.turn) return [];

  let moves = getPseudoLegalMoves(state, pos);

  // Add castling moves for king
  if (piece.type === 'king') {
    moves = [...moves, ...getCastlingMoves(state, piece.color)];
  }

  // Filter out moves that would leave the king in check
  return moves.filter(move => !wouldBeInCheck(state.board, move, piece.color));
}

export function getAllLegalMoves(state: GameState): Move[] {
  const moves: Move[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = state.board[row][col];
      if (piece && piece.color === state.turn) {
        moves.push(...getLegalMoves(state, { row, col }));
      }
    }
  }

  return moves;
}

export function makeMove(state: GameState, move: Move): GameState {
  const piece = getPieceAt(state.board, move.from);
  if (!piece) return state;

  const newBoard = applyMoveToBoard(state.board, move);

  // Update castling rights
  const newCastlingRights = { ...state.castlingRights };
  newCastlingRights.white = { ...state.castlingRights.white };
  newCastlingRights.black = { ...state.castlingRights.black };

  // King moves remove castling rights
  if (piece.type === 'king') {
    newCastlingRights[piece.color].kingside = false;
    newCastlingRights[piece.color].queenside = false;
  }

  // Rook moves or captures remove castling rights
  if (piece.type === 'rook') {
    if (move.from.col === 0) {
      newCastlingRights[piece.color].queenside = false;
    } else if (move.from.col === 7) {
      newCastlingRights[piece.color].kingside = false;
    }
  }

  // Rook captured
  if (move.to.row === 0 && move.to.col === 0) newCastlingRights.black.queenside = false;
  if (move.to.row === 0 && move.to.col === 7) newCastlingRights.black.kingside = false;
  if (move.to.row === 7 && move.to.col === 0) newCastlingRights.white.queenside = false;
  if (move.to.row === 7 && move.to.col === 7) newCastlingRights.white.kingside = false;

  // Update en passant target
  let newEnPassantTarget: Position | null = null;
  if (piece.type === 'pawn' && Math.abs(move.to.row - move.from.row) === 2) {
    newEnPassantTarget = {
      row: (move.from.row + move.to.row) / 2,
      col: move.from.col,
    };
  }

  // Update half move clock
  let newHalfMoveClock = state.halfMoveClock + 1;
  if (piece.type === 'pawn' || move.capturedPiece) {
    newHalfMoveClock = 0;
  }

  // Update full move number
  const newFullMoveNumber = state.turn === 'black' ? state.fullMoveNumber + 1 : state.fullMoveNumber;
  
  // Track captured pieces
  const newCapturedPieces = { ...state.capturedPieces };
  if (move.capturedPiece) {
    const capturedColor = move.capturedPiece.color;
    newCapturedPieces[capturedColor] = [...newCapturedPieces[capturedColor], move.capturedPiece.type];
  }

  return {
    board: newBoard,
    turn: getOppositeColor(state.turn),
    castlingRights: newCastlingRights,
    enPassantTarget: newEnPassantTarget,
    moveHistory: [...state.moveHistory, move],
    halfMoveClock: newHalfMoveClock,
    fullMoveNumber: newFullMoveNumber,
    capturedPieces: newCapturedPieces,
    lastMove: move,
  };
}

export function isCheckmate(state: GameState): boolean {
  if (!isInCheck(state.board, state.turn)) return false;
  return getAllLegalMoves(state).length === 0;
}

export function isStalemate(state: GameState): boolean {
  if (isInCheck(state.board, state.turn)) return false;
  return getAllLegalMoves(state).length === 0;
}

export function isDraw(state: GameState): boolean {
  // 50-move rule
  if (state.halfMoveClock >= 100) return true;

  // Stalemate
  if (isStalemate(state)) return true;

  // Insufficient material
  const pieces: Piece[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = state.board[row][col];
      if (piece) pieces.push(piece);
    }
  }

  // King vs King
  if (pieces.length === 2) return true;

  // King + Bishop vs King or King + Knight vs King
  if (pieces.length === 3) {
    const nonKings = pieces.filter(p => p.type !== 'king');
    if (nonKings.length === 1 && (nonKings[0].type === 'bishop' || nonKings[0].type === 'knight')) {
      return true;
    }
  }

  return false;
}

/**
 * Create a game state from FEN notation
 */
export function createGameStateFromFEN(fen: string): GameState {
  const parts = fen.split(' ');
  const position = parts[0];
  const activeColor = parts[1] as Color;
  const castling = parts[2];
  const enPassant = parts[3];
  const halfMoveClock = parseInt(parts[4] || '0', 10);
  const fullMoveNumber = parseInt(parts[5] || '1', 10);

  // Parse board
  const board: (Piece | null)[][] = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  const rows = position.split('/');
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    let col = 0;
    for (const char of rows[row]) {
      if (char >= '1' && char <= '8') {
        col += parseInt(char, 10);
      } else {
        const color = char === char.toUpperCase() ? 'white' : 'black';
        const type = char.toLowerCase() as PieceType;
        board[row][col] = { type, color };
        col++;
      }
    }
  }

  // Parse castling rights
  const castlingRights = {
    white: { kingside: castling.includes('K'), queenside: castling.includes('Q') },
    black: { kingside: castling.includes('k'), queenside: castling.includes('q') },
  };

  // Parse en passant target
  let enPassantTarget: Position | null = null;
  if (enPassant !== '-' && enPassant.length === 2) {
    const file = enPassant.charCodeAt(0) - 97; // 'a' -> 0
    const rank = 8 - parseInt(enPassant[1], 10); // '8' -> 0
    enPassantTarget = { row: rank, col: file };
  }

  return {
    board,
    turn: activeColor,
    castlingRights,
    enPassantTarget,
    moveHistory: [],
    halfMoveClock,
    fullMoveNumber,
    capturedPieces: { white: [], black: [] },
    lastMove: null,
  };
}
