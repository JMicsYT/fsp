const { Pool } = require('pg');
const dbConfig = require('../config/database');

const pool = new Pool(dbConfig);

const Team = {
    getAll: async () => {
        try {
            const result = await pool.query('SELECT * FROM teams');
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const result = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    create: async (team) => {
        try {
            const { name, captain_id, event_id, description } = team;
            const result = await pool.query(
                'INSERT INTO teams (name, captain_id, event_id, description) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, captain_id, event_id, description]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    update: async (id, team) => {
        try {
            const { name, captain_id, event_id, description } = team;
            const result = await pool.query(
                'UPDATE teams SET name = $1, captain_id = $2, event_id = $3, description = $4 WHERE id = $5 RETURNING *',
                [name, captain_id, event_id, description, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await pool.query('DELETE FROM teams WHERE id = $1', [id]);
        } catch (error) {
            throw error;
        }
    },

    getTeamMembers: async (teamId) => {
        try {
            const result = await pool.query(
                'SELECT users.* FROM users JOIN team_members ON users.id = team_members.user_id WHERE team_members.team_id = $1',
                [teamId]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    addTeamMember: async (teamId, userId) => {
        try {
            await pool.query(
                'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
                [teamId, userId]
            );
        } catch (error) {
            throw error;
        }
    },

    removeTeamMember: async (teamId, userId) => {
        try {
            await pool.query(
                'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2',
                [teamId, userId]
            );
        } catch (error) {
            throw error;
        }
    },
};

module.exports = Team;