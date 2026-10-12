import { useState } from 'react'
import { RESULT } from '../game/copy'
import { errorBoxesEmoji, type Tier } from '../game/scoring'
import { Button } from './Button'
import { ErrorBar } from './ErrorBar'

type Props = {
  won: boolean
  answer: number
  title: string
  errors: Tier[]
  onNext: () => void
}

// The end of a round: outcome, the answer, share, and on to the next event.
export function ResultScreen({ won, answer, title, errors, onNext }: Props) {
  const [copied, setCopied] = useState(false)
  const mistakes = errors.length

  const shareText = `Find That Year\n${title}\n${errorBoxesEmoji(errors)}${won ? '' : '\nRan out of tries'}`

  async function share() {
    try {
      // On phones this opens the native share sheet. Elsewhere we copy.
      if (navigator.share) {
        await navigator.share({ text: shareText })
        return
      }
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // The player cancelled the share sheet, nothing to do.
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-5 py-10 text-center">
      <div className="flex flex-col items-center gap-5">
        <h2 className="text-3xl font-black leading-9 text-ink">
          {won ? RESULT.won.headline : RESULT.lost.headline}
        </h2>
        <p className="text-xl font-black leading-6 text-ink">
          {won
            ? mistakes === 0
              ? RESULT.won.perfect
              : RESULT.won.body(mistakes)
            : RESULT.lost.body}
        </p>
        <p className="text-6xl font-black text-ink">{answer}</p>
        <p className="text-base font-semibold text-ink-soft">{title}</p>
        <ErrorBar errors={errors} />
      </div>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={onNext} autoFocus>
          {RESULT.next}
        </Button>
        <button
          type="button"
          onClick={share}
          className="text-base font-semibold text-ink-soft underline-offset-4 hover:underline"
        >
          {copied ? RESULT.copied : RESULT.share}
        </button>
      </div>
    </div>
  )
}
