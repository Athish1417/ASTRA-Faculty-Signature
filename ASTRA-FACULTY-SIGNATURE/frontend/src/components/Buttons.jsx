import "./Buttons.css";

export function PrimaryButton({ children, onClick, type = "button", disabled, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--primary ${className}`}
    >
      <span>{children}</span>
    </button>
  );
}

export function SecondaryButton({ children, onClick, type = "button", disabled, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--secondary ${className}`}
    >
      {children}
    </button>
  );
}
