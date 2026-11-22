const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/bookings.json');

const N = 1;
const SURCHARGE_RATE = N * 2;

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
  let records = readData();
  if (filters.console) {
    records = records.filter((item) =>
      item.console.toLowerCase().includes(filters.console.toLowerCase())
    );
  }
  return records;
};

const getById = (id) => {
  const records = readData();
  return records.find((item) => item.id === Number(id));
};

const create = (payload) => {
  const records = readData();
  const basePrice = Number(payload.basePrice);
  const isPriority = Boolean(payload.isPriority);

  let surchargeRate = 0;
  let totalPrice = basePrice;

  if (isPriority) {
    surchargeRate = SURCHARGE_RATE;
    totalPrice = basePrice + (basePrice * (SURCHARGE_RATE / 100));
  }

  const nextId = records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1;

  const newRecord = {
    id: nextId,
    customer: payload.customer.trim(),
    console: payload.console.trim(),
    game: payload.game ? payload.game.trim() : 'Free Choice',
    date: payload.date || new Date().toISOString().split('T')[0],
    time: payload.time || '12:00',
    hours: Number(payload.hours) || 1,
    basePrice,
    isPriority,
    surchargeRate,
    totalPrice: Number(totalPrice.toFixed(2))
  };

  records.push(newRecord);
  writeData(records);

  return newRecord;
};

const update = (id, payload) => {
  const records = readData();
  const recordIndex = records.findIndex((item) => item.id === Number(id));

  if (recordIndex === -1) {
    return null;
  }

  const existingRecord = records[recordIndex];
  const basePrice = payload.basePrice !== undefined ? Number(payload.basePrice) : existingRecord.basePrice;
  const isPriority = payload.isPriority !== undefined ? Boolean(payload.isPriority) : existingRecord.isPriority;

  let surchargeRate = 0;
  let totalPrice = basePrice;

  if (isPriority) {
    surchargeRate = SURCHARGE_RATE;
    totalPrice = basePrice + (basePrice * (SURCHARGE_RATE / 100));
  }

  const updatedRecord = {
    ...existingRecord,
    customer: payload.customer ? payload.customer.trim() : existingRecord.customer,
    console: payload.console ? payload.console.trim() : existingRecord.console,
    game: payload.game ? payload.game.trim() : existingRecord.game,
    date: payload.date || existingRecord.date,
    time: payload.time || existingRecord.time,
    hours: payload.hours !== undefined ? Number(payload.hours) : existingRecord.hours,
    basePrice,
    isPriority,
    surchargeRate,
    totalPrice: Number(totalPrice.toFixed(2))
  };

  records[recordIndex] = updatedRecord;
  writeData(records);

  return updatedRecord;
};

const remove = (id) => {
  const records = readData();
  const recordIndex = records.findIndex((item) => item.id === Number(id));

  if (recordIndex === -1) {
    return false;
  }

  records.splice(recordIndex, 1);
  writeData(records);
  return true;
};

const getStats = () => {
  const records = readData();
  const totalBookings = records.length;
  const priorityBookings = records.filter((item) => item.isPriority).length;
  const standardBookings = totalBookings - priorityBookings;
  const totalRevenue = records.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    teamParameterN: N,
    surchargePercentage: SURCHARGE_RATE,
    totalBookings,
    priorityBookings,
    standardBookings,
    totalRevenue: Number(totalRevenue.toFixed(2))
  };
};

module.exports = {
  N,
  SURCHARGE_RATE,
  getAll,
  getById,
  create,
  update,
  remove,
  getStats
};
