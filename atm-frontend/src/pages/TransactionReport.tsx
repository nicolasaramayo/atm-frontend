import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionResponse } from '../types/api';
import './TransactionReport.css';

const TransactionReport: React.FC = () => {
  const [transactionInfo, setTransactionInfo] = useState<TransactionResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTransactionInfo: string | null = sessionStorage.getItem('transactionInfo');
    if (!storedTransactionInfo) {
      navigate('/operations');
      return;
    }
    try {
      const parsedTransactionInfo: TransactionResponse = JSON.parse(storedTransactionInfo);
      setTransactionInfo(parsedTransactionInfo);
    } catch (error) {
      console.error('Error parsing transaction info:', error);
      navigate('/operations');
    }
  }, [navigate]);

  const handleBack = useCallback((): void => {
    sessionStorage.removeItem('transactionInfo');
    navigate('/operations');
  }, [navigate]);

  const handleExit = useCallback((): void => {
    sessionStorage.removeItem('cardInfo');
    sessionStorage.removeItem('transactionInfo');
    navigate('/');
  }, [navigate]);

  const formatDate = useCallback((dateString: string): string => {
    const date: Date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  }, []);

  if (!transactionInfo) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h1>Reporte de Transacción</h1>
      <p>Operación completada exitosamente</p>

      <div className="transaction-info">
        <div className="info-row">
          <span>Número de Tarjeta:</span>
          <span>{transactionInfo.maskedCardNumber}</span>
        </div>
        
        <div className="info-row">
          <span>Fecha y Hora:</span>
          <span>{formatDate(transactionInfo.transactionDate)}</span>
        </div>
        
        <div className="info-row">
          <span>Tipo de Operación:</span>
          <span>{transactionInfo.transactionType}</span>
        </div>
        
        <div className="info-row">
          <span>Monto Retirado:</span>
          <span className="amount">{formatCurrency(transactionInfo.amount)}</span>
        </div>
        
        <div className="info-row">
          <span>Saldo Restante:</span>
          <span className="balance">{formatCurrency(transactionInfo.balanceAfter)}</span>
        </div>
      </div>

      <div className="buttons">
        <button onClick={handleBack}>Atrás</button>
        <button onClick={handleExit}>Salir</button>
      </div>
    </div>
  );
};

export default TransactionReport; 