import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { atmService } from '../services/atmService';
import { CardInfoResponse, ValidationResult } from '../types/api';
import NumericKeypad from '../components/NumericKeypad';
import './Home.css';

const Home: React.FC = () => {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const validateCardNumber = useCallback((number: string): ValidationResult => {
    if (number.length !== 16) {
      return {
        isValid: false,
        message: 'Por favor ingrese un número de tarjeta de 16 dígitos'
      };
    }
    return { isValid: true };
  }, []);

  const handleNumberClick = useCallback((number: number): void => {
    if (cardNumber.length < 16) {
      setCardNumber(prev => prev + number);
      setError('');
    }
  }, [cardNumber]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    const validation: ValidationResult = validateCardNumber(cardNumber);
    if (!validation.isValid) {
      setError(validation.message || 'Error de validación');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await atmService.validateCard(cardNumber);
      
      if (response.success && response.data) {
        const cardInfo: CardInfoResponse = response.data;
        sessionStorage.setItem('cardInfo', JSON.stringify(cardInfo));
        navigate('/pin');
      } else {
        setError(response.message || 'Tarjeta no válida o bloqueada');
      }
    } catch (error) {
      setError('Error de conexión. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [cardNumber, validateCardNumber, navigate]);

  const handleClear = useCallback((): void => {
    setCardNumber('');
    setError('');
  }, []);

  return (
    <div className="container">
      <h1>ATM  Cajero Automático</h1>
      <p>Bienvenido al sistema de cajero automático</p>

      <div className="input-group">
        <label>Número de Tarjeta</label>
        <input
          type="text"
          value={cardNumber}
          readOnly
          placeholder="Ingrese su número de tarjeta"
          className="card-display"
        />
        <small>Ingrese un número de tarjeta de 16 dígitos</small>
      </div>

      {error && <div className="error">{error}</div>}

      <NumericKeypad
        onNumberClick={handleNumberClick}
        onClear={handleClear}
        onAccept={handleSubmit}
        acceptButtonText={isLoading ? 'Validando...' : 'Aceptar'}
      />
    </div>
  );
};

export default Home; 