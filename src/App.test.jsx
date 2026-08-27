import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders 9 empty cells and shows X to move first', () => {
    render(<App />)
    expect(screen.getAllByRole('button', { name: 'Empty cell' })).toHaveLength(9)
    expect(screen.getByText(/next player: x/i)).toBeInTheDocument()
  })

  it('places a mark on click and switches turns', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell/i })
    fireEvent.click(cells[0])
    expect(cells[0]).toHaveTextContent('X')
    expect(screen.getByText(/next player: o/i)).toBeInTheDocument()
  })

  it('does not change a cell that is already filled', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell/i })
    fireEvent.click(cells[0])
    fireEvent.click(cells[0])
    expect(cells[0]).toHaveTextContent('X')
    expect(screen.getByText(/next player: o/i)).toBeInTheDocument()
  })

  it('announces the winner and stops accepting moves once someone wins', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell/i })
    // X: 0,1,2 top row / O: 3,4
    fireEvent.click(cells[0]) // X
    fireEvent.click(cells[3]) // O
    fireEvent.click(cells[1]) // X
    fireEvent.click(cells[4]) // O
    fireEvent.click(cells[2]) // X wins

    expect(screen.getByText(/winner: x/i)).toBeInTheDocument()

    fireEvent.click(cells[5])
    expect(cells[5]).toHaveTextContent('')
  })

  it('announces a draw when the board fills with no winner', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell/i })
    // X O X / X O O / O X X -> draw
    const order = [0, 1, 2, 4, 3, 5, 7, 6, 8]
    order.forEach((i) => fireEvent.click(cells[i]))

    expect(screen.getByText(/draw/i)).toBeInTheDocument()
  })

  it('resets the board when the reset button is clicked', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell/i })
    fireEvent.click(cells[0])
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))

    const freshCells = screen.getAllByRole('button', { name: 'Empty cell' })
    expect(freshCells).toHaveLength(9)
    expect(screen.getByText(/next player: x/i)).toBeInTheDocument()
  })
})
