const User = require('../models/user');
const { validateUser } = require('../utils/validation');

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.getAll();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUserById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);  //  <--  ПРОВЕРЬТЕ ЭТУ СТРОКУ
            const user = await User.getById(id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createUser: async (req, res) => {
        try {
            const { error } = validateUser(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { error } = validateUser(req.body); //  Валидация при обновлении
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const updatedUser = await User.update(id, req.body);
            if (updatedUser) {
                res.json(updatedUser);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await User.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUserAchievements: async (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            //  TODO: Проверка, существует ли пользователь с таким ID

            //  Логика получения достижений пользователя из базы данных
            const achievements = await Achievement.findAll({ where: { user_id: userId } }); //  Используйте вашу модель Achievement

            res.json(achievements);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUserApplications: async (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            //  TODO: Проверка, существует ли пользователь с таким ID

            const applications = await Application.findAll({
                where: { user_id: userId },
                include: [Event, Team] //  Пример: Подгрузка данных о событии и команде
            }); //  Используйте вашу модель Application

            res.json(applications);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUserAchievements: async (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            const achievements = await Achievement.findAll({
                where: { user_id: userId },
                include: [Event]  //  Пример: Подгрузка данных о событии
            });

            res.json(achievements);

        } catch (error) {
            //  ...
        }
    },
};

module.exports = userController;