// Tipos base para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors: string[];
}

// Tipos para información de tarjeta
export interface CardInfoResponse {
  cardNumber: string;
  maskedCardNumber: string;
  balance: number;
  expirationDate: string;
  isBlocked: boolean;
}

// Tipos para transacciones
export interface TransactionResponse {
  cardNumber: string;
  maskedCardNumber: string;
  amount: number;
  balanceAfter: number;
  transactionDate: string;
  transactionType: string;
}

// Tipos para requests
export interface CardValidationRequest {
  cardNumber: string;
}

export interface PinValidationRequest {
  cardNumber: string;
  pin: string;
}

export interface WithdrawalRequest {
  cardNumber: string;
  amount: number;
}

// Tipos para el estado de la aplicación
export interface AppState {
  cardInfo: CardInfoResponse | null;
  transactionInfo: TransactionResponse | null;
  isLoading: boolean;
  error: string | null;
}

// Tipos para navegación
export interface NavigationState {
  message?: string;
  showBackButton?: boolean;
}

// Tipos para eventos de formulario
export interface FormEvent {
  preventDefault(): void;
}

export interface InputChangeEvent {
  target: {
    value: string;
  };
}

// Tipos para validación
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Tipos para operaciones del ATM
export type ATMOperation = 'balance' | 'withdraw' | 'validate-card' | 'validate-pin';

// Tipos para estados de carga
export interface LoadingState {
  isLoading: boolean;
  operation?: ATMOperation;
} 