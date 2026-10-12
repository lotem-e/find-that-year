// The pool of daily events. Every entry is an AD year, because the game treats
// any BCE guess as "too early". Keep titles short: they are the headline.
export type HistoricEvent = {
  title: string
  year: number
}

export const EVENTS: HistoricEvent[] = [
  { title: 'The Rosetta Stone is discovered', year: 1799 },
  { title: 'Neil Armstrong walks on the Moon', year: 1969 },
  { title: 'The Berlin Wall falls', year: 1989 },
  { title: 'Columbus reaches the Americas', year: 1492 },
  { title: 'The Titanic sinks', year: 1912 },
  { title: 'The Great Fire of London', year: 1666 },
  { title: 'The Magna Carta is sealed', year: 1215 },
  { title: 'The Eiffel Tower opens', year: 1889 },
  { title: 'The first iPhone goes on sale', year: 2007 },
  { title: 'World War I begins', year: 1914 },
  { title: "The Wright brothers' first flight", year: 1903 },
  { title: 'The Black Death reaches Europe', year: 1347 },
  { title: 'William Shakespeare dies', year: 1616 },
  { title: 'The US Declaration of Independence is signed', year: 1776 },
  { title: 'The French Revolution begins', year: 1789 },
  { title: 'Penicillin is discovered', year: 1928 },
  { title: 'Wikipedia launches', year: 2001 },
  { title: 'The Chernobyl disaster', year: 1986 },
  { title: 'The Suez Canal opens', year: 1869 },
  { title: 'Mount Vesuvius buries Pompeii', year: 79 },
  { title: 'Constantinople is founded', year: 330 },
  { title: 'The Western Roman Empire falls', year: 476 },
  { title: 'Charlemagne is crowned emperor', year: 800 },
  { title: 'The Battle of Hastings', year: 1066 },
  { title: 'Michelangelo finishes the Sistine Chapel ceiling', year: 1512 },
  { title: 'Napoleon is defeated at Waterloo', year: 1815 },
  { title: 'The first modern Olympic Games', year: 1896 },
  { title: 'Einstein publishes special relativity', year: 1905 },
  { title: 'The Wall Street Crash', year: 1929 },
  { title: 'YouTube is founded', year: 2005 },
  { title: 'The first email is sent', year: 1971 },
  { title: 'The Hubble Space Telescope launches', year: 1990 },
  { title: 'Vasco da Gama reaches India', year: 1498 },
  { title: 'The Hagia Sophia is completed', year: 537 },
  { title: 'Marco Polo returns to Venice', year: 1295 },
  { title: 'The Boston Tea Party', year: 1773 },
  { title: 'Sputnik 1 is launched', year: 1957 },
  { title: 'Google is founded', year: 1998 },
  { title: 'The Berlin Wall is built', year: 1961 },
  { title: 'Gutenberg prints his Bible', year: 1455 },
]

// Day zero of the game. The puzzle number counts up from here.
const EPOCH = Date.UTC(2026, 9, 12) // 12 October 2026 (months are zero-based)
const DAY_MS = 24 * 60 * 60 * 1000

// Turn a calendar date into a puzzle number. We use the local date so that
// "today" matches the player's clock, then count whole days since the epoch.
export function puzzleNumber(date: Date): number {
  const localMidnightAsUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((localMidnightAsUtc - EPOCH) / DAY_MS)
}

// Everyone gets the same event on the same day: the puzzle number walks
// through the list and wraps around when it reaches the end.
export function eventForDate(date: Date): { number: number; event: HistoricEvent } {
  const number = puzzleNumber(date)
  const index = ((number % EVENTS.length) + EVENTS.length) % EVENTS.length
  return { number, event: EVENTS[index] }
}

// A stable key for saving today's progress, e.g. "2026-10-12".
export function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
