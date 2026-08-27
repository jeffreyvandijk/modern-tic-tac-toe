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
  return Array(9).fill(null)
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

export function isGameOver(board) {
  return calculateWinner(board).winner !== null || isBoardFull(board)
}

export function makeMove(board, index) {
  if (index < 0 || index > 8) {
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
