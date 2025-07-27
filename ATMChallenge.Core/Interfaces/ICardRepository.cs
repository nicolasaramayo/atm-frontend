using ATMChallenge.Core.Entities;

namespace ATMChallenge.Core.Interfaces
{
    public interface ICardRepository : IRepository<Card>
    {
        Task<Card?> GetByCardNumberAsync(string cardNumber);
        Task<bool> ValidateCardAsync(string cardNumber, string pin);
        Task IncrementFailedAttemptsAsync(int cardId);
        Task ResetFailedAttemptsAsync(int cardId);
        Task BlockCardAsync(int cardId);
        Task UpdateLastAccessAsync(int cardId);
        Task UpdateBalanceAsync(int cardId, decimal newBalance);
    }
}
