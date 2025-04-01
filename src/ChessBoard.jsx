
import React, { useState, useEffect } from 'react';
import './ChessBoard.css';
import { invoke } from '@tauri-apps/api/core';


const initialBoardSetup = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

const ChessBoard = () => {
  const [board, setBoard] = useState(initialBoardSetup);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [turn, setTurn] = useState('white');
  const [gameOver, setGameOver] = useState(false);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [promotionPosition, setPromotionPosition] = useState(null);
  const [pawnToBeDeleted,setPawntoBeDeleted] = useState(null);
  const [gameState, setGameState]= useState("Ongoing");

  const handleClick = async (row, col) => {
    if (gameOver || turn === 'black' || showPromotionDialog) return;

    if (selectedPiece) {
      if (validMoves.some(v => v.row === row && v.col === col)) {
        movePiece(selectedPiece, { row, col });
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else {
      selectPiece(row, col);
    }
  };

  const selectPiece = async (row, col) => {
    const piece = board[row][col];
    if (!piece || (turn === 'white' && piece.toUpperCase() !== piece) || (turn === 'black' && piece.toLowerCase() !== piece)) {
      return;
    }

    const showMovesArgs = {
      colour: turn,
      piece_position: { row, col },
      chess_board: board,
    };

    try {
      const response = await invoke('show_moves', { s: showMovesArgs });
      if (response && response.positions) {
        setSelectedPiece({ row, col });
        setValidMoves(response.positions);
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } catch (error) {
      console.error('Error calling show_moves:', error);
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };

  const movePiece = (from, to) => {
    const newBoard = board.map(row => row.slice());
    const piece = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = '';
    newBoard[to.row][to.col] = piece;

    if (piece === '♙' && to.row === 0) {
      setShowPromotionDialog(true);
      setPromotionPosition(to);
      setPawntoBeDeleted(from)
    } else if (piece === '♟' && to.row === 7) {
      setShowPromotionDialog(true);
      setPromotionPosition(to);
      setPawntoBeDeleted(from);
    } else {
      checkForGameOver(board, to);
      setBoard(newBoard);
      setSelectedPiece(null);
      setValidMoves([]);
      checkForGameOver(board, to);
      setTurn(turn === 'white' ? 'black' : 'white');
    }
  };

  const promotePawn = (newPiece) => {
    if (promotionPosition) {
      const newBoard = board.map(row => row.slice());
      newBoard[promotionPosition.row][promotionPosition.col] = newPiece;
      //!
      newBoard[pawnToBeDeleted.row][pawnToBeDeleted.col]='';
      setBoard(newBoard);
      setShowPromotionDialog(false);
      setPromotionPosition(null);
      checkForGameOver(newBoard, promotionPosition);
      setTurn(turn === 'white' ? 'black' : 'white');
    }
  };

  const checkForGameOver = (newBoard, position) => {
    if (newBoard[position.row][position.col] === '♔' || newBoard[position.row][position.col] === '♚') {
      setGameOver(true);

      console.log(`${turn} wins!`);

      setGameState(`${turn} wins!`);
      setTimeout(() => {
        resetGame();
      }, 2500); 

      
    }
  };

  const computerMove = async () => {
    const moves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.toLowerCase() === piece) { 
          const showMovesArgs = {
            colour: 'black',
            piece_position: { row, col },
            chess_board: board,
          };
          try {
            const response = await invoke('show_moves', { s: showMovesArgs });
            if (response && response.positions) {
              response.positions.forEach(pos => moves.push({ from: { row, col }, to: pos }));
            }
          } catch (error) {
            console.error('Error calling show_moves:', error);
          }
        }
      }
    }

    if (moves.length === 0) {
      setGameOver(true);
      alert('Draw! No valid moves for black.');
      return;
    }

    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    movePiece(randomMove.from, randomMove.to);
  };

  useEffect(() => {
    if (turn === 'black' && !gameOver && !showPromotionDialog) {
      setTimeout(() => {
        computerMove();
      }, 500); 
    }
  }, [turn, gameOver, showPromotionDialog]);

  const resetGame = () => {

    setGameState("Ongoing ");
    setBoard(initialBoardSetup);
    setSelectedPiece(null);
    setValidMoves([]);
    setTurn('white');
    setGameOver(false);
    setShowPromotionDialog(false);
    setPromotionPosition(null);
  };

  const renderSquare = (row, col) => {
    const isBlack = (row + col) % 2 === 1;
    const squareClass = isBlack ? 'square black' : 'square white';
    const piece = board[row][col];

    return (
      <div key={`${row}-${col}`} className={squareClass} onClick={() => handleClick(row, col)} style={{ position: 'relative' }}>
        {piece && <span className="piece">{piece}</span>}
        {validMoves.some(v => v.row === row && v.col === col) && <div className="valid-move-indicator" />}
      </div>
    );
    
  };

  const renderBoard = () => {
    const boardRender = [];
    for (let row = 0; row < 8; row++) {
      const rowSquares = [];
      for (let col = 0; col < 8; col++) {
        rowSquares.push(renderSquare(row, col));
      }
      boardRender.push(
        <div key={`row-${row}`} className="board-row">
          {rowSquares}
        </div>
      );
      
    }
    return boardRender;
  };

  const renderPromotionDialog = () => {
    return (
      <div className="promotion-dialog">
        <div className="promotion-options">
          <button onClick={() => promotePawn(turn === 'white' ? '♕' : '♛')}>Queen</button>
          <button onClick={() => promotePawn(turn === 'white' ? '♖' : '♜')}>Rook</button>
          <button onClick={() => promotePawn(turn === 'white' ? '♗' : '♝')}>Bishop</button>
          <button onClick={() => promotePawn(turn === 'white' ? '♘' : '♞')}>Knight</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="chess-board">{renderBoard()}</div>
      <div className="position-display">Turn: {turn}</div>
      <div className="valid-moves-display">
        Valid Moves: {validMoves.map(move => `${move.col},${7 - move.row}`).join(', ')}
      </div>
      <button onClick={resetGame}>Reset</button>
      {showPromotionDialog && renderPromotionDialog()}
    </div>
  );
};

export default ChessBoard;
