import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { atmService } from '../services/atmService';
import { CardInfoResponse, ValidationResult } from '../types/api';
import NumericKeypad from '../components/NumericKeypad';
import './PinEntry.css';

const PinEntry: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [cardInfo, setCardInfo] = useState<CardInfoResponse | null>(null);
  const navigate = useNavigate();

  const MAX_ATTEMPTS: number = 4;

  useEffect(() => {
    const storedCardInfo: string | null = sessionStorage.getItem('cardInfo');
    if (!storedCardInfo) {
      navigate('/');
      return;
    }
    try {
      const parsedCardInfo: CardInfoResponse = JSON.parse(storedCardInfo);
      setCardInfo(parsedCardInfo);
    } catch (error) {
      console.error('Error parsing card info:', error);
      navigate('/');
    }
  }, [navigate]);

  const validatePin = useCallback((pinValue: string): ValidationResult => {
    if (pinValue.length !== 4) {
      return {
        isValid: false,
        message: 'Por favor ingrese un PIN de 4 dígitos'
      };
    }
    return { isValid: true };
  }, []);

  const handleNumberClick = useCallback((number: number): void => {
    if (pin.length < 4) {
      setPin(prev => prev + number);
      setError('');
    }
  }, [pin]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    const validation: ValidationResult = validatePin(pin);
    if (!validation.isValid) {
      setError(validation.message || 'Error de validación');
      return;
    }

    if (!cardInfo) {
      setError('Información de tarjeta no disponible');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await atmService.validatePin(cardInfo.cardNumber, pin);
      
      if (response.success && response.data) {
        const updatedCardInfo: CardInfoResponse = response.data;
        sessionStorage.setItem('cardInfo', JSON.stringify(updatedCardInfo));
        navigate('/operations');
      } else {
        const newAttempts: number = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= MAX_ATTEMPTS) {
          navigate('/error', { 
            state: { 
              message: 'Su tarjeta ha sido bloqueada por múltiples intentos fallidos.',
              showBackButton: true 
            } 
          });
        } else {
          setError(`PIN incorrecto. Intento ${newAttempts} de ${MAX_ATTEMPTS}`);
          setPin('');
        }
      }
    } catch (error) {
      setError('Error de conexión. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [pin, validatePin, cardInfo, attempts, navigate]);

  const handleClear = useCallback((): void => {
    setPin('');
    setError('');
  }, []);

  const handleExit = useCallback((): void => {
    sessionStorage.removeItem('cardInfo');
    navigate('/');
  }, [navigate]);

  if (!cardInfo) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h1>Ingrese su PIN</h1>
      <p>Tarjeta: {cardInfo.maskedCardNumber}</p>

      <div className="input-group">
        <label>PIN</label>
        <input
          type="password"
          value={pin}
          readOnly
          placeholder="****"
          className="pin-display"
        />
        <small>Ingrese su PIN de 4 dígitos</small>
      </div>

      {error && <div className="error">{error}</div>}

      {attempts > 0 && (
        <div className="attempts">
          Intentos restantes: {MAX_ATTEMPTS - attempts}
        </div>
      )}

      <NumericKeypad
        onNumberClick={handleNumberClick}
        onClear={handleClear}
        onAccept={handleSubmit}
        onExit={handleExit}
        showExitButton={true}
        acceptButtonText={isLoading ? 'Validando...' : 'Aceptar'}
      />
    </div>
  );
};

export default PinEntry; 