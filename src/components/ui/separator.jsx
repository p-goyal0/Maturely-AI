import * as React from 'react'

function Separator({ className, ...props }) {
	return <hr className={className} {...props} />
}

export default Separator
export { Separator }
