import type { ButtonHTMLAttributes } from 'react'

// The one button style in the design: light blue pill with indigo text.
export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`rounded-[9px] bg-base-2 px-5 py-5 text-xl font-semibold leading-6 text-ink transition active:scale-95 disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}
