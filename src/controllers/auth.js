const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecret } = require('../config/auth');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.getByEmail(email); //  Нужно добавить getByEmail в модель User
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role }, //  Payload (данные, которые хранятся в токене)
                jwtSecret, //  Секретный ключ для подписи токена (хранить в переменной окружения!)
                { expiresIn: '1h' } //  Время жизни токена
            );

            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = authController;