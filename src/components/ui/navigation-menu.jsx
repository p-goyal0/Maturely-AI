export * from '@/components/ui/navigation-menu'
export { default } from '@/components/ui/navigation-menu'
import * as React from 'react'
import * as NavMenuPrimitive from '@radix-ui/react-navigation-menu'

import { cn } from '@/lib/utils'

function NavigationMenu({ ...props }) {
  return <NavMenuPrimitive.Root data-slot="navigation-menu" {...props} />
}

export { NavigationMenu }
