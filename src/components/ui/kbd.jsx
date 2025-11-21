import * as React from 'react'

import { cn } from '@/lib/utils'

function Kbd({ className, children, ...props }) {
  return (
    <kbd data-slot="kbd" className={cn('rounded border px-1 text-xs', className)} {...props}>
      {children}
    </kbd>
  )
}

export { Kbd }
