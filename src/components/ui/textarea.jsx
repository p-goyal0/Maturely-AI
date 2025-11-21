import * as React from 'react'
import { cn } from '@/lib/utils'

function Textarea({ className, ...props }) {
	return <textarea data-slot="textarea" className={cn(className)} {...props} />
}

export default Textarea
export { Textarea }
