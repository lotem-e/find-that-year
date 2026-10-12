// Human-readable labels for buckets: "1700 - 1799" and "The 18th century".
import type { Stage } from './scoring'

const ORDINAL_SUFFIX = (n: number): string => {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return 'th'
  switch (n % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

const ordinal = (n: number) => `${n}${ORDINAL_SUFFIX(n)}`
const format = (n: number) => n.toLocaleString('en-US')

export type BucketLabel = { range: string; name: string }

export function labelFor(stage: Stage, bucket: number, maxYear: number): BucketLabel {
  switch (stage) {
    case 'millennium': {
      // Bucket 0 is years 1 - 999, bucket 1 is 1000 - 1999, and so on.
      const from = Math.max(1, bucket * 1000)
      const to = bucket * 1000 + 999
      const isCurrent = to >= maxYear
      return {
        range: `${format(from)} - ${isCurrent ? 'Today' : format(to)}`,
        name: `The ${ordinal(bucket + 1)} Millennium`,
      }
    }
    case 'century': {
      const from = Math.max(1, bucket * 100)
      const to = bucket * 100 + 99
      const isCurrent = to >= maxYear
      return {
        range: `${format(from)} - ${isCurrent ? 'Today' : format(to)}`,
        name: `The ${ordinal(bucket + 1)} century`,
      }
    }
    case 'decade':
      // Shown on the digit wheel as "179X".
      return { range: `${bucket}X`, name: `The ${bucket * 10}s` }
    case 'year':
      return { range: String(bucket), name: '' }
  }
}
