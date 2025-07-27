namespace ATMChallenge.Core.DTOs
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new List<string>();

        public static ApiResponse<T> SuccessResponse(T data, string message = "")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<string>()
            };
        }
    }

    public class CardInfoResponse
    {
        public string CardNumber { get; set; } = string.Empty;
        public string MaskedCardNumber { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool IsBlocked { get; set; }
    }

    public class TransactionResponse
    {
        public string CardNumber { get; set; } = string.Empty;
        public string MaskedCardNumber { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal BalanceAfter { get; set; }
        public DateTime TransactionDate { get; set; }
        public string TransactionType { get; set; } = string.Empty;
    }
}
