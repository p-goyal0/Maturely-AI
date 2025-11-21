import * as React from 'react'

import { cn } from '@/lib/utils'

function Item({ className, ...props }) {
  return <div data-slot="item" className={cn('flex items-center gap-2', className)} {...props} />
}

export { Item }
