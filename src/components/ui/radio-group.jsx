import * as React from 'react'

function RadioGroup({ children, className, ...props }) {
	return (
		<div role="radiogroup" className={className} {...props}>
			{children}
		</div>
	)
}

function RadioItem({ children, value, className, ...props }) {
	return (
		<label className={className} {...props}>
			<input type="radio" value={value} />
			{children}
		</label>
	)
}

export default RadioGroup
export { RadioGroup, RadioItem }
