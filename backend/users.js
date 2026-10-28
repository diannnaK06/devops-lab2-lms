const crypto = require('node:crypto');

const users = [];

function registerUser(username, password, role = 'student') {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  if (!['student', 'teacher', 'admin'].includes(role)) {
    throw new Error('Invalid role');
  }

  if (users.some(user => user.username === username)) {
    throw new Error('User already exists');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');

  const user = {
    username,
    role,
    salt,
    passwordHash
  };

  users.push(user);

  return { username, role };
}

function loginUser(username, password) {
  const user = users.find(user => user.username === username);

  if (!user) return false;

  const hash = crypto.scryptSync(
    password,
    user.salt,
    64
  );

  const storedHash = Buffer.from(user.passwordHash, 'hex');

  return crypto.timingSafeEqual(hash, storedHash);
}

module.exports = { registerUser, loginUser };
