using System.ComponentModel.DataAnnotations;

namespace ATMChallenge.Core.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        
        [Required]
        public int CardId { get; set; }
        
        [Required]
        public TransactionType Type { get; set; }
        
        public decimal? Amount { get; set; }
        
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public decimal? BalanceAfterTransaction { get; set; }
        
        // Navigation property
        public virtual Card Card { get; set; } = null!;
    }
    
    public enum TransactionType
    {
        Balance = 1,
        Withdrawal = 2
    }
}
