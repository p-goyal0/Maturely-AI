import './PricingToggle.css';

/**
 * Reusable pricing toggle (Monthly / Annually switch).
 * Based on Uiverse.io by namecho.
 *
 * @param {boolean} checked - Controlled checked state
 * @param {function} onCheckedChange - Callback (checked: boolean) => void
 * @param {string} [leftLabel] - Optional label on the left (e.g. "Monthly")
 * @param {string} [rightLabel] - Optional label on the right (e.g. "Annually")
 * @param {React.ReactNode} [badge] - Optional badge shown when checked (e.g. "Save 15%")
 * @param {string} [className] - Optional wrapper class
 */
export function PricingToggle({
  checked,
  onCheckedChange,
  leftLabel,
  rightLabel,
  badge,
  className = '',
}) {
  return (
    <div className={`flex items-center justify-center gap-4 flex-wrap ${className}`}>
      {leftLabel != null && (
        <span className="text-gray-700 font-medium select-none flex-shrink-0">{leftLabel}</span>
      )}
      <label className="pricing-toggle cursor-pointer flex-shrink-0">
        <input
          type="checkbox"
          checked={!!checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          aria-label={leftLabel && rightLabel ? `${checked ? rightLabel : leftLabel} selected` : undefined}
        />
        <span className="pricing-toggle-slider" aria-hidden />
      </label>
      {rightLabel != null && (
        <span className="text-gray-700 font-medium select-none flex-shrink-0 min-w-[4.5rem]">{rightLabel}</span>
      )}
      {badge != null && (
        <span className="inline-block min-w-[5.5rem] text-center flex-shrink-0">
          {checked ? (
            <span className="text-[#185D54] text-sm bg-[#185D54]/10 px-2 py-1 rounded">{badge}</span>
          ) : (
            <span className="invisible text-sm px-2 py-1 rounded">{badge}</span>
          )}
        </span>
      )}
    </div>
  );
}
