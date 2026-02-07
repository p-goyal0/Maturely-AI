import './IoButton.css';

const DefaultArrowIcon = () => (
  <svg
    height="24"
    width="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Reusable CTA button with sliding icon (Uiverse-style).
 * Use for primary actions like "Compare", "Get started", etc.
 *
 * @param {React.ReactNode} [children] - Button label
 * @param {React.ReactNode} [icon] - Icon to show in the right pill (default: arrow)
 * @param {string} [variant] - 'purple' (default) | 'teal'
 * @param {string} [className] - Extra class names
 * @param {object} [props] - Other button attributes (onClick, disabled, type, etc.)
 */
export function IoButton({
  children,
  icon,
  variant = 'purple',
  className = '',
  ...props
}) {
  const variantClass = variant === 'teal' ? ' io-button--teal' : '';
  return (
    <button
      type="button"
      className={`io-button${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
      <span className="io-button__icon">
        {icon ?? <DefaultArrowIcon />}
      </span>
    </button>
  );
}
