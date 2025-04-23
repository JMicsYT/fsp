const Team = require('../models/team');
const { validateTeam } = require('../utils/validation'); //  Предполагаем, что такая валидация будет

const teamController = {
    getAllTeams: async (req, res) => {
        try {
            const teams = await Team.getAll();
            res.json(teams);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getTeamById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const team = await Team.getById(id);
            if (team) {
                res.json(team);
            } else {
                res.status(404).json({ message: 'Team not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createTeam: async (req, res) => {
        try {
            const { error } = validateTeam(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const newTeam = await Team.create(req.body);
            res.status(201).json(newTeam);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateTeam: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { error } = validateTeam(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const updatedTeam = await Team.update(id, req.body);
            if (updatedTeam) {
                res.json(updatedTeam);
            } else {
                res.status(404).json({ message: 'Team not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteTeam: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await Team.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getTeamMembers: async (req, res) => {
        try {
            const teamId = parseInt(req.params.id);
            const members = await Team.getTeamMembers(teamId);
            res.json(members);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    addTeamMember: async (req, res) => {
        try {
            const teamId = parseInt(req.params.id);
            const userId = req.body.user_id; //  Предполагаем, что ID пользователя передается в теле запроса
            await Team.addTeamMember(teamId, userId);
            res.status(201).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    removeTeamMember: async (req, res) => {
        try {
            const teamId = parseInt(req.params.id);
            const userId = req.body.user_id;
            await Team.removeTeamMember(teamId, userId);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = teamController;