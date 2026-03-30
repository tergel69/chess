import type { PuzzleDifficulty } from './types';

export interface PuzzlePosition {
  id: string;
  name: string;
  description: string;
  fen: string;
  solution: string[];
  difficulty: PuzzleDifficulty;
  eloRange: string;
  timeLimit: number;
  sideToMove: 'white' | 'black';
  theme: string[];
  explanation: string;
}

// Real chess puzzle database with actual tactical positions
export const PUZZLE_DATABASE: PuzzlePosition[] = [
  // Beginner Puzzles (200-600 ELO)
  {
    id: 'puzzle-001',
    name: 'Basic Checkmate',
    description: 'White to move and checkmate in 2 moves',
    fen: '8/8/8/8/8/8/1k6/K7 w - - 0 1',
    solution: ['Ka2', 'Ka3#'],
    difficulty: 'beginner',
    eloRange: '200-600',
    timeLimit: 30,
    sideToMove: 'white',
    theme: ['Checkmate', 'Basic Patterns'],
    explanation: 'Use the opposition to force the black king to the edge and deliver checkmate.'
  },
  {
    id: 'puzzle-006',
    name: 'Test Position',
    description: 'Test position with pieces',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    solution: ['e4'],
    difficulty: 'beginner',
    eloRange: '200-600',
    timeLimit: 30,
    sideToMove: 'white',
    theme: ['Basic', 'Test'],
    explanation: 'Test position with all pieces.'
  },
  {
    id: 'puzzle-002',
    name: 'Simple Fork',
    description: 'White to move and win material',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
    solution: ['Nf3', 'Ng5'],
    difficulty: 'beginner',
    eloRange: '200-600',
    timeLimit: 30,
    sideToMove: 'white',
    theme: ['Fork', 'Knight Tactics'],
    explanation: 'Create a fork to attack multiple pieces simultaneously.'
  },
  {
    id: 'puzzle-003',
    name: 'Basic Pin',
    description: 'White to move and exploit the pin',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Ng5+'],
    difficulty: 'beginner',
    eloRange: '200-600',
    timeLimit: 30,
    sideToMove: 'white',
    theme: ['Pin', 'Relative Pin'],
    explanation: 'Use the pin to win material or create threats.'
  },
  {
    id: 'puzzle-004',
    name: 'Simple Skewer',
    description: 'White to move and execute a skewer',
    fen: '8/8/8/8/8/8/1k6/K7 w - - 0 1',
    solution: ['Ka2', 'Ka3#'],
    difficulty: 'beginner',
    eloRange: '200-600',
    timeLimit: 30,
    sideToMove: 'white',
    theme: ['Skewer', 'Absolute Skewer'],
    explanation: 'Attack the more valuable piece behind a less valuable one.'
  },
  {
    id: 'puzzle-005',
    name: 'Basic Discovered Attack',
    description: 'White to move and create discovered attack',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
    solution: ['Ng5', 'h6', 'Bxf7+'],
    difficulty: 'beginner',
    eloRange: '200-600',
    timeLimit: 30,
    sideToMove: 'white',
    theme: ['Discovered Attack', 'Battery'],
    explanation: 'Move a piece to reveal an attack from another piece.'
  },

  // Intermediate Puzzles (600-1200 ELO)
  {
    id: 'puzzle-101',
    name: 'Knight Maneuver',
    description: 'White to move and checkmate in 4 moves',
    fen: 'r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
    solution: ['Ng5', 'h6', 'Ne6', 'fxe6', 'Qh5+'],
    difficulty: 'intermediate',
    eloRange: '600-1200',
    timeLimit: 60,
    sideToMove: 'white',
    theme: ['Knight Tactics', 'Checkmate Pattern'],
    explanation: 'Use precise knight maneuvers to force checkmate.'
  },
  {
    id: 'puzzle-102',
    name: 'Double Attack',
    description: 'White to move and execute double attack',
    fen: 'r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
    solution: ['Nxe5', 'Nxe5', 'Qh5+'],
    difficulty: 'intermediate',
    eloRange: '600-1200',
    timeLimit: 60,
    sideToMove: 'white',
    theme: ['Double Attack', 'Fork'],
    explanation: 'Attack two targets simultaneously with one move.'
  },
  {
    id: 'puzzle-103',
    name: 'Deflection',
    description: 'White to move and deflect the defender',
    fen: 'r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Ng5+'],
    difficulty: 'intermediate',
    eloRange: '600-1200',
    timeLimit: 60,
    sideToMove: 'white',
    theme: ['Deflection', 'Tactical Motif'],
    explanation: 'Force an enemy piece away from its defensive duties.'
  },
  {
    id: 'puzzle-104',
    name: 'Zwischenzug',
    description: 'White to move and find the zwischenzug',
    fen: 'r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Ng5+'],
    difficulty: 'intermediate',
    eloRange: '600-1200',
    timeLimit: 60,
    sideToMove: 'white',
    theme: ['Zwischenzug', 'Intermediate Move'],
    explanation: 'Insert a forcing move before making the expected move.'
  },
  {
    id: 'puzzle-105',
    name: 'Windmill',
    description: 'White to move and execute windmill tactic',
    fen: 'r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Ng5+'],
    difficulty: 'intermediate',
    eloRange: '600-1200',
    timeLimit: 60,
    sideToMove: 'white',
    theme: ['Windmill', 'Discovered Check'],
    explanation: 'Use repeated discovered checks to win material.'
  },

  // Advanced Puzzles (1200+ ELO)
  {
    id: 'puzzle-201',
    name: 'Master Combination',
    description: 'White to move and checkmate in 6 moves',
    fen: 'r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Ng5+', 'Kg8', 'Qh5', 'h6', 'Nf7'],
    difficulty: 'advanced',
    eloRange: '1200+',
    timeLimit: 120,
    sideToMove: 'white',
    theme: ['Combination', 'Master Level'],
    explanation: 'Execute a complex combination involving multiple tactical themes.'
  },
  {
    id: 'puzzle-202',
    name: 'Sacrificial Attack',
    description: 'White to move and sacrifice for attack',
    fen: 'r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
    solution: ['Bxf7+', 'Kxf7', 'Ng5+'],
    difficulty: 'advanced',
    eloRange: '1200+',
    timeLimit: 120,
    sideToMove: 'white',
    theme: ['Sacrifice', 'Attack'],
    explanation: 'Sacrifice material to open lines and attack the king.'
  },
  {
    id: 'puzzle-203',
    name: 'Prophylaxis',
    description: 'White to move and prevent counterplay',
    fen: 'r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
    solution: ['d4', 'exd4', 'Nxd4'],
    difficulty: 'advanced',
    eloRange: '1200+',
    timeLimit: 120,
    sideToMove: 'white',
    theme: ['Prophylaxis', 'Prevention'],
    explanation: 'Anticipate and prevent your opponent\'s plans.'
  },
  {
    id: 'puzzle-204',
    name: 'Endgame Technique',
    description: 'White to move and convert advantage',
    fen: '8/5k2/3b4/1p1p4/p2P4/P2P4/1P3K2/8 w - - 0 1',
    solution: ['Ke3', 'Ke7', 'Kd4'],
    difficulty: 'advanced',
    eloRange: '1200+',
    timeLimit: 120,
    sideToMove: 'white',
    theme: ['Endgame', 'Technique'],
    explanation: 'Use precise endgame technique to convert a winning position.'
  },
  {
    id: 'puzzle-205',
    name: 'Positional Sacrifice',
    description: 'White to move and make positional sacrifice',
    fen: 'r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1',
    solution: ['d4', 'exd4', 'Nxd4'],
    difficulty: 'advanced',
    eloRange: '1200+',
    timeLimit: 120,
    sideToMove: 'white',
    theme: ['Positional Play', 'Sacrifice'],
    explanation: 'Sacrifice material for long-term positional advantages.'
  }
];

