import * as React from 'react'

function Slider({ value, onChange, min = 0, max = 100, step = 1, className, ...props }) {
	return (
		<input
			type="range"
			value={value}
			onChange={onChange}
			min={min}
			max={max}
			step={step}
			className={className}
			{...props}
		/>
	)
}

export default Slider
export { Slider }
