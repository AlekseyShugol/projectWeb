const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secret'; // ключ для декодирования токенов

const getUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Decoded token:', decoded); // Логируем декодированный токен
    return { id: decoded.id, role: decoded.role }; // Измените на decoded.role, если это необходимо
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Middleware для аутентификации
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  try {
    const user = getUserFromToken(token);
    req.userId = user.id; // Сохраняем ID пользователя из токена
    req.role = user.role; // Сохраняем роль пользователя из токена
    next(); // Передаем управление следующему middleware
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

// Middleware для авторизации
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }

    try {
      const user = getUserFromToken(token);
      req.userId = user.id;
      const userRole = String(user.role); // Получаем роль пользователя
      console.log('User role:', userRole); // Логируем роль пользователя

      const allowedRolesAsString = allowedRoles.map(role => String(role));

      if (!allowedRolesAsString.includes(userRole)) {
        return res.status(403).json({ message: "Недостаточно прав" });
      }

      next(); // Роль соответствует разрешенным, передаем управление дальше
    } catch (error) {
      return res.status(403).json({ message: error.message });
    }
  };
};

module.exports = { authenticate, authorize };