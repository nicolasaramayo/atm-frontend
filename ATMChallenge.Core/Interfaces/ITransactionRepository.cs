using ATMChallenge.Core.Entities;

namespace ATMChallenge.Core.Interfaces
{
    public interface ITransactionRepository : IRepository<Transaction>
    {
        Task<IEnumerable<Transaction>> GetByCardIdAsync(int cardId);
        Task<Transaction> CreateTransactionAsync(int cardId, TransactionType type, decimal? amount = null, decimal? balanceAfter = null);
    }
}
