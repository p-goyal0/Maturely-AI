import * as React from 'react'

function Toggle({ checked = false, onChange, className, ...props }) {
	return (
		<label className={className}>
			<input type="checkbox" checked={checked} onChange={onChange} {...props} />
			<span aria-hidden="true" />
		</label>
	)
}

export default Toggle
export { Toggle }
