export * from '@/components/ui/aspect-ratio'
export { default } from '@/components/ui/aspect-ratio'
"use client"

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'

function AspectRatio({ ...props }) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
