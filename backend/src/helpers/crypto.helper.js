const bcrypt   = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const env      = require('../config/environment');

const hashPassword = (password) => {
  return bcrypt.hash(password, env.bcryptRounds);
};

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const generateToken = () => uuidv4();

module.exports = { hashPassword, comparePassword, generateToken };