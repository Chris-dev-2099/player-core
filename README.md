# Player Core API - Sistema de Alquiler de Consolas y Videojuegos

API REST desarrollada con **Node.js** y **Express** bajo una arquitectura limpia por capas (`routes`, `controllers`, `services`), con almacenamiento local en formato JSON y reglas de negocio parametrizadas para la gestión de turnos/reservas y catálogo de videojuegos.

---

## 1. Integrantes del Equipo

> *Ordenados alfabéticamente por apellido según el listado oficial de la asignatura*
 
 1. **Arboleda Acosta Christopher Alejandro**
 12.  **Moriano Mairongo Andres Felipe**
 23.  **Trejos Carvajal Hector Leonardo**

---

## 2. Regla de Negocio Parametrizada ($N$)

* **Obtención de $N$:** El primer integrante del equipo en orden alfabético es **Arboleda Acosta Christopher Alejandro**, quien ocupa el puesto **#1** en la lista oficial.
  $$\mathbf{N = 1}$$

* **Cálculo del Porcentaje de Recargo:**
  $$\text{porcentajeRecargo} = N \times 2\% = 1 \times 2\% = \mathbf{2\%}$$

* **Aplicación de la Tarifa en `services/`:**
  * Si la reserva es **prioritaria** (`"isPriority": true`):
    $$\text{totalPrice} = \text{basePrice} + \left(\text{basePrice} \times \frac{2}{100}\right)$$
    *Ejemplo: Para un `basePrice` de \$20,000 COP, el recargo es del 2% (\$400 COP), resultando en un `totalPrice` de \$20,400 COP.*
  * Si no es prioritaria (`"isPriority": false` o no especificado):
    $$\text{totalPrice} = \text{basePrice}$$

---

## 3. Descripción del Negocio Elegido

**Player Core** es una sala y centro interactivo de entretenimiento gamer enfocado en el alquiler de estaciones de videojuegos de última generación (PlayStation 5, Xbox Series X, Nintendo Switch y Nintendo Switch 2). 

Los clientes pueden apartar turnos de juego por horas para disfrutar de títulos individuales o multijugador. Cada turno o solicitud de servicio gestiona los siguientes campos (estandarizados en inglés):
* **`customer`**: Nombre completo del cliente que realiza la reserva (obligatorio).
* **`console`**: Estación de juego solicitada (PlayStation 5, Xbox Series X, Nintendo Switch, Nintendo Switch 2) (obligatorio).
* **`game`**: Título del videojuego inicial deseado (opcional, por defecto "Free Choice").
* **`date`**: Fecha de la reserva (formato YYYY-MM-DD).
* **`time`**: Hora de inicio de la sesión.
* **`hours`**: Cantidad de horas reservadas (número entero $> 0$).
* **`basePrice`**: Tarifa base del alquiler en pesos colombianos (obligatorio, número $> 0$).
* **`isPriority`**: Booleano (`true` / `false`) que indica si el cliente solicita atención prioritaria / Sala VIP con reserva garantizada en hora pico.

---

## 4. Arquitectura del Proyecto (Separación de Capas)

El proyecto sigue una arquitectura estricta de separación de responsabilidades:

```text
player-core/
├── src/
│   ├── controllers/         # Valida datos de entrada (req), asigna códigos HTTP y respuestas (res)
│   │   ├── booking.controller.js
│   │   └── game.controller.js
│   ├── data/                # Persistencia local de datos en formato JSON
│   │   ├── bookings.json
│   │   └── games.json
│   ├── routes/              # Define los endpoints y los vincula a sus controladores
│   │   ├── booking.routes.js
│   │   └── game.routes.js
│   └── services/            # Contiene la lógica de negocio, cálculos de N y persistencia
│       ├── booking.service.js
│       └── game.service.js
├── index.js                 # Punto de entrada: inicializa Express, middlewares y servidor
├── package.json             # Dependencias y scripts de Node.js
├── .gitignore               # Excluye node_modules/ del control de versiones
└── README.md                # Documentación del proyecto
```

---

## 5. Endpoints de la API

