const BOARD_SIZE = 9

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function createEmptyBoard() {
  return Array(BOARD_SIZE).fill(null)
}

export function getNextPlayer(board) {
  const moveCount = board.filter(Boolean).length
  return moveCount % 2 === 0 ? 'X' : 'O'
}

export function calculateWinner(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line }
    }
  }
  return { winner: null, line: null }
}

export function isBoardFull(board) {
  return board.every((cell) => cell !== null)
}

// Single source of truth for a board's derived state, computed in one pass
// so callers never have to re-derive (and risk disagreeing on) game-over.
export function getGameStatus(board) {
  const { winner, line } = calculateWinner(board)
  const isFull = isBoardFull(board)
  return {
    winner,
    line,
    isFull,
    isOver: winner !== null || isFull,
    nextPlayer: getNextPlayer(board),
  }
}

export function isGameOver(board) {
  return getGameStatus(board).isOver
}

export function makeMove(board, index) {
  if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE) {
    return { board, error: 'invalid-index' }
  }
  if (isGameOver(board)) {
    return { board, error: 'game-over' }
  }
  if (board[index] !== null) {
    return { board, error: 'cell-occupied' }
  }

  const next = [...board]
  next[index] = getNextPlayer(board)
  return { board: next, error: null }
}
