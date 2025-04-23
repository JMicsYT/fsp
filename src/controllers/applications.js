const Application = require('../models/application');
const { validateApplication } = require('../utils/validation'); //  Предполагаем, что такая валидация будет

const applicationController = {
    getAllApplications: async (req, res) => {
        try {
            const applications = await Application.getAll();
            res.json(applications);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getApplicationById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const application = await Application.getById(id);
            if (application) {
                res.json(application);
            } else {
                res.status(404).json({ message: 'Application not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createApplication: async (req, res) => {
        try {
            const { error } = validateApplication(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const newApplication = await Application.create(req.body);
            res.status(201).json(newApplication);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateApplication: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { error } = validateApplication(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const updatedApplication = await Application.update(id, req.body);
            if (updatedApplication) {
                res.json(updatedApplication);
            } else {
                res.status(404).json({ message: 'Application not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteApplication: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await Application.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = applicationController;