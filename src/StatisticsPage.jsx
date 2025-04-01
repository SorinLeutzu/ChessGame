import React from 'react';
import './StatisticsPage.css';

const StatisticsPage = () => {
  const statistics = {
    totalGames: 120,
    wins: 75,
    losses: 40,
    draws: 5,
    highestRating: 2000,
    averageOpponentRating: 1850,
  };

  return (
    <div className="statistics-page">
      <h1 className="title">Player Statistics</h1>
      <div className="stats-container">
        <div className="stat-item">
          <h2>Total Games</h2>
          <p>{statistics.totalGames}</p>
        </div>
        <div className="stat-item">
          <h2>Wins</h2>
          <p>{statistics.wins}</p>
        </div>
        <div className="stat-item">
          <h2>Losses</h2>
          <p>{statistics.losses}</p>
        </div>
        <div className="stat-item">
          <h2>Draws</h2>
          <p>{statistics.draws}</p>
        </div>
        <div className="stat-item">
          <h2>Highest Rating</h2>
          <p>{statistics.highestRating}</p>
        </div>
        <div className="stat-item">
          <h2>Average Opponent Rating</h2>
          <p>{statistics.averageOpponentRating}</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
