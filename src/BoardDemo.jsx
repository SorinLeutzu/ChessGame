import React, { useState } from 'react';
import './App.css';
import ChessBoard from './ChessBoard.jsx';
import { useNavigate } from 'react-router-dom';

function BoardDemo() {
  const [count, setCount] = useState(0);
  const [moves, setMoves] = useState('');
  const navigate = useNavigate();

  
  const handleMoveUpdate = (move) => {
    setMoves(move);
  };

  return (
    <div>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          Count is {count}
        </button>
      </div>
      
      <p>{moves}</p>
      <ChessBoard onMoveUpdate={handleMoveUpdate} />
    </div>
  );
}

export default BoardDemo;
