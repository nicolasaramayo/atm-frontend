# ATM Frontend - React Application

Este es el frontend de la aplicación ATM (Cajero Automático) desarrollado en React con TypeScript.

## Características

- **Interfaz de usuario moderna y responsiva**
- **Teclado numérico virtual** para entrada de datos
- **Validación de tarjeta y PIN** con manejo de intentos fallidos
- **Operaciones de balance y retiro** con validaciones
- **Reportes de transacciones** detallados
- **Manejo de errores** con páginas informativas
- **Navegación fluida** entre páginas

## Páginas Implementadas

1. **Home** - Ingreso del número de tarjeta (16 dígitos)
2. **PIN Entry** - Ingreso del PIN con validación (máximo 4 intentos)
3. **Operations** - Menú principal con opciones de Balance, Retiro y Salir
4. **Balance** - Consulta del saldo de la cuenta
5. **Withdraw** - Retiro de dinero con validación de saldo
6. **Transaction Report** - Reporte detallado de la transacción realizada
7. **Error** - Página de errores con mensajes informativos

## Tecnologías Utilizadas

- **React 19.1.0** - Framework principal
- **TypeScript 4.9.5** - Tipado estático
- **React Router DOM** - Enrutamiento de la aplicación
- **Axios** - Cliente HTTP para comunicación con la API
- **CSS3** - Estilos modernos con gradientes y animaciones

## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. Navegar al directorio del frontend:
```bash
cd atm-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar la aplicación en modo desarrollo:
```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### Construcción para Producción

```bash
npm run build
```

## Configuración de la API

La aplicación está configurada para conectarse a la API del backend en:
- **URL Base**: `https://localhost:7001/api/atm`
- **Endpoints**:
  - `POST /validate-card` - Validar tarjeta
  - `POST /validate-pin` - Validar PIN
  - `GET /balance/{cardNumber}` - Consultar balance
  - `POST /withdraw` - Realizar retiro

## Estructura del Proyecto

```
src/
├── components/
│   ├── NumericKeypad.tsx      # Teclado numérico reutilizable
│   └── NumericKeypad.css
├── pages/
│   ├── Home.tsx               # Página principal
│   ├── PinEntry.tsx           # Ingreso de PIN
│   ├── Operations.tsx         # Menú de operaciones
│   ├── Balance.tsx            # Consulta de balance
│   ├── Withdraw.tsx           # Retiro de dinero
│   ├── TransactionReport.tsx  # Reporte de transacción
│   ├── Error.tsx              # Página de errores
│   └── *.css                  # Estilos de cada página
├── services/
│   └── atmService.ts          # Servicio para comunicación con API
├── types/
│   └── api.ts                 # Tipos TypeScript para la API
├── App.tsx                    # Componente principal con enrutamiento
├── App.css                    # Estilos globales
└── index.tsx                  # Punto de entrada
```

## Funcionalidades Principales

### Validación de Tarjeta
- Formato automático: `1111-1111-1111-1111`
- Validación de 16 dígitos
- Comunicación con API para verificar existencia y estado

### Validación de PIN
- Máximo 4 intentos fallidos
- Bloqueo automático de tarjeta después del 4to intento
- Validación en tiempo real

### Operaciones
- **Balance**: Consulta del saldo actual
- **Retiro**: Validación de saldo disponible
- **Salir**: Finalización de sesión

### Seguridad
- Almacenamiento temporal en sessionStorage
- Limpieza automática de datos sensibles
- Validaciones del lado del cliente y servidor

## Diseño y UX

- **Interfaz intuitiva** con navegación clara
- **Teclado numérico virtual** para entrada segura
- **Animaciones suaves** para mejor experiencia de usuario
- **Diseño responsivo** para diferentes tamaños de pantalla
- **Mensajes informativos** para guiar al usuario
- **Colores consistentes** con significado semántico

## Compatibilidad

- **Navegadores modernos**: Chrome, Firefox, Safari, Edge
- **Dispositivos móviles**: Responsive design
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

## Desarrollo

### Scripts Disponibles

- `npm start` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm test` - Ejecutar pruebas
- `npm run eject` - Eyectar configuración (irreversible)

### Estructura de Datos

La aplicación utiliza sessionStorage para mantener el estado de la sesión:
- `cardInfo` - Información de la tarjeta validada
- `transactionInfo` - Información de la transacción realizada

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
