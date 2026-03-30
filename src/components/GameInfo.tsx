import type { Color } from '../game/types';
import '../styles/components.css';

interface GameInfoProps {
  turn: Color;
  isAiThinking?: boolean;
  status?: string;
}

export function GameInfo({ turn, isAiThinking, status }: GameInfoProps) {
  return (
    <div className="game-info">
      <div className="turn-indicator">
        <div className={`turn-color ${turn}`}></div>
        <span>{turn === 'white' ? 'White' : 'Black'}'s Turn</span>
      </div>
      {isAiThinking && (
        <div className="ai-thinking">
          <span>AI thinking</span>
          <div className="thinking-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      {status && <div className="game-status">{status}</div>}
    </div>
  );
}
