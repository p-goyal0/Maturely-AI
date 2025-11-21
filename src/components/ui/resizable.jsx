import * as React from 'react'

function Resizable({ children, className, ...props }) {
	return (
		<div className={className} {...props}>
			{children}
		</div>
	)
}

export default Resizable
export { Resizable }
