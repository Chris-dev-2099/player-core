const express = require('express');
const bookingRoutes = require('./src/routes/booking.routes');
const gameRoutes = require('./src/routes/game.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/bookings', bookingRoutes);
app.use('/api/games', gameRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido a la API REST de Player Core - Alquiler de Consolas',
    version: '1.0.0',
    endpoints: {
      turnos: '/api/turnos',
      estadisticasTurnos: '/api/turnos/stats',
      juegos: '/api/juegos'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `La ruta ${req.originalUrl} no fue encontrada en este servidor`
  });
});

app.listen(PORT, () => {
  console.log(`Servidor Player Core corriendo exitosamente en http://localhost:${PORT}`);
});
