import { describe, expect, it } from 'vitest'
import { createGame, currentOptions, reduce, type GameState } from './state'

const start = () => createGame(1799, 2026)

describe('game flow', () => {
  it('wins immediately on an exact first guess', () => {
    const s = reduce(start(), { type: 'guess', year: 1799 })
    expect(s.phase).toBe('done')
    expect(s.won).toBe(true)
    expect(s.errors).toEqual([])
  })

  it('shows feedback and remembers what the guess already solved', () => {
    const s = reduce(start(), { type: 'guess', year: 1750 }) // right century, wrong decade
    expect(s.phase).toBe('feedback')
    expect(s.tier).toBe('decade')
    expect(s.errors).toEqual(['decade'])
    expect(s.known).toEqual({ millennium: 1, century: 17 })
  })

  it('starts narrowing at the first unsolved stage', () => {
    let s = reduce(start(), { type: 'guess', year: 1750 })
    s = reduce(s, { type: 'acknowledge' })
    expect(s.phase).toBe('narrowing')
    expect(s.stage).toBe('decade')
    expect(currentOptions(s)).toEqual([170, 171, 172, 173, 174, 175, 176, 177, 178, 179])
  })

  it('adds an error box on a wrong pick and advances on a right one', () => {
    let s = reduce(start(), { type: 'guess', year: 500 })
    s = reduce(s, { type: 'acknowledge' })
    s = reduce(s, { type: 'pick', stage: 'millennium', bucket: 2 })
    expect(s.errors).toEqual(['millennium', 'millennium'])
    expect(s.rejected.millennium).toEqual([2])
    s = reduce(s, { type: 'pick', stage: 'millennium', bucket: 1 })
    expect(s.stage).toBe('century')
    expect(s.known.millennium).toBe(1)
  })

  it('loses after five error boxes', () => {
    let s: GameState = reduce(start(), { type: 'guess', year: -50 }) // bce = 1 box
    s = reduce(s, { type: 'acknowledge' })
    s = reduce(s, { type: 'pick', stage: 'millennium', bucket: 0 }) // 2
    s = reduce(s, { type: 'pick', stage: 'millennium', bucket: 1 }) // correct
    s = reduce(s, { type: 'pick', stage: 'century', bucket: 10 }) // 3
    s = reduce(s, { type: 'pick', stage: 'century', bucket: 11 }) // 4
    s = reduce(s, { type: 'pick', stage: 'century', bucket: 12 }) // 5
    expect(s.phase).toBe('done')
    expect(s.won).toBe(false)
  })

  it('auto-skips a stage with a single option', () => {
    // 2024: picking the third millennium leaves only the 21st century.
    let s = reduce(createGame(2024, 2026), { type: 'guess', year: 1500 })
    s = reduce(s, { type: 'acknowledge' })
    s = reduce(s, { type: 'pick', stage: 'millennium', bucket: 2 })
    expect(s.stage).toBe('decade')
    expect(s.known.century).toBe(20)
  })
})
