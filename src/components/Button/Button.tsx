import './Button.css';

interface ButtonProps {
  buttonText: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({ buttonText, type = 'button', disabled = false, onClick }: ButtonProps) {
  return (
    <button className="custom-button" type={type} disabled={disabled} onClick={onClick}>
      {buttonText}
    </button>
  );
}
