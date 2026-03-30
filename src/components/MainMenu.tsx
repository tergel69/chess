import { useState } from 'react';
import type { Difficulty, Color, GameSettings } from '../game/types';
import '../styles/components.css';

interface MainMenuProps {
  onStartGame: (settings: GameSettings) => void;
}

type MenuState = 'main' | 'difficulty' | 'color';

interface PlayerStats {
  elo: number;
  gamesPlayed: number;
  winRate: number;
  lastPlayed: string;
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  const [menuState, setMenuState] = useState<MenuState>('main');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('intermediate');
  
  // Mock player stats - in a real app this would come from localStorage or a backend
  const [playerStats] = useState<PlayerStats>({
    elo: 1400,
    gamesPlayed: 25,
    winRate: 68,
    lastPlayed: '2 hours ago'
  });

  const handlePassAndPlay = () => {
    onStartGame({ mode: 'pass-and-play' });
  };

  const handleVsAi = () => {
    setMenuState('difficulty');
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setMenuState('color');
  };

  const handleColorSelect = (color: Color) => {
    onStartGame({
      mode: 'vs-ai',
      difficulty: selectedDifficulty,
      playerColor: color,
    });
  };

  const handleBack = () => {
    if (menuState === 'color') {
      setMenuState('main');
    } else if (menuState === 'difficulty') {
      setMenuState('main');
    }
  };

  if (menuState === 'main') {
    return (
      <div className="main-menu">
        <div className="menu-header">
          <h1>Chess Master</h1>
          <div className="player-stats">
            <div className="stat-item">
              <span className="stat-label">ELO</span>
              <span className="stat-value">{playerStats.elo}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Games</span>
              <span className="stat-value">{playerStats.gamesPlayed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Win Rate</span>
              <span className="stat-value">{playerStats.winRate}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Played</span>
              <span className="stat-value">{playerStats.lastPlayed}</span>
            </div>
          </div>
        </div>
        
        <div className="menu-grid">
          <button className="menu-card game-mode" onClick={handlePassAndPlay}>
            <div className="card-icon">👥</div>
            <h3>Pass and Play</h3>
            <p>Play with a friend on the same device</p>
          </button>
          
          <button className="menu-card game-mode" onClick={handleVsAi}>
            <div className="card-icon">🤖</div>
            <h3>VS AI</h3>
            <p>Challenge the computer with adjustable difficulty</p>
          </button>
        </div>
      </div>
    );
  }

  if (menuState === 'difficulty') {
    return (
      <div className="main-menu">
        <button className="back-button" onClick={handleBack}>
          ← Back to Menu
        </button>
        <div className="difficulty-selection">
          <h2>Choose AI Difficulty</h2>
          <div className="difficulty-grid">
            <button
              className={`difficulty-card ${selectedDifficulty === 'beginner' ? 'selected' : ''}`}
              onClick={() => handleDifficultySelect('beginner')}
            >
              <div className="difficulty-badge">800-1400 ELO</div>
              <h3>Beginner</h3>
              <p>Perfect for learning the basics and developing fundamental skills</p>
              <div className="card-stats">
                <span>🎯 Simple tactics</span>
                <span>⏱️ No time pressure</span>
              </div>
            </button>
            
            <button
              className={`difficulty-card ${selectedDifficulty === 'intermediate' ? 'selected' : ''}`}
              onClick={() => handleDifficultySelect('intermediate')}
            >
              <div className="difficulty-badge">1400-1800 ELO</div>
              <h3>Intermediate</h3>
              <p>Challenging opponents with solid strategies and tactical awareness</p>
              <div className="card-stats">
                <span>🧠 Complex combinations</span>
                <span>⚡ Faster time controls</span>
              </div>
            </button>
            
            <button
              className={`difficulty-card ${selectedDifficulty === 'master' ? 'selected' : ''}`}
              onClick={() => handleDifficultySelect('master')}
            >
              <div className="difficulty-badge">1800-2000 ELO</div>
              <h3>Master</h3>
              <p>Test your skills against advanced AI with deep positional understanding</p>
              <div className="card-stats">
                <span>👑 Tournament level</span>
                <span>⚡ Blitz controls</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (menuState === 'color') {
    return (
      <div className="main-menu">
        <button className="back-button" onClick={handleBack}>
          ← Back to Menu
        </button>
        <div className="color-selection">
          <h2>Choose Your Color</h2>
          <div className="color-buttons">
            <button className="color-button white" onClick={() => handleColorSelect('white')}>
              White
            </button>
            <button className="color-button black" onClick={() => handleColorSelect('black')}>
              Black
            </button>
          </div>
        </div>
      </div>
    );
  }
}