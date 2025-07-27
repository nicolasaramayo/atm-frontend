import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './Error.css';

const Error: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const errorMessage: string = location.state?.message || 'Ocurrido un error inesperado';
  const showBackButton: boolean = location.state?.showBackButton !== false;

  const handleBack = useCallback((): void => {
    if (showBackButton) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [showBackButton, navigate]);

  return (
    <div className="container">
      <h1>Error</h1>
      <p>Ha ocurrido un problemaS</p>

      <div className="error-message">
        {errorMessage}
      </div>

      <button onClick={handleBack}>Ir Atras</button>
    </div>
  );
};

export default Error; 