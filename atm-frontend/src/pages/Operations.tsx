import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { atmService } from '../services/atmService';
import { CardInfoResponse, ATMOperation } from '../types/api';
import './Operations.css';

const Operations: React.FC = () => {
  const [cardInfo, setCardInfo] = useState<CardInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentOperation, setCurrentOperation] = useState<ATMOperation | null>(null);
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

  const handleBalance = useCallback(async (): Promise<void> => {
    if (!cardInfo) {
      navigate('/error', { 
        state: { 
          message: 'Información de tarjeta no disponible',
          showBackButton: true 
        } 
      });
      return;
    }

    setIsLoading(true);
    setCurrentOperation('balance');

    try {
      const response = await atmService.getBalance(cardInfo.cardNumber);
      if (response.success && response.data) {
        const updatedCardInfo: CardInfoResponse = response.data;
        sessionStorage.setItem('cardInfo', JSON.stringify(updatedCardInfo));
        navigate('/balance');
      } else {
        navigate('/error', { 
          state: { 
            message: response.message || 'Error al consultar el balance',
            showBackButton: true 
          } 
        });
      }
    } catch (error) {
      navigate('/error', { 
        state: { 
          message: 'Error de conexión al consultar el balance',
          showBackButton: true 
        } 
      });
    } finally {
      setIsLoading(false);
      setCurrentOperation(null);
    }
  }, [cardInfo, navigate]);

  const handleWithdraw = useCallback((): void => {
    navigate('/withdraw');
  }, [navigate]);

  const handleExit = useCallback((): void => {
    sessionStorage.removeItem('cardInfo');
    navigate('/');
  }, [navigate]);

  if (!cardInfo) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h1>Operaciones Disponibles</h1>
      <p>Tarjeta: {cardInfo.maskedCardNumber}</p>

      <div className="buttons">
        <button 
          onClick={handleBalance} 
          disabled={isLoading}
        >
          Balance
        </button>
        <button 
          onClick={handleWithdraw} 
          disabled={isLoading}
        >
          Retiro
        </button>
        <button 
          onClick={handleExit} 
          disabled={isLoading}
        >
          Salir
        </button>
      </div>

      {isLoading && (
        <p>
          Procesando {currentOperation === 'balance' ? 'consulta de balance' : 'operación'}...
        </p>
      )}
    </div>
  );
};

export default Operations; 