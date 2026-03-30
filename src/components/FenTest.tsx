import { createGameStateFromFEN } from '../game/moves';
import { useState } from 'react';

export function FenTest() {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [gameState, setGameState] = useState<any>(null);

  const testFen = () => {
    const state = createGameStateFromFEN(fen);
    setGameState(state);
    console.log('FEN parsed successfully:', state);
    console.log('Board has', state.board.flat().filter(p => p).length, 'pieces');
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>FEN Test Component</h2>
      <input
        value={fen}
        onChange={(e) => setFen(e.target.value)}
        style={{ color: 'black', width: '500px' }}
      />
      <button onClick={testFen} style={{ marginLeft: '10px' }}>
        Test FEN Parsing
      </button>
      
      {gameState && (
        <div style={{ marginTop: '20px' }}>
          <h3>Debug Info:</h3>
          <p>Board has {gameState.board.flat().filter(p => p).length} pieces</p>
          <p>Turn: {gameState.turn}</p>
          <p>Castling: {JSON.stringify(gameState.castlingRights)}</p>
        </div>
      )}
    </div>
  );
}