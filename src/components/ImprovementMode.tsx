import type { GameSettings } from '../game/types';
import { useState } from 'react';
import '../styles/components.css';

interface ImprovementModeProps {
  settings: GameSettings;
  onBack: () => void;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: number;
  xp: number;
  maxXp: number;
  features: string[];
}

interface GameAnalysis {
  id: string;
  date: string;
  result: string;
  playerColor: string;
  mistakes: number;
  blunders: number;
  accuracy: number;
  keyMoments: string[];
}

export function ImprovementMode({ onBack }: ImprovementModeProps) {
  const [activeTab, setActiveTab] = useState<'training' | 'analysis' | 'openings' | 'gambits'>('training');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Mock training modules
  const trainingModules: TrainingModule[] = [
    {
      id: 'tactics',
      title: 'Tactical Patterns',
      description: 'Master common tactical motifs and combinations',
      icon: '🎯',
      level: 3,
      xp: 1200,
      maxXp: 1500,
      features: ['Forks', 'Pins', 'Skewers', 'Discovered Attacks', 'Double Attacks']
    },
    {
      id: 'endgames',
      title: 'Endgame Fundamentals',
      description: 'Learn essential endgame techniques',
      icon: '♚',
      level: 2,
      xp: 800,
      maxXp: 1200,
      features: ['King and Pawn', 'Rook Endgames', 'Opposition', 'Zugzwang']
    },
    {
      id: 'calculation',
      title: 'Calculation Skills',
      description: 'Improve your calculation depth and accuracy',
      icon: '🧠',
      level: 1,
      xp: 300,
      maxXp: 1000,
      features: ['Candidate Moves', 'Forcing Moves', 'Visualization', 'Blunder Prevention']
    }
  ];

  // Mock game analysis data
  const gameAnalyses: GameAnalysis[] = [
    {
      id: 'game-001',
      date: '2 hours ago',
      result: 'Win',
      playerColor: 'White',
      mistakes: 2,
      blunders: 0,
      accuracy: 87,
      keyMoments: ['Missed winning combination on move 15', 'Excellent endgame technique']
    },
    {
      id: 'game-002',
      date: '1 day ago',
      result: 'Loss',
      playerColor: 'Black',
      mistakes: 4,
      blunders: 1,
      accuracy: 72,
      keyMoments: ['Poor opening preparation', 'Missed tactical opportunity on move 8']
    }
  ];

  const openingsData = [
    {
      name: 'Sicilian Defense',
      description: 'Popular response to 1.e4, leads to dynamic play',
      popularity: '45%',
      winRate: '52%',
      keyIdeas: ['Asymmetrical pawn structure', 'Queenside expansion', 'Central counterplay']
    },
    {
      name: 'Ruy Lopez',
      description: 'Classical opening with deep strategic ideas',
      popularity: '30%',
      winRate: '55%',
      keyIdeas: ['Pressure on e5 pawn', 'Kingside development', 'Long-term positional play']
    },
    {
      name: 'Queen\'s Gambit',
      description: 'Solid opening for White with central control',
      popularity: '25%',
      winRate: '58%',
      keyIdeas: ['Central pawn majority', 'Piece development', 'Strategic pawn structure']
    }
  ];

  const gambitsData = [
    {
      name: 'King\'s Gambit',
      description: 'Aggressive opening sacrificing a pawn for rapid development',
      riskLevel: 'High',
      successRate: '45%',
      keyIdeas: ['Rapid development', 'Open lines', 'Attacking chances']
    },
    {
      name: 'Evans Gambit',
      description: 'Romantic era gambit in the Italian Game',
      riskLevel: 'Medium',
      successRate: '52%',
      keyIdeas: ['Bishop pair', 'Central control', 'Initiative']
    },
    {
      name: 'Benko Gambit',
      description: 'Modern gambit with long-term compensation',
      riskLevel: 'Low',
      successRate: '60%',
      keyIdeas: ['Queenside pressure', 'Long-term compensation', 'Endgame advantage']
    }
  ];

  const getWinProbabilityColor = (accuracy: number) => {
    if (accuracy >= 85) return '#4caf50'; // Green
    if (accuracy >= 70) return '#ffc107'; // Yellow
    return '#f44336'; // Red
  };

  const TrainingTab = () => (
    <div className="training-tab">
      <div className="training-header">
        <h2>Chess Training</h2>
        <p>Improve your skills through focused practice</p>
      </div>
      
      <div className="training-grid">
        {trainingModules.map(module => (
          <div 
            key={module.id} 
            className={`training-card ${selectedModule === module.id ? 'selected' : ''}`}
            onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
          >
            <div className="card-header">
              <div className="card-icon">{module.icon}</div>
              <h3>{module.title}</h3>
            </div>
            <div className="card-content">
              <p>{module.description}</p>
              <div className="level-indicator">
                <span>Level {module.level}</span>
                <div className="xp-bar">
                  <div 
                    className="xp-fill" 
                    style={{ 
                      width: `${(module.xp / module.maxXp) * 100}%`,
                      background: `linear-gradient(90deg, #4caf50, #81c784)`
                    }} 
                  ></div>
                </div>
                <span className="xp-text">{module.xp}/{module.maxXp} XP</span>
              </div>
              {selectedModule === module.id && (
                <div className="module-features">
                  <h4>What you'll learn:</h4>
                  <ul>
                    {module.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button className="start-training-btn">Start Training</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AnalysisTab = () => (
    <div className="analysis-tab">
      <div className="analysis-header">
        <h2>Game Analysis</h2>
        <p>Review your games and improve from your mistakes</p>
      </div>
      
      <div className="analysis-grid">
        {gameAnalyses.map(game => (
          <div 
            key={game.id} 
            className={`analysis-card ${selectedGame === game.id ? 'selected' : ''}`}
            onClick={() => setSelectedGame(selectedGame === game.id ? null : game.id)}
          >
            <div className="analysis-header-row">
              <div className="game-info">
                <span className="game-date">{game.date}</span>
                <span className={`game-result ${game.result.toLowerCase()}`}>{game.result}</span>
                <span className="game-color">{game.playerColor}</span>
              </div>
              <div className="win-probability">
                <div className="prob-label">Accuracy</div>
                <div className="prob-bar">
                  <div 
                    className="prob-fill" 
                    style={{ 
                      height: `${game.accuracy}%`,
                      background: getWinProbabilityColor(game.accuracy)
                    }} 
                  ></div>
                </div>
                <div className="prob-value">{game.accuracy}%</div>
              </div>
            </div>
            
            <div className="mistake-summary">
              <div className="mistake-item">
                <span className="mistake-icon">⚠️</span>
                <span>{game.mistakes} Mistakes</span>
              </div>
              <div className="mistake-item">
                <span className="mistake-icon">❌</span>
                <span>{game.blunders} Blunders</span>
              </div>
            </div>

            {selectedGame === game.id && (
              <div className="detailed-analysis">
                <h4>Key Moments:</h4>
                <ul>
                  {game.keyMoments.map((moment, index) => (
                    <li key={index}>{moment}</li>
                  ))}
                </ul>
                <div className="analysis-actions">
                  <button className="analyze-btn">Full Analysis</button>
                  <button className="learn-btn">Learn from Mistakes</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const OpeningsTab = () => (
    <div className="openings-tab">
      <div className="openings-header">
        <h2>Opening Repertoire</h2>
        <p>Master essential opening principles and variations</p>
      </div>
      
      <div className="openings-grid">
        {openingsData.map((opening, index) => (
          <div key={index} className="opening-card">
            <div className="opening-header">
              <h3>{opening.name}</h3>
              <div className="opening-stats">
                <span className="stat-item">Popularity: {opening.popularity}</span>
                <span className="stat-item">Win Rate: {opening.winRate}</span>
              </div>
            </div>
            <p className="opening-description">{opening.description}</p>
            <div className="opening-ideas">
              <h4>Key Ideas:</h4>
              <ul>
                {opening.keyIdeas.map((idea, i) => (
                  <li key={i}>{idea}</li>
                ))}
              </ul>
            </div>
            <button className="study-opening-btn">Study This Opening</button>
          </div>
        ))}
      </div>
    </div>
  );

  const GambitsTab = () => (
    <div className="gambits-tab">
      <div className="gambits-header">
        <h2>Gambit Mastery</h2>
        <p>Learn sacrificial play and initiative</p>
      </div>
      
      <div className="gambits-grid">
        {gambitsData.map((gambit, index) => (
          <div key={index} className="gambit-card">
            <div className="gambit-header">
              <h3>{gambit.name}</h3>
              <div className="gambit-risk">
                <span className={`risk-badge ${gambit.riskLevel.toLowerCase()}`}>
                  {gambit.riskLevel} Risk
                </span>
                <span className="success-rate">Success: {gambit.successRate}</span>
              </div>
            </div>
            <p className="gambit-description">{gambit.description}</p>
            <div className="gambit-ideas">
              <h4>Key Ideas:</h4>
              <ul>
                {gambit.keyIdeas.map((idea, i) => (
                  <li key={i}>{idea}</li>
                ))}
              </ul>
            </div>
            <button className="learn-gambit-btn">Learn This Gambit</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="improvement-mode">
      <div className="improvement-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Menu
        </button>
        <h1>Chess Improvement</h1>
        <div className="improvement-stats">
          <div className="stat-box">
            <span className="stat-label">Total Training Time</span>
            <span className="stat-number">15h 32m</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Games Analyzed</span>
            <span className="stat-number">24</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Improvement</span>
            <span className="stat-number">+120 ELO</span>
          </div>
        </div>
      </div>

      <div className="improvement-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => setActiveTab('training')}
          >
            🎯 Training
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            🤖 Analysis
          </button>
          <button 
            className={`tab-btn ${activeTab === 'openings' ? 'active' : ''}`}
            onClick={() => setActiveTab('openings')}
          >
            ♟️ Openings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gambits' ? 'active' : ''}`}
            onClick={() => setActiveTab('gambits')}
          >
            🎲 Gambits
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'training' && <TrainingTab />}
          {activeTab === 'analysis' && <AnalysisTab />}
          {activeTab === 'openings' && <OpeningsTab />}
          {activeTab === 'gambits' && <GambitsTab />}
        </div>
      </div>
    </div>
  );
}