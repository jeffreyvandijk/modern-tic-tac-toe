import { useState } from 'react'
import { calculateWinner, createEmptyBoard, getNextPlayer, isBoardFull, makeMove } from './game/gameLogic'

function statusText({ winner, isFull, nextPlayer }) {
  if (winner) return `Winner: ${winner}`
  if (isFull) return 'Draw'
  return `Next player: ${nextPlayer}`
}

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard())

  const { winner } = calculateWinner(board)
  const isFull = isBoardFull(board)
  const gameOver = winner !== null || isFull

  function handleCellClick(index) {
    const { board: next, error } = makeMove(board, index)
    if (!error) setBoard(next)
  }

  function handleReset() {
    setBoard(createEmptyBoard())
  }

  return (
    <main>
      <h1>Tic-Tac-Toe</h1>
      <p>{statusText({ winner, isFull, nextPlayer: getNextPlayer(board) })}</p>
      <div>
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            aria-label={cell ? `Cell, ${cell}` : 'Empty cell'}
            onClick={() => handleCellClick(index)}
            disabled={gameOver}
          >
            {cell ?? ''}
          </button>
        ))}
      </div>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </main>
  )
}
