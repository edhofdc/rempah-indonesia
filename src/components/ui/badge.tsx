import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-green-700 text-white hover:bg-green-800',
        secondary:
          'border-transparent bg-cream-100 text-brown-800 hover:bg-cream-200 dark:bg-brown-800 dark:text-cream-100',
        destructive:
          'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'border-green-300 text-green-700 dark:border-green-600 dark:text-green-300',
        gold: 'border-transparent bg-gold-500 text-white hover:bg-gold-600',
        success:
          'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
