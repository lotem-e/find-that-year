// Save and restore today's game in the browser, so a page refresh does not
// reset the puzzle. localStorage can throw (private mode, blocked storage),
// so every call is wrapped in try / catch and failures are simply ignored.
import type { GameState } from './state'

const KEY_PREFIX = 'find-that-year:'

export function loadGame(dateKey: string): GameState | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + dateKey)
    return raw ? (JSON.parse(raw) as GameState) : null
  } catch {
    return null
  }
}

export function saveGame(dateKey: string, state: GameState): void {
  try {
    localStorage.setItem(KEY_PREFIX + dateKey, JSON.stringify(state))
  } catch {
    // Storage is a convenience, never a requirement.
  }
}
