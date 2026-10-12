// Save and restore the current round in the browser, so a page refresh does
// not reset it. localStorage can throw ( private mode, blocked storage ), so
// every call is wrapped in try / catch and failures are simply ignored.
import { findEvent, type HistoricEvent } from './events'
import type { GameState } from './state'

export type Session = { event: HistoricEvent; game: GameState }

const KEY = 'find-that-year:session'

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as Session
    // Only trust the save if its event still exists with the same year.
    // Otherwise the event list changed since the save and we start fresh.
    const event = findEvent(saved.event?.title)
    if (!event || event.year !== saved.game?.answer) return null
    return { event, game: saved.game }
  } catch {
    return null
  }
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    // Storage is a convenience, never a requirement.
  }
}
