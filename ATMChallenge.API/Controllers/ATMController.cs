using Microsoft.AspNetCore.Mvc;
using ATMChallenge.Core.DTOs;
using ATMChallenge.Core.Interfaces;

namespace ATMChallenge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ATMController : ControllerBase
    {
        private readonly IATMService _atmService;
        private readonly ILogger<ATMController> _logger;

        public ATMController(IATMService atmService, ILogger<ATMController> logger)
        {
            _atmService = atmService;
            _logger = logger;
        }

        /// <summary>
        /// Valida si una tarjeta existe y no está bloqueada
        /// </summary>
        /// <param name="request">Número de tarjeta a validar</param>
        /// <returns>Información de la tarjeta si es válida</returns>
        [HttpPost("validate-card")]
        public async Task<ActionResult<ApiResponse<CardInfoResponse>>> ValidateCard([FromBody] CardValidationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    
                    return BadRequest(ApiResponse<CardInfoResponse>.ErrorResponse("Datos inválidos", errors));
                }

                var result = await _atmService.ValidateCardAsync(request);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating card {CardNumber}", request.CardNumber);
                return StatusCode(500, ApiResponse<CardInfoResponse>.ErrorResponse("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Valida el PIN de una tarjeta
        /// </summary>
        /// <param name="request">Número de tarjeta y PIN</param>
        /// <returns>Información de la tarjeta si el PIN es correcto</returns>
        [HttpPost("validate-pin")]
        public async Task<ActionResult<ApiResponse<CardInfoResponse>>> ValidatePin([FromBody] PinValidationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    
                    return BadRequest(ApiResponse<CardInfoResponse>.ErrorResponse("Datos inválidos", errors));
                }

                var result = await _atmService.ValidatePinAsync(request);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating PIN for card {CardNumber}", request.CardNumber);
                return StatusCode(500, ApiResponse<CardInfoResponse>.ErrorResponse("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Consulta el balance de una tarjeta
        /// </summary>
        /// <param name="cardNumber">Número de tarjeta</param>
        /// <returns>Información del balance de la tarjeta</returns>
        [HttpGet("balance/{cardNumber}")]
        public async Task<ActionResult<ApiResponse<CardInfoResponse>>> GetBalance(string cardNumber)
        {
            try
            {
                if (string.IsNullOrEmpty(cardNumber) || cardNumber.Length != 16)
                {
                    return BadRequest(ApiResponse<CardInfoResponse>.ErrorResponse("Número de tarjeta inválido"));
                }

                var result = await _atmService.GetBalanceAsync(cardNumber);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting balance for card {CardNumber}", cardNumber);
                return StatusCode(500, ApiResponse<CardInfoResponse>.ErrorResponse("Error interno del servidor"));
            }
        }

        /// <summary>
        /// Realiza un retiro de dinero
        /// </summary>
        /// <param name="request">Número de tarjeta y monto a retirar</param>
        /// <returns>Información de la transacción realizada</returns>
        [HttpPost("withdraw")]
        public async Task<ActionResult<ApiResponse<TransactionResponse>>> Withdraw([FromBody] WithdrawalRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    
                    return BadRequest(ApiResponse<TransactionResponse>.ErrorResponse("Datos inválidos", errors));
                }

                var result = await _atmService.WithdrawAsync(request);
                
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing withdrawal for card {CardNumber}, amount {Amount}", 
                    request.CardNumber, request.Amount);
                return StatusCode(500, ApiResponse<TransactionResponse>.ErrorResponse("Error interno del servidor"));
            }
        }
    }
}
