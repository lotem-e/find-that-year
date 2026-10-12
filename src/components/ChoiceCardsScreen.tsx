import { COPY } from '../game/copy'
import { labelFor } from '../game/labels'
import type { Stage } from '../game/scoring'

type Props = {
  stage: 'millennium' | 'century'
  options: number[]
  rejected: number[]
  maxYear: number
  onPick: (stage: Stage, bucket: number) => void
}

// Card colors per stage. Millennia are pink, centuries are orange.
const PALETTE = {
  millennium: { card: 'bg-millennium-1', icon: 'bg-millennium-2', text: 'text-millennium-3' },
  century: { card: 'bg-century-1', icon: 'bg-century-2', text: 'text-century-3' },
}

// Icons live in public/icons. Six century icons and two millennium icons were
// exported from Figma; the rest were drawn by hand in the same flat style.
// File names use the human number (century-18 = the 18th century), while
// buckets are zero-based (bucket 17 = years 1700 - 1799), hence the + 1.
function iconFor(stage: 'millennium' | 'century', bucket: number): string {
  return `/icons/${stage}-${bucket + 1}.svg`
}

// A vertical list of big tappable cards. Wrong picks stay in the list but turn
// grey, get a strike-through, and stop responding, so the player sees history.
export function ChoiceCardsScreen({ stage, options, rejected, maxYear, onPick }: Props) {
  const palette = PALETTE[stage]
  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-5 py-8">
      <p className="text-center text-base font-semibold text-ink">{COPY.stagePrompt[stage]}</p>
      <ul className="flex w-full flex-col gap-2.5">
        {options.map((bucket) => {
          const label = labelFor(stage, bucket, maxYear)
          const isRejected = rejected.includes(bucket)
          const icon = iconFor(stage, bucket)
          return (
            <li key={bucket}>
              <button
                type="button"
                disabled={isRejected}
                onClick={() => onPick(stage, bucket)}
                className={`relative flex w-full items-center gap-5 rounded-[10px] p-5 text-left transition active:scale-[0.98] ${
                  isRejected ? 'bg-disabled-1 text-disabled-3' : `${palette.card} ${palette.text}`
                }`}
              >
                <span
                  className={`flex size-[78px] shrink-0 items-center justify-center rounded-[9px] ${
                    isRejected ? 'bg-disabled-2' : palette.icon
                  }`}
                >
                  <img
                    src={icon}
                    alt=""
                    className={`max-h-[56px] max-w-[56px] ${isRejected ? 'opacity-40 grayscale' : ''}`}
                  />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-3xl font-black leading-9">{label.range}</span>
                  <span className="text-xl font-normal leading-6">{label.name}</span>
                </span>
                {/* The diagonal strike-through from the design, drawn as a thin line. */}
                {isRejected && (
                  <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden>
                    <line x1="4%" y1="85%" x2="96%" y2="15%" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
