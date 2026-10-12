import { useEffect, useState } from 'react'
import { COPY } from '../game/copy'
import type { Stage } from '../game/scoring'
import { Button } from './Button'

type Props = {
  stage: 'decade' | 'year'
  options: number[] // full buckets, e.g. 1790..1799 for years or 170..179 for decades
  rejected: number[]
  onPick: (stage: Stage, bucket: number) => void
}

// The "1 7 9 [2]" wheel from the design. The fixed digits come from what the
// player already proved; only the last digit is up for grabs. We render the
// previous and next candidate faded above and below the selected one, and
// the player moves with the arrows, the keyboard, or the mouse wheel.
export function DigitPickerScreen({ stage, options, rejected, onPick }: Props) {
  const available = options.filter((bucket) => !rejected.includes(bucket))
  const [index, setIndex] = useState(0)

  // After a wrong pick the list shrinks, so make sure the index still points
  // at something that exists.
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, available.length - 1)))
  }, [available.length])

  const selected = available[index]
  const prefix = String(available[0]).slice(0, -1) // "179" of "1792"
  const digitOf = (bucket: number) => String(bucket).slice(-1)
  const lastDigitSuffix = stage === 'decade' ? 'X' : ''

  const move = (delta: number) => setIndex((i) => Math.min(available.length - 1, Math.max(0, i + delta)))

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') move(-1)
      if (e.key === 'ArrowDown') move(1)
      if (e.key === 'Enter' && selected !== undefined) onPick(stage, selected)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (selected === undefined) return null

  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-8 px-5 py-8">
      <p className="max-w-[240px] text-center text-base font-semibold text-ink">{COPY.stagePrompt[stage]}</p>

      <div
        className="flex items-center gap-3 text-[90px] font-black leading-[108px] text-ink select-none"
        onWheel={(e) => move(e.deltaY > 0 ? 1 : -1)}
      >
        {prefix.split('').map((digit, i) => (
          <span key={i}>{digit}</span>
        ))}

        {/* The wheel column: previous digit, selected digit, next digit. */}
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => move(-1)}
            className="h-[108px] text-ink-faded [mask-image:linear-gradient(to_bottom,transparent,black)] disabled:invisible"
            disabled={index === 0}
          >
            {index > 0 ? digitOf(available[index - 1]) : ' '}
          </button>
          <span aria-live="polite">{digitOf(selected)}</span>
          <button
            type="button"
            aria-label="Next"
            onClick={() => move(1)}
            className="h-[108px] text-ink-faded [mask-image:linear-gradient(to_top,transparent,black)] disabled:invisible"
            disabled={index === available.length - 1}
          >
            {index < available.length - 1 ? digitOf(available[index + 1]) : ' '}
          </button>
        </div>

        {lastDigitSuffix && <span>{lastDigitSuffix}</span>}
      </div>

      <Button onClick={() => onPick(stage, selected)}>{COPY.tryButton}</Button>
    </div>
  )
}