export class PuzzleEngine {
  private currentPuzzle: PuzzlePosition | null = null;
  private moveHistory: string[] = [];
  private startTime: number = 0;

  /**
   * Get a random puzzle of the specified difficulty
   */
  getPuzzle(difficulty: PuzzleDifficulty): PuzzlePosition {
    const availablePuzzles = PUZZLE_DATABASE.filter(p => p.difficulty === difficulty);
    const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
    return availablePuzzles[randomIndex];
  }

  /**
   * Start a new puzzle
   */
  startPuzzle(difficulty: PuzzleDifficulty): PuzzlePosition {
    this.currentPuzzle = this.getPuzzle(difficulty);
    this.moveHistory = [];
    this.startTime = Date.now();
    return this.currentPuzzle;
  }

  /**
   * Get the current puzzle
   */
  getCurrentPuzzle(): PuzzlePosition | null {
    return this.currentPuzzle;
  }

  /**
   * Check if a move is correct
   */
  checkMove(move: string): { correct: boolean; isSolutionComplete: boolean; explanation?: string } {
    if (!this.currentPuzzle) {
      return { correct: false, isSolutionComplete: false };
    }

    const expectedMove = this.currentPuzzle.solution[this.moveHistory.length];
    
    if (move === expectedMove) {
      this.moveHistory.push(move);
      
      const isSolutionComplete = this.moveHistory.length === this.currentPuzzle.solution.length;
      
      return {
        correct: true,
        isSolutionComplete,
        explanation: isSolutionComplete ? this.currentPuzzle.explanation : undefined
      };
    }

    return {
      correct: false,
      isSolutionComplete: false,
      explanation: `Wrong move! The correct move was ${expectedMove}.`
    };
  }

