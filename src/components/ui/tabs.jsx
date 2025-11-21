import * as React from 'react'

// Minimal Tabs implementation (keeps API small and predictable).
// Exports: Tabs (default), TabsList, TabsTrigger, TabsContent

const TabsContext = /*#__PURE__*/ React.createContext(null)

function Tabs({ defaultValue = null, value: controlledValue, onValueChange, children }) {
	const [value, setValue] = React.useState(defaultValue)

	const isControlled = controlledValue !== undefined && controlledValue !== null

	const current = isControlled ? controlledValue : value

	const setCurrent = (v) => {
		if (!isControlled) setValue(v)
		onValueChange == null ? void 0 : onValueChange(v)
	}

	return (
		<TabsContext.Provider value={{ value: current, setValue: setCurrent }}>
			<div data-ui="tabs">{children}</div>
		</TabsContext.Provider>
	)
}

function TabsList({ children, className, ...props }) {
	return (
		<div role="tablist" className={className} {...props}>
			{children}
		</div>
	)
}

function TabsTrigger({ value, children, className, ...props }) {
	const ctx = React.useContext(TabsContext)
	const selected = ctx?.value === value

	return (
		<button
			role="tab"
			aria-selected={selected}
			data-state={selected ? 'active' : 'inactive'}
			onClick={() => ctx?.setValue(value)}
			className={className}
			{...props}
		>
			{children}
		</button>
	)
}

function TabsContent({ value, children, className, ...props }) {
	const ctx = React.useContext(TabsContext)
	if (ctx?.value !== value) return null
	return (
		<div role="tabpanel" className={className} {...props}>
			{children}
		</div>
	)
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
export default Tabs
