import React, { useState } from 'react';
import './AgainstComputer.css';
import { useNavigate } from 'react-router-dom';

const AgainstComputer = () => {
  const [color, setColor] = useState('white');
  const [gameLength, setGameLength] = useState('10');

  const navigate=useNavigate();

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleGameLengthChange = (e) => {
    setGameLength(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Starting game with settings:', { color, gameLength });
    

    navigate("/main_menu/against_computer/game");
  };

  return (
    <div className="against-computer-container">
      <h2>Play Against Computer</h2>
      <form onSubmit={handleSubmit} className="against-computer-form">
        <div className="form-group">
          <label htmlFor="color">Choose Your Color:</label>
          <select id="color" value={color} onChange={handleColorChange}>
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="gameLength">Game Length (minutes):</label>
          <select id="gameLength" value={gameLength} onChange={handleGameLengthChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="30">30</option>
          </select>
        </div>
        <button type="submit" className="start-game-button">Start Game</button>
      </form>
    </div>
  );
};

export default AgainstComputer;
