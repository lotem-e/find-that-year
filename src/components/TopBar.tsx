import { COPY } from '../game/copy'
import type { Tier } from '../game/scoring'
import { ErrorBar } from './ErrorBar'

// The sticky blue header shown on every screen after the first guess:
// the question, the event title and the error boxes.
export function TopBar({ title, errors }: { title: string; errors: Tier[] }) {
  return (
    <header className="flex flex-col gap-4 bg-base-2 px-5 py-3">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold leading-[1.2] text-ink">{COPY.prompt}</p>
        <h1 className="text-base font-black leading-[1.2] text-ink">{title}</h1>
      </div>
      <ErrorBar errors={errors} />
    </header>
  )
}
