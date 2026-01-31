/**
 * Custom billing contact checkbox (from Uiverse.io by elijahgummer).
 * Wipe animation on check/uncheck. Use in Billing Contact column.
 */
import './BillingContactCheckbox.css';

export function BillingContactCheckbox({ checked = false, onCheckedChange, disabled = false, className = '' }) {
  const handleChange = (e) => {
    if (disabled) return;
    onCheckedChange?.(e.target.checked);
  };

  return (
    <label
      className={`billing-contact-checkbox container block ${disabled ? 'disabled' : ''} ${className}`}
      onClick={(e) => disabled && e.preventDefault()}
    >
      <input
        type="checkbox"
        checked={!!checked}
        onChange={handleChange}
        disabled={disabled}
        aria-label="Billing contact"
      />
      <div className="checkmark" />
    </label>
  );
}
