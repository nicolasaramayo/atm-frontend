using System.ComponentModel.DataAnnotations;

namespace ATMChallenge.Core.DTOs
{
    public class CardValidationRequest
    {
        [Required]
        [StringLength(16, MinimumLength = 16, ErrorMessage = "El número de tarjeta debe tener exactamente 16 dígitos")]
        [RegularExpression(@"^\d{16}$", ErrorMessage = "El número de tarjeta debe contener solo dígitos")]
        public string CardNumber { get; set; } = string.Empty;
    }
}
