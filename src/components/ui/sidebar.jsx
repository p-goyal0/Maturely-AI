import * as React from 'react'

function Sidebar({ children, className, ...props }) {
	return (
		<aside data-slot="sidebar" className={className} {...props}>
			{children}
		</aside>
	)
}

export default Sidebar
export { Sidebar }
