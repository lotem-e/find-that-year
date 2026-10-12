import { useEffect, useReducer } from 'react'
import { ChoiceCardsScreen } from './components/ChoiceCardsScreen'
import { DigitPickerScreen } from './components/DigitPickerScreen'
import { FeedbackScreen } from './components/FeedbackScreen'
import { FirstGuessScreen } from './components/FirstGuessScreen'
import { ResultScreen } from './components/ResultScreen'
import { TopBar } from './components/TopBar'
import { randomEvent, type HistoricEvent } from './game/events'
import { createGame, currentOptions, reduce, type GameAction } from './game/state'
import { loadSession, saveSession, type Session } from './game/storage'

const thisYear = new Date().getFullYear()

// A session is one round: the event being played plus the game state.
// "next" swaps in a fresh event; everything else is forwarded to the game
// reducer in state.ts, which knows nothing about events or rounds.
type SessionAction = GameAction | { type: 'next' }

function startRound(previous?: HistoricEvent): Session {
  const event = randomEvent(previous)
  return { event, game: createGame(event.year, thisYear) }
}

function reduceSession(session: Session, action: SessionAction): Session {
  if (action.type === 'next') return startRound(session.event)
  return { ...session, game: reduce(session.game, action) }
}

export default function App() {
  // useReducer is React's built-in way to run the reducer pattern. The third
  // argument is a lazy initializer: restore a saved round if there is one,
  // otherwise start a new one.
  const [session, dispatch] = useReducer(reduceSession, null, () => loadSession() ?? startRound())
  const { event, game: state } = session

  // Save after every change so a refresh continues where the player left off.
  useEffect(() => {
    saveSession(session)
  }, [session])

  const showTopBar = state.phase !== 'first-guess'

  return (
    // A phone-width column, centered on larger screens, so the layout matches
    // the 390px frames in Figma without needing a separate desktop design.
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col bg-base-0 shadow-xl sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:rounded-[28px] sm:overflow-hidden">
      {showTopBar && <TopBar title={event.title} errors={state.errors} />}

      {state.phase === 'first-guess' && (
        <FirstGuessScreen
          key={event.title}
          title={event.title}
          onGuess={(year) => dispatch({ type: 'guess', year })}
        />
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
          onNext={() => dispatch({ type: 'next' })}
        />
      )}
    </main>
  )
}