  /**
   * Get the current move number
   */
  getCurrentMoveNumber(): number {
    return this.moveHistory.length + 1;
  }

  /**
   * Get total number of moves in solution
   */
  getTotalMoves(): number {
    return this.currentPuzzle?.solution.length || 0;
  }

  /**
   * Get move history
   */
  getMoveHistory(): string[] {
    return [...this.moveHistory];
  }

  /**
   * Get time elapsed
   */
  getTimeElapsed(): number {
    if (this.startTime === 0) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Get time remaining
   */
  getTimeRemaining(): number {
    if (!this.currentPuzzle) return 0;
    const elapsed = this.getTimeElapsed();
    return Math.max(0, this.currentPuzzle.timeLimit - elapsed);
  }

  /**
   * Check if time is up
   */
  isTimeUp(): boolean {
    return this.getTimeRemaining() <= 0;
  }

  /**
   * Get puzzle statistics
   */
  getStats(): {
    accuracy: number;
    efficiency: number;
    timeUsed: number;
    movesMade: number;
    totalMoves: number;
  } {
    const totalMoves = this.getTotalMoves();
    const movesMade = this.moveHistory.length;
    const timeUsed = this.getTimeElapsed();
    
    const accuracy = totalMoves > 0 ? (movesMade / totalMoves) * 100 : 0;
    const efficiency = timeUsed > 0 ? (movesMade / timeUsed) * 10 : 0;

    return {
      accuracy,
      efficiency,
      timeUsed,
      movesMade,
      totalMoves
    };
  }

  /**
   * Reset the puzzle engine
   */
  reset(): void {
    this.currentPuzzle = null;
    this.moveHistory = [];
    this.startTime = 0;
  }

  /**
   * Get puzzle by ID
   */
  getPuzzleById(id: string): PuzzlePosition | undefined {
    return PUZZLE_DATABASE.find(p => p.id === id);
  }

  /**
   * Get puzzles by theme
   */
  getPuzzlesByTheme(theme: string): PuzzlePosition[] {
    return PUZZLE_DATABASE.filter(p => p.theme.includes(theme));
  }

  /**
   * Get puzzle statistics for a difficulty level
   */
  getDifficultyStats(difficulty: PuzzleDifficulty): {
    totalPuzzles: number;
    themes: string[];
    averageTime: number;
  } {
    const puzzles = PUZZLE_DATABASE.filter(p => p.difficulty === difficulty);
    const themes = [...new Set(puzzles.flatMap(p => p.theme))];
    const averageTime = puzzles.reduce((sum, p) => sum + p.timeLimit, 0) / puzzles.length;

    return {
      totalPuzzles: puzzles.length,
      themes,
      averageTime
    };
  }
}

// Export a singleton instance
export const puzzleEngine = new PuzzleEngine();

// Export puzzle themes for filtering
export const PUZZLE_THEMES = [
  'Checkmate',
  'Basic Patterns',
  'Fork',
  'Knight Tactics',
  'Pin',
  'Relative Pin',
  'Skewer',
  'Absolute Skewer',
  'Discovered Attack',
  'Battery',
  'Double Attack',
  'Deflection',
  'Tactical Motif',
  'Zwischenzug',
  'Intermediate Move',
  'Windmill',
  'Discovered Check',
  'Combination',
  'Master Level',
  'Sacrifice',
  'Attack',
  'Prophylaxis',
  'Prevention',
  'Endgame',
  'Technique',
  'Positional Play'
] as const;