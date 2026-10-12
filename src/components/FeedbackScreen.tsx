import { FEEDBACK } from '../game/copy'
import type { Tier } from '../game/scoring'
import { Button } from './Button'

type Props = {
  tier: Exclude<Tier, 'exact'>
  onAcknowledge: () => void
}

// The reaction to the first guess: a headline, what happened, what is next.
export function FeedbackScreen({ tier, onAcknowledge }: Props) {
  const text = FEEDBACK[tier]
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-10">
      <div className="flex w-[290px] flex-col items-center justify-between gap-10 text-center">
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-black leading-9 text-ink">{text.headline}</h2>
          <p className="text-xl font-black leading-6 text-ink">{text.body}</p>
          <p className="mx-auto max-w-[225px] text-base font-semibold leading-[1.2] text-ink-soft">{text.hint}</p>
        </div>
        <Button onClick={onAcknowledge} autoFocus>
          {text.button}
        </Button>
      </div>
    </div>
  )
}
