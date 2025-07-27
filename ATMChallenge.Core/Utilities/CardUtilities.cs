namespace ATMChallenge.Core.Utilities
{
    public static class CardUtilities
    {
        public static string MaskCardNumber(string cardNumber)
        {
            if (string.IsNullOrEmpty(cardNumber) || cardNumber.Length != 16)
                return cardNumber;

            return $"{cardNumber.Substring(0, 4)}-****-****-{cardNumber.Substring(12, 4)}";
        }

        public static string FormatCardNumber(string cardNumber)
        {
            if (string.IsNullOrEmpty(cardNumber) || cardNumber.Length != 16)
                return cardNumber;

            return $"{cardNumber.Substring(0, 4)}-{cardNumber.Substring(4, 4)}-{cardNumber.Substring(8, 4)}-{cardNumber.Substring(12, 4)}";
        }

        public static bool IsValidCardNumber(string cardNumber)
        {
            if (string.IsNullOrEmpty(cardNumber))
                return false;

            // Remove any non-digit characters
            cardNumber = new string(cardNumber.Where(char.IsDigit).ToArray());

            // Check if it's exactly 16 digits
            if (cardNumber.Length != 16)
                return false;

            // Luhn algorithm validation
            return IsValidLuhn(cardNumber);
        }

        private static bool IsValidLuhn(string cardNumber)
        {
            int sum = 0;
            bool alternate = false;

            for (int i = cardNumber.Length - 1; i >= 0; i--)
            {
                int digit = int.Parse(cardNumber[i].ToString());

                if (alternate)
                {
                    digit *= 2;
                    if (digit > 9)
                        digit = (digit % 10) + 1;
                }

                sum += digit;
                alternate = !alternate;
            }

            return (sum % 10) == 0;
        }
    }
}
