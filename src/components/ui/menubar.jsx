export * from '@/components/ui/menubar'
export { default } from '@/components/ui/menubar'
import * as React from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'

import { cn } from '@/lib/utils'

function Menubar({ ...props }) {
  return <MenubarPrimitive.Root data-slot="menubar" {...props} />
}

export { Menubar }
