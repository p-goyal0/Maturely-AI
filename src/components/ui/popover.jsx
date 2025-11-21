export * from '@/components/ui/popover'
export { default } from '@/components/ui/popover'
import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'

function Popover({ ...props }) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({ className, ...props }) {
  return (
    <PopoverPrimitive.Content data-slot="popover-content" className={cn('bg-popover p-2 rounded-md shadow-md', className)} {...props} />
  )
}

export { Popover, PopoverTrigger, PopoverContent }
