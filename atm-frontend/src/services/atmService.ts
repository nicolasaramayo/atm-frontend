import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  CardInfoResponse,
  TransactionResponse,
  CardValidationRequest,
  PinValidationRequest,
  WithdrawalRequest
} from '../types/api';

const API_BASE_URL: string = 'http://localhost:5021/api/atm'; // esto a otro lado.

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar errores de red
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error);
    throw new Error('Error de conexión con el servidor');
  }
);

export const atmService = {
  /**
   * Validacion número de tarjeta
   */
  async validateCard(cardNumber: string): Promise<ApiResponse<CardInfoResponse>> {
    try {
      const request: CardValidationRequest = { cardNumber };
      const response: AxiosResponse<ApiResponse<CardInfoResponse>> = await apiClient.post('/validate-card', request);
      return response.data;
    } catch (error) {
      console.error('Error validating card:', error);
      throw error;
    }
  },

  /**
   * Validacion PIN para una tarjeta
   */
  async validatePin(cardNumber: string, pin: string): Promise<ApiResponse<CardInfoResponse>> {
    try {
      const request: PinValidationRequest = { cardNumber, pin };
      const response: AxiosResponse<ApiResponse<CardInfoResponse>> = await apiClient.post('/validate-pin', request);
      return response.data;
    } catch (error) {
      console.error('Error validating PIN:', error);
      throw error;
    }
  },

  /**
   * Obtiene el balance de una tarjeta
   */
  async getBalance(cardNumber: string): Promise<ApiResponse<CardInfoResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<CardInfoResponse>> = await apiClient.get(`/balance/${cardNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  },

  /**
   * Realiza un retiro de dinero
   */
  async withdraw(cardNumber: string, amount: number): Promise<ApiResponse<TransactionResponse>> {
    try {
      const request: WithdrawalRequest = { cardNumber, amount };
      const response: AxiosResponse<ApiResponse<TransactionResponse>> = await apiClient.post('/withdraw', request);
      return response.data;
    } catch (error) {
      console.error('Error withdrawing money:', error);
      throw error;
    }
  }
}; 