import './DotSpinner.css';

export function DotSpinner({ className = '', size = '2.8rem', color = '#183153' }) {
  return (
    <div 
      className={`dot-spinner ${className}`}
      style={{
        '--uib-size': size,
        '--uib-color': color,
      }}
    >
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  );
}

export default DotSpinner;
