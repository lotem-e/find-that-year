import { useEffect, useReducer } from 'react'
import { ChoiceCardsScreen } from './components/ChoiceCardsScreen'
import { DigitPickerScreen } from './components/DigitPickerScreen'
import { FeedbackScreen } from './components/FeedbackScreen'
import { FirstGuessScreen } from './components/FirstGuessScreen'
import { ResultScreen } from './components/ResultScreen'
import { TopBar } from './components/TopBar'
import { dateKey, eventForDate } from './game/events'
import { createGame, currentOptions, reduce } from './game/state'
import { loadGame, saveGame } from './game/storage'

// Everything about "today" is decided once when the app loads.
const today = new Date()
const todayKey = dateKey(today)
const { number: puzzleNumber, event } = eventForDate(today)

export default function App() {
  // useReducer is React's built-in way to run the reducer pattern from state.ts.
  // The third argument is a lazy initializer: restore a saved game if there is
  // one for today, otherwise start fresh.
  const [state, dispatch] = useReducer(reduce, null, () => {
    const saved = loadGame(todayKey)
    // Only trust a saved game if it is about today's event. If the event list
    // changed since the save ( a redeploy ), start a fresh game instead.
    if (saved && saved.answer === event.year) return saved
    return createGame(event.year, today.getFullYear())
  })

  // Save after every change so a refresh continues where the player left off.
  useEffect(() => {
    saveGame(todayKey, state)
  }, [state])

  const showTopBar = state.phase !== 'first-guess'

  return (
    // A phone-width column, centered on larger screens, so the layout matches
    // the 390px frames in Figma without needing a separate desktop design.
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col bg-base-0 shadow-xl sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:rounded-[28px] sm:overflow-hidden">
      {showTopBar && <TopBar title={event.title} errors={state.errors} />}

      {state.phase === 'first-guess' && (
        <FirstGuessScreen title={event.title} onGuess={(year) => dispatch({ type: 'guess', year })} />
      )}

      {state.phase === 'feedback' && state.tier && state.tier !== 'exact' && (
        <FeedbackScreen tier={state.tier} onAcknowledge={() => dispatch({ type: 'acknowledge' })} />
      )}

      {state.phase === 'narrowing' && (state.stage === 'millennium' || state.stage === 'century') && (
        <ChoiceCardsScreen
          key={state.stage}
          stage={state.stage}
          options={currentOptions(state)}
          rejected={state.rejected[state.stage]}
          maxYear={state.maxYear}
          onPick={(stage, bucket) => dispatch({ type: 'pick', stage, bucket })}
        />
      )}

      {state.phase === 'narrowing' && (state.stage === 'decade' || state.stage === 'year') && (
        <DigitPickerScreen
          key={state.stage}
          stage={state.stage}
          options={currentOptions(state)}
          rejected={state.rejected[state.stage]}
          onPick={(stage, bucket) => dispatch({ type: 'pick', stage, bucket })}
        />
      )}

      {state.phase === 'done' && (
        <ResultScreen
          won={state.won}
          answer={state.answer}
          title={event.title}
          errors={state.errors}
          puzzleNumber={puzzleNumber}
        />
      )}
    </main>
  )
}
