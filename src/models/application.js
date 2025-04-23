const { Pool } = require('pg');
const dbConfig = require('../config/database');

const pool = new Pool(dbConfig);

const Application = {
    getAll: async () => {
        try {
            const result = await pool.query('SELECT * FROM applications');
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    create: async (application) => {
        try {
            const { event_id, team_id, user_id, status } = application;
            const result = await pool.query(
                'INSERT INTO applications (event_id, team_id, user_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
                [event_id, team_id, user_id, status]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    update: async (id, application) => {
        try {
            const { event_id, team_id, user_id, status } = application;
            const result = await pool.query(
                'UPDATE applications SET event_id = $1, team_id = $2, user_id = $3, status = $4 WHERE id = $5 RETURNING *',
                [event_id, team_id, user_id, status, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await pool.query('DELETE FROM applications WHERE id = $1', [id]);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = Application;