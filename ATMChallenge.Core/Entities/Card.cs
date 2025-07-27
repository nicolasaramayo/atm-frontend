using System.ComponentModel.DataAnnotations;

namespace ATMChallenge.Core.Entities
{
    public class Card
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(16, MinimumLength = 16)]
        public string CardNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(4, MinimumLength = 4)]
        public string Pin { get; set; } = string.Empty;
        
        [Required]
        public decimal Balance { get; set; }
        
        [Required]
        public DateTime ExpirationDate { get; set; }
        
        public bool IsBlocked { get; set; } = false;
        
        public int FailedAttempts { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastAccessAt { get; set; }
        
        // Navigation property
        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
