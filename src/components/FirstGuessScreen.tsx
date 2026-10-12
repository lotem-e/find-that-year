import { useState, type FormEvent } from 'react'
import { COPY } from '../game/copy'
import { Button } from './Button'

type Props = {
  title: string
  onGuess: (year: number) => void
}

// The opening screen: question, event title, a number field and one button.
export function FirstGuessScreen({ title, onGuess }: Props) {
  const [value, setValue] = useState('')
  const parsed = Number.parseInt(value, 10)
  const isValid = value.trim() !== '' && Number.isFinite(parsed)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (isValid) onGuess(parsed)
  }

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col items-center justify-between px-5 pb-24 pt-10">
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="text-base font-semibold text-ink-soft">{COPY.prompt}</p>
        <h1 className="text-3xl font-black leading-9 text-ink">{title}</h1>
      </div>

      {/* The big soft-blue field from the design. Negative numbers mean BCE. */}
      <label className="flex h-[142px] w-[240px] items-center justify-center rounded-[10px] bg-base-1">
        <span className="sr-only">{COPY.yearPlaceholder}</span>
        <input
          type="number"
          inputMode="numeric"
          autoFocus
          placeholder={COPY.yearPlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent text-center text-5xl font-black text-ink outline-none placeholder:text-ink/30"
        />
      </label>

      <Button type="submit" disabled={!isValid}>
        {COPY.firstGuessButton}
      </Button>
    </form>
  )
}
