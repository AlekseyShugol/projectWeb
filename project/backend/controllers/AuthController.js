const { User } = require('../models');
const jwt = require('jsonwebtoken');

const authController = {
    login: async (req, res) => {
        const { login, password, email} = req.body;

        let user;
        if (login) {
            user = await User.findOne({ where: { login } });
        } else if (email) {
            user = await User.findOne({ where: { email } });
        }

        if (!user || !(await user.checkPassword(password))) {
            console.log(user ? user.password : 'User not found');
            console.log(password);
            return res.status(401).json({ message: 'Incorrect login or password: access denied.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role_id }, 'secret', { expiresIn: '1h' });

        res.json({ message: 'Успешный вход', token });
    },
};

module.exports = authController;