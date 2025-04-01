import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import ChessBoard from './ChessBoard';
import { invoke } from '@tauri-apps/api/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import BoardDemo from "./BoardDemo";
import Login from "./Login";
import MainMenu from './MainMenu';
import AgainstComputer from "./AgainstComputer";
import StatisticsPage from './StatisticsPage.jsx';

function App() {
  

  return (
    
    
      
      <Router>

        
      <Routes>
        
       <Route exact path="/" element={<Login/>} />
      <Route path="/main_menu" element={<MainMenu/>} />
      <Route path="/main_menu/against_computer" element={<AgainstComputer/>} />
      <Route path="/main_menu/multiplayer" element={<MainMenu/>} />
      <Route path="/main_menu/statistics" element={<StatisticsPage/>} />
      <Route path="/main_menu/against_computer/game" element={<BoardDemo/>} />
      </Routes>
    
     
   
   
   
  </Router>
  
   
  );
}

export default App;
