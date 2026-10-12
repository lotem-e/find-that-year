import { MAX_ERRORS, type Tier } from '../game/scoring'

// Five small squares. Filled ones are painted with the tier color of the
// mistake, empty ones are just an outline. The same information is turned
// into emoji for the share text, see errorBoxesEmoji in scoring.ts.
const TIER_CLASS: Record<Tier, string> = {
  bce: 'bg-tier-bce',
  millennium: 'bg-tier-millennium',
  century: 'bg-tier-century',
  decade: 'bg-tier-decade',
  year: 'bg-tier-year',
  exact: '',
}

export function ErrorBar({ errors }: { errors: Tier[] }) {
  return (
    <div className="flex items-center gap-2" aria-label={`${errors.length} of ${MAX_ERRORS} mistakes`}>
      {Array.from({ length: MAX_ERRORS }, (_, i) => {
        const tier = errors[i]
        return (
          <span
            key={i}
            className={`block size-5 rounded-[2px] border border-ink ${tier ? TIER_CLASS[tier] : ''}`}
          />
        )
      })}
    </div>
  )
}
