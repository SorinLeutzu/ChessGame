import React from 'react';
import './MainMenu.css';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {

    const navigate = useNavigate();

  const handlePlayComputer = () => {
    console.log('Play against computer');
      navigate("/main_menu/against_computer");
      
      
  };

  const handleMultiplayer = () => {
    console.log('Multiplayer');
    
  };

  const handleStatistics = () => {
    console.log('Statistics');
    navigate("/main_menu/statistics")
  };

  return (
    <div className="main-menu">
      <h1 className="title">Chess Game</h1>
      <div className="buttons">
        <button className="menu-button" onClick={handlePlayComputer}>
          Play against computer
        </button>
        <button className="menu-button" onClick={handleMultiplayer}>
          Multiplayer
        </button>
        <button className="menu-button" onClick={handleStatistics}>
          Statistics
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
