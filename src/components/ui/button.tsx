import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-green-700 text-white shadow-sm hover:bg-green-800 active:bg-green-900',
        destructive:
          'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800',
        outline:
          'border border-green-300 bg-white text-green-800 shadow-sm hover:bg-green-50 hover:text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-100 dark:hover:bg-green-900',
        secondary:
          'bg-cream-100 text-brown-800 shadow-sm hover:bg-cream-200 dark:bg-brown-900 dark:text-cream-100 dark:hover:bg-brown-800',
        ghost:
          'text-green-700 hover:bg-green-50 hover:text-green-800 dark:text-green-300 dark:hover:bg-green-950',
        link: 'text-green-700 underline-offset-4 hover:underline dark:text-green-400',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
