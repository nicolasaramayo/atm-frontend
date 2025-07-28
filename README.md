# Challenge - Origin Solutions

## Descripción
sistema ATM (cajero automático) completo con backend en ASP.NET Core y frontend en React

## Arquitectura

El proyecto sigue una arquitectura de capas limpia (Clean Architecture) con los componentes:

### Backend (.NET 9)
- **ATMChallenge.API**: Capa de presentación (Web API)
- **ATMChallenge.Core**: Capa de dominio (entidades, interfaces, DTOs)
- **ATMChallenge.Infrastructure**: Capa de infraestructura (repositorios, servicios, acceso a datos)

### Frontend (React + TypeScript)
- **atm-frontend**: Aplicación React con TypeScript



### Tecnologías 

#### Backend
- ASP.NET Core 9.0
- Entity Framework Core
- SQL Server LocalDB
- Swagger/OpenAPI
- Patrón Repository
- Unit of Work
- Inyección de dependencias

#### Frontend
- React 18
- TypeScript
- CSS Modules
- Axios para HTTP requests




### Datos de Prueba


| Número de Tarjeta   | PIN  | Balance  | Estado    |
|---------------------|------|----------|-----------|
| 4532015112830366    | 1234 | $1,000.00| Activa    |
| 5555555555554444    | 5678 | $2,500.50| Activa    |
| 4111111111111111    | 9999 | $500.75  | Bloqueada |

## Instalación y Configuración

### Prerrequisitos
- .NET 9 SDK
- Node.js 18+
- SQL Server LocalDB

### Backend

1. Clona el repositorio
```bash
git clone <repository-url>
cd Challenge-Origin
```

2. Restaurar paquetes NuGet
```bash
dotnet restore
```

3. Compilar la solución
```bash
dotnet build
```

4. Ejecutar la API
```bash
cd ATMChallenge.API
dotnet run
```

API URL:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001`

### Frontend

1. Navegar al directorio del frontend
```bash
cd atm-frontend
```

2. Instalar dependencias
```bash
npm install
```

3. Ejecutar la aplicación
```bash
npm start
```

La aplicación estara en `http://localhost:3000`

## API Endpoints

### ATM Controller

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/atm/validate-card` | Valida si una tarjeta existe y no está bloqueada |
| POST | `/api/atm/validate-pin` | Valida el PIN de una tarjeta |
| GET | `/api/atm/balance/{cardNumber}` | Consulta el balance de una tarjeta |
| POST | `/api/atm/withdraw` | Realiza un retiro de dinero |

### Ejemplos de Request/Response

#### Validar Tarjeta
```json
POST /api/atm/validate-card
{
  "cardNumber": "4532015112830366"
}

Response:
{
  "success": true,
  "message": "Tarjeta válida",
  "data": {
    "cardNumber": "4532015112830366",
    "maskedCardNumber": "4532-****-****-0366",
    "balance": 1000.00,
    "expirationDate": "2026-12-31T00:00:00",
    "isBlocked": false
  }
}
```

#### Validar PIN
```json
POST /api/atm/validate-pin
{
  "cardNumber": "4532015112830366",
  "pin": "1234"
}
```

#### Retiro
```json
POST /api/atm/withdraw
{
  "cardNumber": "4532015112830366",
  "amount": 100.00
}
```

## Patrones de Diseño Implementados

### Repository Pattern
- Abstrae el acceso a datos
- Facilita testing y mantenimiento
- Implementación genérica y específica

### Unit of Work Pattern
- Maneja transacciones de base de datos
- Garantiza consistencia de datos
- Rollback automático en caso de error

### Dependency Injection
- Inversión de control
- Facilita testing
- Bajo acoplamiento

### Clean Architecture
- Separación de responsabilidades
- Independencia de frameworks
- Testabilidad

## Seguridad

- Validación de entrada en todos los endpoints
- Manejo seguro de errores
- Logging de operaciones
- Validación del algoritmo de Luhn para números de tarjeta
- Límite de intentos de PIN

## Testing

Para ejecutar las pruebas:

```bash
dotnet test
```



