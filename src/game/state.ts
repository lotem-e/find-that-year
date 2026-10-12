// The whole game lives in one state object, changed only through `reduce`.
// This is the "reducer" pattern: the UI sends small action messages
// ("the player guessed 1500", "the player picked century 17") and this file
// decides what the next state looks like. React re-renders from that state.

import {
  MAX_ERRORS,
  bucketOf,
  classifyGuess,
  firstStageFor,
  nextStage,
  optionsFor,
  type Stage,
  type Tier,
} from './scoring'

export type Phase =
  | 'first-guess' // the opening screen with the number field
  | 'feedback' // the "Oops!" / "Nice!" screen after the first guess
  | 'narrowing' // picking millennium / century / decade / year
  | 'done' // won or lost

export type GameState = {
  answer: number
  maxYear: number // today's year, so we never offer future options
  phase: Phase
  firstGuess: number | null
  tier: Tier | null
  stage: Stage | null
  // One entry per error box, in the order they were earned. The entry is the
  // tier color, so the UI can paint the box without any extra lookups.
  errors: Tier[]
  // Buckets the player has proven correct so far, e.g. { millennium: 1, century: 17 }.
  known: Partial<Record<Stage, number>>
  // Wrong picks per stage, so the UI can disable them.
  rejected: Record<Stage, number[]>
  won: boolean
}

export type GameAction =
  | { type: 'guess'; year: number }
  | { type: 'acknowledge' } // the OK button on the feedback screen
  | { type: 'pick'; stage: Stage; bucket: number }

export function createGame(answer: number, maxYear: number): GameState {
  return {
    answer,
    maxYear,
    phase: 'first-guess',
    firstGuess: null,
    tier: null,
    stage: null,
    errors: [],
    known: {},
    rejected: { millennium: [], century: [], decade: [], year: [] },
    won: false,
  }
}

export function reduce(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'guess':
      return applyGuess(state, action.year)
    case 'acknowledge':
      if (state.phase !== 'feedback' || state.tier === null) return state
      return enterStage({ ...state, phase: 'narrowing' }, firstStageFor(state.tier))
    case 'pick':
      return applyPick(state, action.stage, action.bucket)
  }
}

function applyGuess(state: GameState, year: number): GameState {
  if (state.phase !== 'first-guess') return state
  const tier = classifyGuess(year, state.answer)

  // Everything the first guess got right is now "known", so the later stages
  // can be skipped. We fill `known` up to (but not including) the failed stage.
  const known: GameState['known'] = {}
  const firstStage = firstStageFor(tier)
  for (const stage of ['millennium', 'century', 'decade'] as const) {
    if (stage === firstStage) break
    known[stage] = bucketOf[stage](state.answer)
  }

  if (tier === 'exact') {
    return { ...state, firstGuess: year, tier, known, phase: 'done', won: true }
  }
  return { ...state, firstGuess: year, tier, known, errors: [tier], phase: 'feedback' }
}

function applyPick(state: GameState, stage: Stage, bucket: number): GameState {
  if (state.phase !== 'narrowing' || state.stage !== stage) return state

  const correct = bucketOf[stage](state.answer) === bucket
  if (correct) {
    const known = { ...state.known, [stage]: bucket }
    if (stage === 'year') return { ...state, known, phase: 'done', won: true }
    return enterStage({ ...state, known }, nextStage(stage))
  }

  // A wrong pick costs one error box in the color of the current stage.
  const errors = [...state.errors, stage]
  const rejected = { ...state.rejected, [stage]: [...state.rejected[stage], bucket] }
  if (errors.length >= MAX_ERRORS) {
    return { ...state, errors, rejected, phase: 'done', won: false }
  }
  return { ...state, errors, rejected }
}

// Move to a stage. If that stage has only one possible option (for example the
// third millennium only contains the 21st century so far) we resolve it
// automatically and move on, so the player never faces a one-card choice.
function enterStage(state: GameState, stage: Stage | null): GameState {
  if (stage === null) return { ...state, stage: null, phase: 'done', won: true }
  const options = currentOptions({ ...state, stage })
  if (options.length === 1) {
    const known = { ...state.known, [stage]: options[0] }
    return enterStage({ ...state, known }, nextStage(stage))
  }
  return { ...state, stage }
}

// The buckets to show for the current stage, with the player's wrong picks removed.
export function currentOptions(state: GameState): number[] {
  if (state.stage === null) return []
  const parentStage = parentOf(state.stage)
  const parent = parentStage ? (state.known[parentStage] ?? null) : null
  return optionsFor(state.stage, parent, state.maxYear)
}

function parentOf(stage: Stage): Stage | null {
  const order: Stage[] = ['millennium', 'century', 'decade', 'year']
  const index = order.indexOf(stage)
  return index > 0 ? order[index - 1] : null
}
