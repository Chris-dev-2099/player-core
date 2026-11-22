const bookingService = require('../services/booking.service');

const getAllBookings = (req, res) => {
  const { console: consoleFilter } = req.query;
  const bookings = bookingService.getAll({ console: consoleFilter });
  return res.status(200).json(bookings);
};

const getBookingStats = (req, res) => {
  const stats = bookingService.getStats();
  return res.status(200).json(stats);
};

const getBookingById = (req, res) => {
  const { id } = req.params;
  const booking = bookingService.getById(id);

  if (!booking) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No se encontró la reserva con el ID ${id}`
    });
  }

  return res.status(200).json(booking);
};

const createBooking = (req, res) => {
  const {
    customer,
    console: gamingConsole,
    basePrice,
    hours
  } = req.body;

  if (!customer || typeof customer !== 'string' || customer.trim() === '') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "customer" es obligatorio y no puede estar vacío'
    });
  }

  if (!gamingConsole || typeof gamingConsole !== 'string' || gamingConsole.trim() === '') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "console" es obligatorio y no puede estar vacío'
    });
  }

  if (basePrice === undefined || basePrice === null || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "basePrice" es obligatorio y debe ser un número mayor a 0'
    });
  }

  if (hours !== undefined && (isNaN(Number(hours)) || Number(hours) <= 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "hours" debe ser un número mayor a 0'
    });
  }

  const newBooking = bookingService.create(req.body);
  return res.status(201).json(newBooking);
};

const updateBooking = (req, res) => {
  const { id } = req.params;
  const { basePrice, hours } = req.body;

  if (basePrice !== undefined && (isNaN(Number(basePrice)) || Number(basePrice) <= 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "basePrice" debe ser un número mayor a 0'
    });
  }

  if (hours !== undefined && (isNaN(Number(hours)) || Number(hours) <= 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "hours" debe ser un número mayor a 0'
    });
  }

  const updatedBooking = bookingService.update(id, req.body);
  if (!updatedBooking) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No se encontró la reserva con el ID ${id} para actualizar`
    });
  }

  return res.status(200).json(updatedBooking);
};

const deleteBooking = (req, res) => {
  const { id } = req.params;
  const isDeleted = bookingService.remove(id);

  if (!isDeleted) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No se encontró la reserva con el ID ${id} para eliminar`
    });
  }

  return res.status(200).json({
    message: `Reserva con ID ${id} eliminada exitosamente`
  });
};

module.exports = {
  getAllBookings,
  getBookingStats,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
};
