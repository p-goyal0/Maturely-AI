import * as React from 'react'

import { cn } from '@/lib/utils'

function InputGroup({ className, ...props }) {
  return (
    <div data-slot="input-group" className={cn('flex items-center gap-2', className)} {...props} />
  )
}

export { InputGroup }
