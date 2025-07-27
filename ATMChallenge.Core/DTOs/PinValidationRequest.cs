using System.ComponentModel.DataAnnotations;

namespace ATMChallenge.Core.DTOs
{
    public class PinValidationRequest
    {
        [Required]
        [StringLength(16, MinimumLength = 16, ErrorMessage = "El número de tarjeta debe tener exactamente 16 dígitos")]
        [RegularExpression(@"^\d{16}$", ErrorMessage = "El número de tarjeta debe contener solo dígitos")]
        public string CardNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(4, MinimumLength = 4, ErrorMessage = "El PIN debe tener exactamente 4 dígitos")]
        [RegularExpression(@"^\d{4}$", ErrorMessage = "El PIN debe contener solo dígitos")]
        public string Pin { get; set; } = string.Empty;
    }
}
