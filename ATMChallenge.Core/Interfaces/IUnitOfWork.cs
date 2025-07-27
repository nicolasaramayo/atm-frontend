namespace ATMChallenge.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        ICardRepository Cards { get; }
        ITransactionRepository Transactions { get; }
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
