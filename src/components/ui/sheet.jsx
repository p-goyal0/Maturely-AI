import * as React from 'react'

function Sheet({ children, className, ...props }) {
	return (
		<div data-slot="sheet" className={className} {...props}>
			{children}
		</div>
	)
}

export default Sheet
export { Sheet }
