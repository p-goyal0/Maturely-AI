import * as React from 'react'

function Skeleton({ className, style, ...props }) {
	return <div className={className} style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 4, ...style }} {...props} />
}

export default Skeleton
export { Skeleton }
