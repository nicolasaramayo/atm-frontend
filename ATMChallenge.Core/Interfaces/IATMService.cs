using ATMChallenge.Core.DTOs;

namespace ATMChallenge.Core.Interfaces
{
    public interface IATMService
    {
        Task<ApiResponse<CardInfoResponse>> ValidateCardAsync(CardValidationRequest request);
        Task<ApiResponse<CardInfoResponse>> ValidatePinAsync(PinValidationRequest request);
        Task<ApiResponse<CardInfoResponse>> GetBalanceAsync(string cardNumber);
        Task<ApiResponse<TransactionResponse>> WithdrawAsync(WithdrawalRequest request);
    }
}
