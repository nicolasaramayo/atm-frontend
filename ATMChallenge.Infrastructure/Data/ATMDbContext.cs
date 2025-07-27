using Microsoft.EntityFrameworkCore;
using ATMChallenge.Core.Entities;

namespace ATMChallenge.Infrastructure.Data
{
    public class ATMDbContext : DbContext
    {
        public ATMDbContext(DbContextOptions<ATMDbContext> options) : base(options)
        {
        }

        public DbSet<Card> Cards { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Card configuration
            modelBuilder.Entity<Card>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CardNumber)
                    .IsRequired()
                    .HasMaxLength(16)
                    .IsFixedLength();
                
                entity.Property(e => e.Pin)
                    .IsRequired()
                    .HasMaxLength(4)
                    .IsFixedLength();
                
                entity.Property(e => e.Balance)
                    .IsRequired()
                    .HasColumnType("decimal(18,2)");
                
                entity.Property(e => e.ExpirationDate)
                    .IsRequired();
                
                entity.Property(e => e.IsBlocked)
                    .IsRequired()
                    .HasDefaultValue(false);
                
                entity.Property(e => e.FailedAttempts)
                    .IsRequired()
                    .HasDefaultValue(0);
                
                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");
                
                entity.HasIndex(e => e.CardNumber)
                    .IsUnique();
            });

            // Transaction configuration
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.CardId)
                    .IsRequired();
                
                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasConversion<int>();
                
                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18,2)");
                
                entity.Property(e => e.BalanceAfterTransaction)
                    .HasColumnType("decimal(18,2)");
                
                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");
                
                entity.HasOne(e => e.Card)
                    .WithMany(e => e.Transactions)
                    .HasForeignKey(e => e.CardId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Cards
            modelBuilder.Entity<Card>().HasData(
                new Card
                {
                    Id = 1,
                    CardNumber = "4532015112830366",
                    Pin = "1234",
                    Balance = 1000.00m,
                    ExpirationDate = new DateTime(2026, 12, 31),
                    IsBlocked = false,
                    FailedAttempts = 0,
                    CreatedAt = DateTime.UtcNow
                },
                new Card
                {
                    Id = 2,
                    CardNumber = "5555555555554444",
                    Pin = "5678",
                    Balance = 2500.50m,
                    ExpirationDate = new DateTime(2027, 6, 30),
                    IsBlocked = false,
                    FailedAttempts = 0,
                    CreatedAt = DateTime.UtcNow
                },
                new Card
                {
                    Id = 3,
                    CardNumber = "4111111111111111",
                    Pin = "9999",
                    Balance = 500.75m,
                    ExpirationDate = new DateTime(2025, 3, 31),
                    IsBlocked = true,
                    FailedAttempts = 4,
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
