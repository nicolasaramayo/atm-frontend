import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { atmService } from '../services/atmService';
import { CardInfoResponse, ValidationResult } from '../types/api';
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

  const handleCardNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 16) {
      setCardNumber(value);
      setError('');
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const validation: ValidationResult = validateCardNumber(cardNumber);
    if (!validation.isValid) {
      setError(validation.message || 'Error de validación');
      return;
    }

    setIsLoading(true);
    setError('');

    // a mejorar
    try {
      const response = await atmService.validateCard(cardNumber);
      
      if (response.success && response.data) {
        const cardInfo: CardInfoResponse = response.data;
        sessionStorage.setItem('cardInfo', JSON.stringify(cardInfo)); // utilizo sessionStorage para almacenar la informacion de la tarjeta? MMM.. a mejorar.                                                              // no se si es la mejor opcion, pero es la que se me ocurrio. 
        navigate('/pin');
      } else {
        setError(response.message || 'Tarjeta no válida o bloqueada'); // a mejorar
      }
    } catch (error) {
      setError('Error de conexión. Por favor intente nuevamente.'); // Si ingreso un numero de tarjeta invalido, a mejorar est mal 
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

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="cardNumber">Número de Tarjeta</label>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="Ingrese su número de tarjeta"
            maxLength={16}
            disabled={isLoading}
          />
          <small>Ingrese un número de tarjeta de 16 dígitos</small>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="buttons">
          <button type="button" onClick={handleClear} disabled={isLoading}>
            Limpiar
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Validando...' : 'Aceptar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home; 