const pool = require('../config/database');

const generateEventPrefix = async (eventName) => {
  // Limpiar el nombre: quitar acentos, mantener solo letras y espacios
  const clean = eventName
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z\s]/g, '')
    .trim();

  const words = clean.split(/\s+/).filter(Boolean);

  let basePrefix;
  if (words.length >= 2) {
    basePrefix = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    basePrefix = words[0].slice(0, 2).toUpperCase();
  } else {
    basePrefix = 'EV'; // fallback si el nombre no tiene letras válidas
  }

  // Verificar colisión con otros eventos
  let finalPrefix = basePrefix;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [rows] = await pool.execute(
      `SELECT id FROM events WHERE prefix = ?`,
      [finalPrefix]
    );
    if (rows.length === 0) break;
    suffix += 1;
    finalPrefix = `${basePrefix}${suffix}`;
  }

  return finalPrefix;
};

const padNumber = (num, length = 6) => String(num).padStart(length, '0');

module.exports = { generateEventPrefix, padNumber };