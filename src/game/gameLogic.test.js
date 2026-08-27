import { describe, expect, it } from 'vitest'
import {
  calculateWinner,
  createEmptyBoard,
  getNextPlayer,
  isBoardFull,
  isGameOver,
  makeMove,
} from './gameLogic'

describe('createEmptyBoard', () => {
  it('returns 9 empty cells', () => {
    expect(createEmptyBoard()).toEqual([
      null, null, null,
      null, null, null,
      null, null, null,
    ])
  })
})

describe('getNextPlayer', () => {
  it('returns X on an empty board', () => {
    expect(getNextPlayer(createEmptyBoard())).toBe('X')
  })

  it('returns O after X has moved once', () => {
    const board = createEmptyBoard()
    board[0] = 'X'
    expect(getNextPlayer(board)).toBe('O')
  })

  it('returns X after X and O have each moved once', () => {
    const board = createEmptyBoard()
    board[0] = 'X'
    board[1] = 'O'
    expect(getNextPlayer(board)).toBe('X')
  })
})

describe('makeMove', () => {
  it('places the next player\'s mark at the given index', () => {
    const board = createEmptyBoard()
    const { board: next, error } = makeMove(board, 4)
    expect(error).toBeNull()
    expect(next[4]).toBe('X')
  })

  it('does not mutate the original board', () => {
    const board = createEmptyBoard()
    makeMove(board, 4)
    expect(board[4]).toBeNull()
  })

  it('alternates players across successive moves', () => {
    let board = createEmptyBoard()
    ;({ board } = makeMove(board, 0))
    ;({ board } = makeMove(board, 1))
    expect(board[0]).toBe('X')
    expect(board[1]).toBe('O')
  })

  it('rejects a move on an already-occupied cell', () => {
    let board = createEmptyBoard()
    ;({ board } = makeMove(board, 0))
    const { board: next, error } = makeMove(board, 0)
    expect(error).toBe('cell-occupied')
    expect(next[0]).toBe('X')
  })

  it('rejects a move at an out-of-range index', () => {
    const board = createEmptyBoard()
    const { board: next, error } = makeMove(board, 9)
    expect(error).toBe('invalid-index')
    expect(next).toEqual(board)
  })

  it('rejects a move once the game is already won', () => {
    // X: 0,1,2 top row win
    let board = createEmptyBoard()
    ;({ board } = makeMove(board, 0)) // X
    ;({ board } = makeMove(board, 3)) // O
    ;({ board } = makeMove(board, 1)) // X
    ;({ board } = makeMove(board, 4)) // O
    ;({ board } = makeMove(board, 2)) // X wins
    const { board: next, error } = makeMove(board, 5)
    expect(error).toBe('game-over')
    expect(next).toEqual(board)
  })
})

describe('calculateWinner', () => {
  it('returns no winner on an empty board', () => {
    expect(calculateWinner(createEmptyBoard())).toEqual({ winner: null, line: null })
  })

  it('detects a horizontal win', () => {
    const board = createEmptyBoard()
    board[0] = board[1] = board[2] = 'X'
    expect(calculateWinner(board)).toEqual({ winner: 'X', line: [0, 1, 2] })
  })

  it('detects a vertical win', () => {
    const board = createEmptyBoard()
    board[0] = board[3] = board[6] = 'O'
    expect(calculateWinner(board)).toEqual({ winner: 'O', line: [0, 3, 6] })
  })

  it('detects a diagonal win', () => {
    const board = createEmptyBoard()
    board[0] = board[4] = board[8] = 'X'
    expect(calculateWinner(board)).toEqual({ winner: 'X', line: [0, 4, 8] })
  })

  it('detects the anti-diagonal win', () => {
    const board = createEmptyBoard()
    board[2] = board[4] = board[6] = 'O'
    expect(calculateWinner(board)).toEqual({ winner: 'O', line: [2, 4, 6] })
  })

  it('returns no winner when the board is full with no line', () => {
    // X O X / X O O / O X X -> draw
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(calculateWinner(board)).toEqual({ winner: null, line: null })
  })
})

describe('isBoardFull', () => {
  it('is false on an empty board', () => {
    expect(isBoardFull(createEmptyBoard())).toBe(false)
  })

  it('is true when every cell is filled', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(isBoardFull(board)).toBe(true)
  })
})

describe('isGameOver', () => {
  it('is false on an empty board', () => {
    expect(isGameOver(createEmptyBoard())).toBe(false)
  })

  it('is true when there is a winner', () => {
    const board = createEmptyBoard()
    board[0] = board[1] = board[2] = 'X'
    expect(isGameOver(board)).toBe(true)
  })

  it('is true when the board is full with no winner (draw)', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']
    expect(isGameOver(board)).toBe(true)
  })

  it('is false when the board has empty cells and no winner', () => {
    const board = createEmptyBoard()
    board[0] = 'X'
    expect(isGameOver(board)).toBe(false)
  })
})
