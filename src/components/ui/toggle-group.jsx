import * as React from 'react'

function ToggleGroup({ children, className, ...props }) {
	return (
		<div role="group" className={className} {...props}>
			{children}
		</div>
	)
}

export default ToggleGroup
export { ToggleGroup }
