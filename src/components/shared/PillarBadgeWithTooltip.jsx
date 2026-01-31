/**
 * Pillar badge with truncated name and tooltip showing full name on hover.
 * Based on Uiverse.io tooltip pattern – tooltip pops up above on hover.
 */
export function PillarBadgeWithTooltip({ name, className = '' }) {
  const fullName = name || '';

  return (
    <div
      className={`
        tooltip-container group relative inline-flex max-w-[200px]
        cursor-pointer rounded-lg border border-[#46CDCF]/30 bg-[#46CDCF]/10
        px-3 py-1.5 text-sm font-medium text-[#46CDCF]
        transition-all duration-200
        ${className}
      `}
    >
      {/* Tooltip: full name, appears above on hover (Uiverse-style) */}
      <span
        className="
          pointer-events-none absolute left-1/2 bottom-full z-50
          mb-2 -translate-x-1/2 rounded-lg border border-teal-200
          bg-[#0d9488] px-3 py-2 text-xs font-medium text-white
          opacity-0 shadow-lg transition-all duration-300
          group-hover:visible group-hover:translate-y-0 group-hover:opacity-100
          invisible translate-y-1
        "
        style={{ whiteSpace: 'normal', maxWidth: '280px' }}
      >
        {fullName}
        {/* Arrow pointing down (small rotated square) */}
        <span
          className="absolute left-1/2 top-[100%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-teal-200 bg-[#0d9488]"
          aria-hidden
        />
      </span>
      {/* Visible badge text: truncated with ellipsis */}
      <span className="block truncate" title={fullName}>
        {fullName}
      </span>
    </div>
  );
}
