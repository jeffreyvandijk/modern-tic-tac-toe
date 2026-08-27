import { useState } from 'react'
import { createEmptyBoard, getGameStatus, makeMove } from './game/gameLogic'

function statusText({ winner, isFull, nextPlayer }) {
  if (winner) return `Winner: ${winner}`
  if (isFull) return 'Draw'
  return `Next player: ${nextPlayer}`
}

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard())

  const status = getGameStatus(board)

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
      <p>{statusText(status)}</p>
      <div>
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            aria-label={cell ? `Cell, ${cell}` : 'Empty cell'}
            onClick={() => handleCellClick(index)}
            disabled={status.isOver || cell !== null}
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
