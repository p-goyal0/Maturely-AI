export * from '@/components/ui/pagination'
export { default } from '@/components/ui/pagination'
import * as React from 'react'

import { cn } from '@/lib/utils'

function Pagination({ className, ...props }) {
  return <nav data-slot="pagination" className={cn('flex items-center gap-2', className)} {...props} />
}

export { Pagination }
