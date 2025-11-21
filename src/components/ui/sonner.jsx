import * as React from 'react'

// Lightweight stub for sonner (to avoid unresolved import during conversion).
function Sonner() {
	return null
}

function toast(message) {
	// noop placeholder
	console.log('toast:', message)
}

export default Sonner
export { Sonner, toast }
