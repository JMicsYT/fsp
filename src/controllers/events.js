const Event = require('../models/event');
const { validateEvent } = require('../utils/validation');

const eventController = {
    getAllEvents: async (req, res) => {
        try {
            const { region, startDate, endDate, format } = req.query;
            const whereClause = {};

            if (region) {
                whereClause.region = region;
            }
            if (startDate) {
                whereClause.start_date = { [Op.gte]: new Date(startDate) }; //  Op.gte (>=) - оператор Sequelize (или аналог вашей ORM)
            }
            if (endDate) {
                whereClause.end_date = { [Op.lte]: new Date(endDate) }; //  Op.lte (<=)
            }
            if (format) {
                whereClause.format = format;
            }

            const events = await Event.findAll({ where: whereClause }); //  Используйте вашу модель Event

            res.json(events);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


    getEventById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const event = await Event.getById(id);
            if (event) {
                res.json(event);
            } else {
                res.status(404).json({ message: 'Event not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createEvent: async (req, res) => {
        try {
            const { error } = validateEvent(req.body); // Валидация
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const newEvent = await Event.create(req.body);
            res.status(201).json(newEvent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { error } = validateEvent(req.body); // Валидация
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const updatedEvent = await Event.update(id, req.body);
            if (updatedEvent) {
                res.json(updatedEvent);
            } else {
                res.status(404).json({ message: 'Event not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await Event.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createEventResults: async (req, res) => {
        try {
            const eventId = parseInt(req.params.id);
            const results = req.body; //  Массив объектов с результатами

            //  Валидация данных
            if (!Array.isArray(results) || results.length === 0) {
                return res.status(400).json({ error: 'Results must be an array and not empty' });
            }

            for (const result of results) {
                if (!result.user_id || !result.place) { //  Минимальная валидация
                    return res.status(400).json({ error: 'Each result must have user_id and place' });
                }
                //  TODO: Более строгая валидация (проверка типов, существование user_id, team_id и т.д.)
            }

            //  Проверка, что пользователь имеет права на добавление результатов (organizer, admin)
            //  Предполагается, что authMiddleware.authorizeRole уже это сделал

            //  Логика сохранения результатов в базу данных
            try {
                for (const result of results) {
                    await Result.create({ event_id: eventId, ...result }); //  Используйте вашу модель Result
                    //  TODO: Обновление достижений пользователей (после сохранения результатов)
                    //  Это может быть вызов другой функции, отправка сообщения в очередь и т.д.
                }
            } catch (dbError) {
                console.error('Database error:', dbError);
                return res.status(500).json({ error: 'Error saving results to database' });
            }

            for (const result of results) {
                await Result.create({ event_id: eventId, ...result });
            
                //  Вычисление достижения
                let achievementType = "Участник"; //  По умолчанию
                if (result.place === 1) {
                    achievementType = "Победитель";
                } else if (result.place <= 3) {
                    achievementType = "Призер";
                }
            
                //  Создание достижения
                if (achievementType) {
                    await Achievement.create({
                        user_id: result.user_id,
                        event_id: eventId,
                        achievement_type: achievementType,
                        description: `<span class="math-inline">\{achievementType\} в соревновании '</span>{eventName}'`, //  TODO: Получить eventName
                    });
                }
            }

            res.status(201).json({ message: 'Results created successfully' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = eventController;