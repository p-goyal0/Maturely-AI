import './DeleteButton.css';

/**
 * Reusable delete button – icon with tooltip on hover.
 * Transparent by default; icon scales and turns red on hover, "delete" tooltip appears above.
 *
 * @param {function} [onClick] - Click handler
 * @param {string} [label='delete'] - Tooltip text (shown above on hover)
 * @param {string} [className] - Extra class names
 * @param {object} [props] - Other button attributes (e.g. disabled, type)
 */
export function DeleteButton({ onClick, label = 'delete', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`delete-btn delete-btn-icon-tooltip ${className}`.trim()}
      onClick={(e) => {
        e?.stopPropagation?.();
        onClick?.(e);
      }}
      aria-label={label}
      {...props}
    >
      <span className="delete-btn-tooltip" aria-hidden>
        {label}
      </span>
      <svg
        viewBox="0 0 15 17.5"
        height="17.5"
        width="15"
        xmlns="http://www.w3.org/2000/svg"
        className="delete-btn-icon"
        aria-hidden
      >
        <path
          transform="translate(-2.5 -1.25)"
          d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
        />
      </svg>
    </button>
  );
}
