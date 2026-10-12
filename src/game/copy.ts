// Every piece of UI text in one place, so wording can be tuned without
// touching components. Feedback messages are keyed by the first-guess tier.
import type { Stage, Tier } from './scoring'

export const COPY = {
  prompt: 'In what year did the following happen?',
  firstGuessButton: 'Take your first guess!',
  yearPlaceholder: 'Year',
  tryButton: 'Try',
  stagePrompt: {
    millennium: 'Can you pick the right millennium?',
    century: 'Which century holds the key to this event?',
    decade: 'Guess the decade that defines this moment',
    year: 'Guess the precise year when history was written!',
  } satisfies Record<Stage, string>,
}

export type Feedback = {
  headline: string
  body: string
  hint: string
  button: string
}

export const FEEDBACK: Record<Exclude<Tier, 'exact'>, Feedback> = {
  bce: {
    headline: 'Oops!',
    body: "The event you're looking for occurred after counting!",
    hint: "So let's focus on the AD years for your next guess...",
    button: 'OK 🙊',
  },
  millennium: {
    headline: 'Oops!',
    body: "You're a whole millennium away from the event!",
    hint: "Let's start by finding the right millennium...",
    button: 'OK 🙈',
  },
  century: {
    headline: 'OK!',
    body: "You've landed in the right ballpark - it's the right millennium! But missed the right century...",
    hint: "Now, let's narrow it down further to hit the historical sweet spot...",
    button: 'OK 💪',
  },
  decade: {
    headline: 'Nice!',
    body: "You're on the right track! Your guess lands in the correct century",
    hint: "but there's still work to do to find the exact year.",
    button: 'OK ☺️',
  },
  year: {
    headline: 'Impressive!',
    body: "You're not just close, your guess is in the correct decade.",
    hint: "Now, let's zoom in to find the exact year.",
    button: 'OK ☺️',
  },
}

export const RESULT = {
  won: {
    headline: 'You found it!',
    perfect: 'A perfect first guess. Historian level.',
    body: (mistakes: number) =>
      mistakes === 1 ? 'Solved with a single mistake.' : `Solved with ${mistakes} mistakes.`,
  },
  lost: {
    headline: 'So close...',
    body: 'You ran out of tries. The answer was',
  },
  share: 'Share result',
  copied: 'Copied!',
  comeBack: 'A new event arrives tomorrow.',
}
