import { useState } from 'react'
import { calculateWinner, createEmptyBoard, getNextPlayer, isBoardFull, isGameOver, makeMove } from './game/gameLogic'

function statusText(board) {
  const { winner } = calculateWinner(board)
  if (winner) return `Winner: ${winner}`
  if (isBoardFull(board)) return 'Draw'
  return `Next player: ${getNextPlayer(board)}`
}

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard())

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
      <p>{statusText(board)}</p>
      <div role="grid">
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            role="button"
            aria-label={cell ? `Cell, ${cell}` : 'Empty cell'}
            onClick={() => handleCellClick(index)}
            disabled={isGameOver(board)}
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
