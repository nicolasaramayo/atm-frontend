import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardInfoResponse } from '../types/api';
import './Balance.css';

const Balance: React.FC = () => {
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

  const handleBack = useCallback((): void => {
    navigate('/operations');
  }, [navigate]);

  const handleExit = useCallback((): void => {
    sessionStorage.removeItem('cardInfo');
    navigate('/');
  }, [navigate]);

  const formatDate = useCallback((dateString: string): string => {
    const date: Date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit'
    });
  }, []);

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
      <h1>Consulta de Balance</h1>
      <p>Información de su cuenta</p>

      <div className="card-info">
        <div className="info-row">
          <span>Número de Tarjeta:</span>
          <span>{cardInfo.maskedCardNumber}</span>
        </div>
        
        <div className="info-row">
          <span>Fecha de Vencimiento:</span>
          <span>{formatDate(cardInfo.expirationDate)}</span>
        </div>
        
        <div className="info-row">
          <span>Saldo Disponible:</span>
          <span className="balance">{formatCurrency(cardInfo.balance)}</span>
        </div>
      </div>

      <div className="buttons">
        <button onClick={handleBack}>Atrás</button>
        <button onClick={handleExit}>Salir</button>
      </div>
    </div>
  );
};

export default Balance; 