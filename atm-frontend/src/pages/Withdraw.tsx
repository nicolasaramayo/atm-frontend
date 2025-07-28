import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { atmService } from '../services/atmService';
import { CardInfoResponse, TransactionResponse, ValidationResult } from '../types/api';
import NumericKeypad from '../components/NumericKeypad';
import './Withdraw.css';

const Withdraw: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cardInfo, setCardInfo] = useState<CardInfoResponse | null>(null);
  const navigate = useNavigate();

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

  const validateAmount = useCallback((amountValue: string, cardBalance: number): ValidationResult => {
    if (!amountValue || amountValue === '0') {
      return {
        isValid: false,
        message: 'Por favor ingrese un monto válido'
      };
    }

    const withdrawAmount: number = parseFloat(amountValue);
    
    if (withdrawAmount > cardBalance) {
      return {
        isValid: false,
        message: 'El monto excede el saldo disponible en su cuenta'
      };
    }

    if (withdrawAmount <= 0) {
      return {
        isValid: false,
        message: 'El monto debe ser mayor a 0'
      };
    }

    return { isValid: true };
  }, []);

  const handleNumberClick = useCallback((number: number): void => {
    setAmount(prev => prev + number);
    setError('');
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!cardInfo) {
      setError('Información de tarjeta no disponible');
      return;
    }

    const validation: ValidationResult = validateAmount(amount, cardInfo.balance);
    if (!validation.isValid) {
      setError(validation.message || 'Error de validación');
      return;
    }

    const withdrawAmount: number = parseFloat(amount);
    setIsLoading(true);
    setError('');

    try {
      const response = await atmService.withdraw(cardInfo.cardNumber, withdrawAmount);
      
      if (response.success && response.data) {
        const transactionInfo: TransactionResponse = response.data;
        sessionStorage.setItem('transactionInfo', JSON.stringify(transactionInfo));
        navigate('/transaction-report');
      } else {
        setError(response.message || 'Error al procesar el retiro');
      }
    } catch (error) {
      setError('Error de conexión. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [amount, validateAmount, cardInfo, navigate]);

  const handleClear = useCallback((): void => {
    setAmount('');
    setError('');
  }, []);

  const handleExit = useCallback((): void => {
    sessionStorage.removeItem('cardInfo');
    navigate('/');
  }, [navigate]);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  }, []);

  if (!cardInfo) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h1>Retiro de Dinero</h1>
      <p>Tarjeta: {cardInfo.maskedCardNumber}</p>
      <p>Saldo disponible: {formatCurrency(cardInfo.balance)}</p>

      <div className="input-group">
        <label>Monto a Retirar</label>
        <input
          type="text"
          value={amount}
          readOnly
          placeholder="Ingrese el monto"
          className="amount-display"
        />
        <small>Ingrese el monto que desea retirar</small>
      </div>

      {error && <div className="error">{error}</div>}

      <NumericKeypad
        onNumberClick={handleNumberClick}
        onClear={handleClear}
        onAccept={handleSubmit}
        onExit={handleExit}
        showExitButton={true}
        acceptButtonText={isLoading ? 'Procesando...' : 'Aceptar'}
      />
    </div>
  );
};

export default Withdraw; 