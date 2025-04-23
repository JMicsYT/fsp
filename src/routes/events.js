const express = require('express');
const router = express.Router();
const eventController = require('../controllers/events');
const authMiddleware = require('../middleware/auth');

router.get('/', eventController.getAllEvents); //  Публичный маршрут (пока)
router.get('/:id', eventController.getEventById); //  Публичный маршрут (пока)

//  Защищенные маршруты (нужна аутентификация и авторизация)
router.post('/', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin', 'organizer']), eventController.createEvent);  //  Только admin или organizer могут создавать события
router.put('/:id', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin', 'organizer']), eventController.updateEvent);  //  Только admin или organizer могут обновлять события
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.authorizeRole(['admin']), eventController.deleteEvent);  //  Только admin может удалять события

module.exports = router;