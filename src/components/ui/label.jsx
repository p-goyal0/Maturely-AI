import * as React from 'react'
import { cn } from '@/lib/utils'

function Label({ className, children, ...props }) {
  return (
    <label data-slot="label" className={cn('text-sm font-medium', className)} {...props}>
      {children}
    </label>
  )
}

export default Label
export { Label }
