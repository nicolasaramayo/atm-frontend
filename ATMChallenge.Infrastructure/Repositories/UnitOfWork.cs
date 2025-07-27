using Microsoft.EntityFrameworkCore.Storage;
using ATMChallenge.Core.Interfaces;
using ATMChallenge.Infrastructure.Data;

namespace ATMChallenge.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ATMDbContext _context;
        private IDbContextTransaction? _transaction;
        private bool _disposed = false;

        public UnitOfWork(ATMDbContext context)
        {
            _context = context;
            Cards = new CardRepository(_context);
            Transactions = new TransactionRepository(_context);
        }

        public ICardRepository Cards { get; private set; }
        public ITransactionRepository Transactions { get; private set; }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _transaction?.Dispose();
                    _context.Dispose();
                }
                _disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
