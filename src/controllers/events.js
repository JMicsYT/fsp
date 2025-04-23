const Event = require('../models/event');
const { validateEvent } = require('../utils/validation');

const eventController = {
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.getAll();
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
};

module.exports = eventController;