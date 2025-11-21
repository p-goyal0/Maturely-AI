import * as React from 'react'

function Table({ children, className, ...props }) {
	return (
		<div className={className} {...props}>
			{children}
		</div>
	)
}

export default Table
export { Table }
