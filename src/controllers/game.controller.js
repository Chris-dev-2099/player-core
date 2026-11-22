const gameService = require('../services/game.service');

const getAllGames = (req, res) => {
  const { platform, genre, available } = req.query;
  const games = gameService.getAll({ platform, genre, available });
  return res.status(200).json(games);
};

const getGameById = (req, res) => {
  const { id } = req.params;
  const game = gameService.getById(id);

  if (!game) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No se encontró el videojuego con el ID ${id}`
    });
  }

  return res.status(200).json(game);
};

const createGame = (req, res) => {
  const { title, platform, maxPlayers } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "title" es obligatorio y no puede estar vacío'
    });
  }

  if (!platform || typeof platform !== 'string' || platform.trim() === '') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "platform" es obligatorio y no puede estar vacío'
    });
  }

  if (maxPlayers !== undefined && (isNaN(Number(maxPlayers)) || Number(maxPlayers) <= 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "maxPlayers" debe ser un número entero mayor a 0'
    });
  }

  const newGame = gameService.create(req.body);
  return res.status(201).json(newGame);
};

const updateGame = (req, res) => {
  const { id } = req.params;
  const { maxPlayers } = req.body;

  if (maxPlayers !== undefined && (isNaN(Number(maxPlayers)) || Number(maxPlayers) <= 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El campo "maxPlayers" debe ser un número entero mayor a 0'
    });
  }

  const updatedGame = gameService.update(id, req.body);
  if (!updatedGame) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No se encontró el videojuego con el ID ${id} para actualizar`
    });
  }

  return res.status(200).json(updatedGame);
};

const deleteGame = (req, res) => {
  const { id } = req.params;
  const isDeleted = gameService.remove(id);

  if (!isDeleted) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No se encontró el videojuego con el ID ${id} para eliminar`
    });
  }

  return res.status(200).json({
    message: `Videojuego con ID ${id} eliminado exitosamente`
  });
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
};
