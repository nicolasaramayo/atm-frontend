using Microsoft.EntityFrameworkCore;
using ATMChallenge.Core.Entities;
using ATMChallenge.Core.Interfaces;
using ATMChallenge.Infrastructure.Data;

namespace ATMChallenge.Infrastructure.Repositories
{
    public class CardRepository : Repository<Card>, ICardRepository
    {
        public CardRepository(ATMDbContext context) : base(context)
        {
        }

        public async Task<Card?> GetByCardNumberAsync(string cardNumber)
        {
            return await _dbSet
                .Include(c => c.Transactions)
                .FirstOrDefaultAsync(c => c.CardNumber == cardNumber);
        }

        public async Task<bool> ValidateCardAsync(string cardNumber, string pin)
        {
            var card = await GetByCardNumberAsync(cardNumber);
            return card != null && card.Pin == pin && !card.IsBlocked;
        }

        public async Task IncrementFailedAttemptsAsync(int cardId)
        {
            var card = await GetByIdAsync(cardId);
            if (card != null)
            {
                card.FailedAttempts++;
                if (card.FailedAttempts >= 4)
                {
                    card.IsBlocked = true;
                }
                await UpdateAsync(card);
            }
        }

        public async Task ResetFailedAttemptsAsync(int cardId)
        {
            var card = await GetByIdAsync(cardId);
            if (card != null)
            {
                card.FailedAttempts = 0;
                await UpdateAsync(card);
            }
        }

        public async Task BlockCardAsync(int cardId)
        {
            var card = await GetByIdAsync(cardId);
            if (card != null)
            {
                card.IsBlocked = true;
                card.FailedAttempts = 4;
                await UpdateAsync(card);
            }
        }

        public async Task UpdateLastAccessAsync(int cardId)
        {
            var card = await GetByIdAsync(cardId);
            if (card != null)
            {
                card.LastAccessAt = DateTime.UtcNow;
                await UpdateAsync(card);
            }
        }

        public async Task UpdateBalanceAsync(int cardId, decimal newBalance)
        {
            var card = await GetByIdAsync(cardId);
            if (card != null)
            {
                card.Balance = newBalance;
                await UpdateAsync(card);
            }
        }
    }
}
