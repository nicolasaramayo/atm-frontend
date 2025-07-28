import React from 'react';
import './NumericKeypad.css';

interface NumericKeypadProps {
  onNumberClick: (number: number) => void;
  onClear: () => void;
  onAccept: () => void;
  onExit?: () => void;
  showExitButton?: boolean;
  acceptButtonText?: string;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onNumberClick,
  onClear,
  onAccept,
  onExit,
  showExitButton = false,
  acceptButtonText = 'Aceptar'
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="numeric-keypad">
      <div className="keypad-grid">
        {numbers.map((number) => (
          <button
            key={number}
            className="keypad-button"
            onClick={() => onNumberClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="keypad-actions">
        <button className="action-button clear" onClick={onClear}>
          Limpiar
        </button>
        <button className="action-button accept" onClick={onAccept}>
          {acceptButtonText}
        </button>
        {showExitButton && onExit && (
          <button className="action-button exit" onClick={onExit}>
            Salir
          </button>
        )}
      </div>
    </div>
  );
};

export default NumericKeypad; 