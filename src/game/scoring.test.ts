import { describe, expect, it } from 'vitest'
import { classifyGuess, errorBoxesEmoji, firstStageFor, optionsFor } from './scoring'

describe('classifyGuess', () => {
  const answer = 1799 // the Rosetta Stone

  it('treats zero and negative years as BCE', () => {
    expect(classifyGuess(0, answer)).toBe('bce')
    expect(classifyGuess(-300, answer)).toBe('bce')
  })

  it('detects the wrong millennium', () => {
    expect(classifyGuess(500, answer)).toBe('millennium')
    expect(classifyGuess(2001, answer)).toBe('millennium')
  })

  it('detects the right millennium but wrong century', () => {
    expect(classifyGuess(1066, answer)).toBe('century')
    expect(classifyGuess(1850, answer)).toBe('century')
  })

  it('detects the right century but wrong decade', () => {
    expect(classifyGuess(1700, answer)).toBe('decade')
    expect(classifyGuess(1789, answer)).toBe('decade')
  })

  it('detects the right decade but wrong year', () => {
    expect(classifyGuess(1790, answer)).toBe('year')
    expect(classifyGuess(1798, answer)).toBe('year')
  })

  it('recognises an exact hit', () => {
    expect(classifyGuess(1799, answer)).toBe('exact')
  })
})

describe('firstStageFor', () => {
  it('sends BCE and wrong millennium to the millennium stage', () => {
    expect(firstStageFor('bce')).toBe('millennium')
    expect(firstStageFor('millennium')).toBe('millennium')
  })
  it('skips stages the first guess already solved', () => {
    expect(firstStageFor('century')).toBe('century')
    expect(firstStageFor('decade')).toBe('decade')
    expect(firstStageFor('year')).toBe('year')
    expect(firstStageFor('exact')).toBeNull()
  })
})

describe('optionsFor', () => {
  it('offers three millennia up to today', () => {
    expect(optionsFor('millennium', null, 2026)).toEqual([0, 1, 2])
  })
  it('offers ten centuries inside a millennium', () => {
    expect(optionsFor('century', 1, 2026)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
  })
  it('never offers the future', () => {
    expect(optionsFor('century', 2, 2026)).toEqual([20])
    expect(optionsFor('decade', 20, 2026)).toEqual([200, 201, 202])
    expect(optionsFor('year', 202, 2026)).toEqual([2020, 2021, 2022, 2023, 2024, 2025, 2026])
  })
  it('skips year zero in the first decade', () => {
    expect(optionsFor('year', 0, 2026)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})

describe('errorBoxesEmoji', () => {
  it('fills from the left and pads with empty boxes', () => {
    expect(errorBoxesEmoji(['bce', 'millennium'])).toBe('⬛🟥⬜⬜⬜')
    expect(errorBoxesEmoji([])).toBe('⬜⬜⬜⬜⬜')
  })
})
