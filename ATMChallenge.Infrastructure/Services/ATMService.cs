using ATMChallenge.Core.DTOs;
using ATMChallenge.Core.Entities;
using ATMChallenge.Core.Interfaces;
using ATMChallenge.Core.Utilities;

namespace ATMChallenge.Infrastructure.Services
{
    public class ATMService : IATMService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ATMService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<CardInfoResponse>> ValidateCardAsync(CardValidationRequest request)
        {
            try
            {
                // Validate card number format
                if (!CardUtilities.IsValidCardNumber(request.CardNumber))
                {
                    return ApiResponse<CardInfoResponse>.ErrorResponse("Número de tarjeta inválido");
                }

                var card = await _unitOfWork.Cards.GetByCardNumberAsync(request.CardNumber);

                if (card == null)
                {
                    return ApiResponse<CardInfoResponse>.ErrorResponse("Tarjeta no encontrada");
                }

                if (card.IsBlocked)
                {
                    return ApiResponse<CardInfoResponse>.ErrorResponse("Tarjeta bloqueada");
                }

                var cardInfo = new CardInfoResponse
                {
                    CardNumber = card.CardNumber,
                    MaskedCardNumber = CardUtilities.MaskCardNumber(card.CardNumber),
                    Balance = card.Balance,
                    ExpirationDate = card.ExpirationDate,
                    IsBlocked = card.IsBlocked
                };

                return ApiResponse<CardInfoResponse>.SuccessResponse(cardInfo, "Tarjeta válida");
            }
            catch (Exception ex)
            {
                return ApiResponse<CardInfoResponse>.ErrorResponse($"Error interno del servidor: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CardInfoResponse>> ValidatePinAsync(PinValidationRequest request)
        {
            try
            {
                var card = await _unitOfWork.Cards.GetByCardNumberAsync(request.CardNumber);

                if (card == null)
                {
                    return ApiResponse<CardInfoResponse>.ErrorResponse("Tarjeta no encontrada");
                }

                if (card.IsBlocked)
                {
                    return ApiResponse<CardInfoResponse>.ErrorResponse("Tarjeta bloqueada");
                }

                if (card.Pin != request.Pin)
                {
                    await _unitOfWork.Cards.IncrementFailedAttemptsAsync(card.Id);
                    await _unitOfWork.SaveChangesAsync();

                    // Reload card to get updated failed attempts
                    card = await _unitOfWork.Cards.GetByIdAsync(card.Id);

                    if (card != null && card.IsBlocked)
                    {
                        return ApiResponse<CardInfoResponse>.ErrorResponse("PIN incorrecto. La tarjeta ha sido bloqueada por exceder el número máximo de intentos");
                    }

                    int remainingAttempts = 4 - (card?.FailedAttempts ?? 0);
                    return ApiResponse<CardInfoResponse>.ErrorResponse($"PIN incorrecto. Intentos restantes: {remainingAttempts}");
                }

                // PIN is correct, reset failed attempts and update last access
                await _unitOfWork.Cards.ResetFailedAttemptsAsync(card.Id);
                await _unitOfWork.Cards.UpdateLastAccessAsync(card.Id);
                await _unitOfWork.SaveChangesAsync();

                var cardInfo = new CardInfoResponse
                {
                    CardNumber = card.CardNumber,
                    MaskedCardNumber = CardUtilities.MaskCardNumber(card.CardNumber),
                    Balance = card.Balance,
                    ExpirationDate = card.ExpirationDate,
                    IsBlocked = card.IsBlocked
                };

                return ApiResponse<CardInfoResponse>.SuccessResponse(cardInfo, "PIN válido");
            }
            catch (Exception ex)
            {
                return ApiResponse<CardInfoResponse>.ErrorResponse($"Error interno del servidor: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CardInfoResponse>> GetBalanceAsync(string cardNumber)
        {
            try
            {
                var card = await _unitOfWork.Cards.GetByCardNumberAsync(cardNumber);

                if (card == null)
                {
                    return ApiResponse<CardInfoResponse>.ErrorResponse("Tarjeta no encontrada");
                }

                if (card.IsBlocked)
                {
                    return ApiResponse<CardInfoResponse>.ErrorResponse("Tarjeta bloqueada");
                }

                // Create balance transaction record
                await _unitOfWork.Transactions.CreateTransactionAsync(
                    card.Id, 
                    TransactionType.Balance, 
                    null, 
                    card.Balance
                );
                await _unitOfWork.SaveChangesAsync();

                var cardInfo = new CardInfoResponse
                {
                    CardNumber = card.CardNumber,
                    MaskedCardNumber = CardUtilities.MaskCardNumber(card.CardNumber),
                    Balance = card.Balance,
                    ExpirationDate = card.ExpirationDate,
                    IsBlocked = card.IsBlocked
                };

                return ApiResponse<CardInfoResponse>.SuccessResponse(cardInfo, "Consulta de balance exitosa");
            }
            catch (Exception ex)
            {
                return ApiResponse<CardInfoResponse>.ErrorResponse($"Error interno del servidor: {ex.Message}");
            }
        }

        public async Task<ApiResponse<TransactionResponse>> WithdrawAsync(WithdrawalRequest request)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var card = await _unitOfWork.Cards.GetByCardNumberAsync(request.CardNumber);

                if (card == null)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<TransactionResponse>.ErrorResponse("Tarjeta no encontrada");
                }

                if (card.IsBlocked)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<TransactionResponse>.ErrorResponse("Tarjeta bloqueada");
                }

                if (card.Balance < request.Amount)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<TransactionResponse>.ErrorResponse("Saldo insuficiente");
                }

                // Update card balance
                decimal newBalance = card.Balance - request.Amount;
                await _unitOfWork.Cards.UpdateBalanceAsync(card.Id, newBalance);

                // Create withdrawal transaction record
                await _unitOfWork.Transactions.CreateTransactionAsync(
                    card.Id,
                    TransactionType.Withdrawal,
                    request.Amount,
                    newBalance
                );

                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                var transactionResponse = new TransactionResponse
                {
                    CardNumber = card.CardNumber,
                    MaskedCardNumber = CardUtilities.MaskCardNumber(card.CardNumber),
                    Amount = request.Amount,
                    BalanceAfter = newBalance,
                    TransactionDate = DateTime.UtcNow,
                    TransactionType = "Retiro"
                };

                return ApiResponse<TransactionResponse>.SuccessResponse(transactionResponse, "Retiro exitoso");
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ApiResponse<TransactionResponse>.ErrorResponse($"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