### Módulo de Turnos / Reservas (`/api/turnos` o `/api/bookings`)

| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/turnos` | Lista todos los turnos registrados (filtro opcional: `?console=PS5`) | `200 OK` |
| `GET` | `/api/turnos/stats` | Estadísticas del negocio (total turnos, prioritarios, recaudación, $N$) | `200 OK` |
| `GET` | `/api/turnos/:id` | Obtiene un turno específico por su ID | `200 OK`, `404 Not Found` |
| `POST` | `/api/turnos` | Registra una reserva aplicando el cálculo del recargo por $N$ | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/turnos/:id` | Modifica una reserva y recalcula tarifas | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/turnos/:id` | Cancela/elimina una reserva existente | `200 OK`, `404 Not Found` |

### Módulo de Catálogo de Videojuegos (`/api/juegos` o `/api/games`)

| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/juegos` | Lista catálogo (filtros: `?platform=Nintendo Switch 2&available=true`) | `200 OK` |
| `GET` | `/api/juegos/:id` | Obtiene un juego por su ID | `200 OK`, `404 Not Found` |
| `POST` | `/api/juegos` | Agrega un nuevo juego al catálogo | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/juegos/:id` | Modifica información de un juego | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/juegos/:id` | Elimina un juego del catálogo | `200 OK`, `404 Not Found` |

---

## 6. Ejemplos de Pruebas (Payloads JSON)

### Caso 1: Creación Exitosa con Recargo Prioritario (Código `201 Created`)
* **Endpoint:** `POST /api/turnos`
* **Body (Request):**
```json
{
  "customer": "Santiago Ceballos",
  "console": "PlayStation 5",
  "game": "Marvel's Spider-Man 2",
  "date": "2026-11-25",
  "time": "15:00",
  "hours": 2,
  "basePrice": 30000,
  "isPriority": true
}
```
* **Respuesta Esperada (`201 Created`):**
```json
{
  "id": 3,
  "customer": "Santiago Ceballos",
  "console": "PlayStation 5",
  "game": "Marvel's Spider-Man 2",
  "date": "2026-11-25",
  "time": "15:00",
  "hours": 2,
  "basePrice": 30000,
  "isPriority": true,
  "surchargeRate": 2,
  "totalPrice": 30600
}
```
*(Se observa el cálculo automático: \$30,000 + 2% = \$30,600)*.

---

### Caso 2: Error por Campos Obligatorios Faltantes (Código `400 Bad Request`)
* **Endpoint:** `POST /api/turnos`
* **Body (Request):**
```json
{
  "console": "Nintendo Switch 2",
  "basePrice": 25000
}
```
* **Respuesta Esperada (`400 Bad Request`):**
```json
{
  "error": "Bad Request",
  "message": "El campo \"customer\" es obligatorio y no puede estar vacío"
}
```

---

### Caso 3: Error por Valor Numérico Inválido (Código `400 Bad Request`)
* **Endpoint:** `POST /api/turnos`
* **Body (Request):**
```json
{
  "customer": "Emily Hurtado",
  "console": "Xbox Series X",
  "basePrice": -5000
}
```
* **Respuesta Esperada (`400 Bad Request`):**
```json
{
  "error": "Bad Request",
  "message": "El campo \"basePrice\" es obligatorio y debe ser un número mayor a 0"
}
```

---

### Caso 4: Consulta de Identificador Inexistente (Código `404 Not Found`)
* **Endpoint:** `GET /api/turnos/999`
* **Respuesta Esperada (`404 Not Found`):**
```json
{
  "error": "Not Found",
  "message": "No se encontró la reserva con el ID 999"
}
```

---

## 7. Instalación y Ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Chris-dev-2099/player-core.git
   cd player-core
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor en modo desarrollo (con recarga automática):
   ```bash
   npm start
   ```

4. Probar en el navegador o cliente REST (Postman / Thunder Client / cURL):
   * `http://localhost:3000/`
   * `http://localhost:3000/api/turnos`
   * `http://localhost:3000/api/turnos/stats`
   * `http://localhost:3000/api/juegos`
