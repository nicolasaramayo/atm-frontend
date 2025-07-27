using Microsoft.EntityFrameworkCore;
using ATMChallenge.Core.Entities;
using ATMChallenge.Core.Interfaces;
using ATMChallenge.Infrastructure.Data;

namespace ATMChallenge.Infrastructure.Repositories
{
    public class TransactionRepository : Repository<Transaction>, ITransactionRepository
    {
        public TransactionRepository(ATMDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Transaction>> GetByCardIdAsync(int cardId)
        {
            return await _dbSet
                .Where(t => t.CardId == cardId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Transaction> CreateTransactionAsync(int cardId, TransactionType type, decimal? amount = null, decimal? balanceAfter = null)
        {
            var transaction = new Transaction
            {
                CardId = cardId,
                Type = type,
                Amount = amount,
                BalanceAfterTransaction = balanceAfter,
                CreatedAt = DateTime.UtcNow
            };

            return await AddAsync(transaction);
        }
    }
}
