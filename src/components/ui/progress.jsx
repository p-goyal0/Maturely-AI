import * as React from 'react'

function Progress({ value = 0, className, ...props }) {
	const pct = Math.max(0, Math.min(100, Number(value)))

	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={pct}
			className={className}
			{...props}
		>
			<div style={{ width: '100%', background: 'var(--bg, #e5e7eb)', borderRadius: 8, overflow: 'hidden' }}>
				<div
					style={{ width: `${pct}%`, height: 8, background: 'var(--accent, #2563eb)', transition: 'width 200ms ease' }}
				/>
			</div>
		</div>
	)
}

export default Progress
export { Progress }
