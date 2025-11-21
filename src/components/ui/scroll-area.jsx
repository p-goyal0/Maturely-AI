import * as React from 'react'

function ScrollArea({ children, className, style, ...props }) {
	return (
		<div className={className} style={{ overflow: 'auto', ...style }} {...props}>
			{children}
		</div>
	)
}

export default ScrollArea
export { ScrollArea }
