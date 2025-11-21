import * as React from 'react'

function Select({ children, className, ...props }) {
	return (
		<select className={className} {...props}>
			{children}
		</select>
	)
}

export default Select
export { Select }
