// Pure game rules. No React here, so this file is easy to test on its own.
//
// The game narrows a year down in four stages, from coarse to fine:
//   millennium -> century -> decade -> year
// Every stage works on a "bucket" number you get by integer division:
//   millennium of 1799 = floor(1799 / 1000) = 1   (years 1000 - 1999)
//   century    of 1799 = floor(1799 / 100)  = 17  (years 1700 - 1799)
//   decade     of 1799 = floor(1799 / 10)   = 179 (years 1790 - 1799)
// Using floor everywhere keeps all the ranges simple and consistent.

export type Stage = 'millennium' | 'century' | 'decade' | 'year'

// Where the first guess landed. Also the color of an error box.
export type Tier = 'bce' | 'millennium' | 'century' | 'decade' | 'year' | 'exact'

export const STAGES: Stage[] = ['millennium', 'century', 'decade', 'year']

// How many "steps from goal" each tier represents. Used for the result summary.
export const TIER_STEPS: Record<Tier, number> = {
  bce: 5,
  millennium: 4,
  century: 3,
  decade: 2,
  year: 1,
  exact: 0,
}

// The maximum number of error boxes. When they are all filled the game is lost.
export const MAX_ERRORS = 5

// Bucket helpers. All of them take a year and return the bucket number.
export const bucketOf: Record<Stage, (year: number) => number> = {
  millennium: (year) => Math.floor(year / 1000),
  century: (year) => Math.floor(year / 100),
  decade: (year) => Math.floor(year / 10),
  year: (year) => year,
}

// Classify a first guess against the real answer.
// We check from coarse to fine and stop at the first mismatch.
export function classifyGuess(guess: number, answer: number): Tier {
  if (guess <= 0) return 'bce' // the game only uses AD years, so 0 or negative means BCE
  if (bucketOf.millennium(guess) !== bucketOf.millennium(answer)) return 'millennium'
  if (bucketOf.century(guess) !== bucketOf.century(answer)) return 'century'
  if (bucketOf.decade(guess) !== bucketOf.decade(answer)) return 'decade'
  if (guess !== answer) return 'year'
  return 'exact'
}

// Which stage the player should start narrowing at, given the first guess tier.
// A guess in the right century, for example, has already "solved" millennium and
// century, so the player jumps straight to picking the decade.
export function firstStageFor(tier: Tier): Stage | null {
  switch (tier) {
    case 'bce':
    case 'millennium':
      return 'millennium'
    case 'century':
      return 'century'
    case 'decade':
      return 'decade'
    case 'year':
      return 'year'
    case 'exact':
      return null
  }
}

export function nextStage(stage: Stage): Stage | null {
  const index = STAGES.indexOf(stage)
  return STAGES[index + 1] ?? null
}

// The list of candidate buckets a player can pick from at a given stage.
// `parent` is the bucket chosen in the previous stage (e.g. the century when we
// are picking a decade). `maxYear` is today's year, so we never offer the future.
export function optionsFor(stage: Stage, parent: number | null, maxYear: number): number[] {
  if (stage === 'millennium') {
    const last = bucketOf.millennium(maxYear)
    return range(0, last)
  }
  if (parent === null) return []
  // Every finer stage has exactly 10 children: century 17 holds decades 170 - 179.
  const first = parent * 10
  const limit = bucketOf[stage](maxYear)
  return range(first, Math.min(first + 9, limit)).filter((bucket) => {
    // Year 0 does not exist, and the first century starts at year 1.
    if (stage === 'year') return bucket >= 1
    return true
  })
}

function range(from: number, to: number): number[] {
  const result: number[] = []
  for (let n = from; n <= to; n++) result.push(n)
  return result
}

// Build a Wordle-style share line from the error boxes, e.g. "⬛🟥⬜⬜⬜".
const TIER_EMOJI: Record<Tier, string> = {
  bce: '⬛',
  millennium: '🟥',
  century: '🟧',
  decade: '🟨',
  year: '🟩',
  exact: '',
}

export function errorBoxesEmoji(errors: Tier[]): string {
  const filled = errors.map((tier) => TIER_EMOJI[tier]).join('')
  const empty = '⬜'.repeat(Math.max(0, MAX_ERRORS - errors.length))
  return filled + empty
}
