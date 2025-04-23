const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authMiddleware = require('../middleware/auth');

//  Определите, какие маршруты требуют аутентификации и авторизации

router.get('/', authMiddleware.verifyToken, userController.getAllUsers);
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);
router.post('/', userController.createUser); //  Обычно создание пользователя не требует авторизации
router.put('/:id', authMiddleware.verifyToken, userController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), userController.deleteUser); //  Пример: только админ может удалять пользователей

//  Новые маршруты для личного кабинета и достижений
router.get('/:id/applications', authMiddleware.verifyToken, userController.getUserApplications);
router.get('/:id/teams', authMiddleware.verifyToken, userController.getUserTeams);
router.get('/:id/events', authMiddleware.verifyToken, userController.getUserEvents);
router.get('/:id/achievements', authMiddleware.verifyToken, userController.getUserAchievements);

module.exports = router;