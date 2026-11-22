const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/games.json');

const readData = () => {
  try {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
};

const getAll = (filters = {}) => {
  let games = readData();

  if (filters.platform) {
    games = games.filter((game) =>
      game.platform.toLowerCase().includes(filters.platform.toLowerCase())
    );
  }

  if (filters.genre) {
    games = games.filter((game) =>
      game.genre.toLowerCase().includes(filters.genre.toLowerCase())
    );
  }

  if (filters.available !== undefined) {
    const isAvailable = filters.available === 'true';
    games = games.filter((game) => game.available === isAvailable);
  }

  return games;
};

const getById = (id) => {
  const games = readData();
  return games.find((game) => game.id === Number(id));
};

const create = (payload) => {
  const games = readData();
  const nextId = games.length > 0 ? Math.max(...games.map((g) => g.id)) + 1 : 1;

  const newGame = {
    id: nextId,
    title: payload.title.trim(),
    genre: payload.genre ? payload.genre.trim() : 'General',
    platform: payload.platform.trim(),
    maxPlayers: Number(payload.maxPlayers) || 1,
    available: payload.available !== undefined ? Boolean(payload.available) : true
  };

  games.push(newGame);
  writeData(games);

  return newGame;
};

const update = (id, payload) => {
  const games = readData();
  const gameIndex = games.findIndex((game) => game.id === Number(id));

  if (gameIndex === -1) {
    return null;
  }

  const existingGame = games[gameIndex];
  const updatedGame = {
    ...existingGame,
    title: payload.title ? payload.title.trim() : existingGame.title,
    genre: payload.genre ? payload.genre.trim() : existingGame.genre,
    platform: payload.platform ? payload.platform.trim() : existingGame.platform,
    maxPlayers: payload.maxPlayers !== undefined ? Number(payload.maxPlayers) : existingGame.maxPlayers,
    available: payload.available !== undefined ? Boolean(payload.available) : existingGame.available
  };

  games[gameIndex] = updatedGame;
  writeData(games);

  return updatedGame;
};

const remove = (id) => {
  const games = readData();
  const gameIndex = games.findIndex((game) => game.id === Number(id));

  if (gameIndex === -1) {
    return false;
  }

  games.splice(gameIndex, 1);
  writeData(games);
  return true;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
