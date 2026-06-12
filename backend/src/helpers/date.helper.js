const toMysqlDatetime = (date = new Date()) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isExpired = (date) => new Date(date) < new Date();

module.exports = { toMysqlDatetime, addDays, isExpired };