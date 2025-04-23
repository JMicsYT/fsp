const { Pool } = require('pg');
const dbConfig = require('../config/database');

const pool = new Pool(dbConfig);

const Event = {
    getAll: async () => {
        try {
            const result = await pool.query('SELECT * FROM events');
            return result.rows;
        } catch (error) {
            throw error; // Пробрасываем ошибку для обработки в контроллере
        }
    },

    getById: async (id) => {
        try {
            const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    create: async (event) => {
        try {
            const {
                title,
                description,
                discipline_id,
                start_date,
                end_date,
                format,
                organizer_id,
                region_id,
                max_participants,
            } = event;

            const result = await pool.query(
                `INSERT INTO events (title, description, discipline_id, start_date, end_date, format, organizer_id, region_id, max_participants)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [title, description, discipline_id, start_date, end_date, format, organizer_id, region_id, max_participants]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    update: async (id, event) => {
        try {
            const {
                title,
                description,
                discipline_id,
                start_date,
                end_date,
                format,
                organizer_id,
                region_id,
                max_participants,
            } = event;

            const result = await pool.query(
                `UPDATE events SET title = $1, description = $2, discipline_id = $3, start_date = $4, end_date = $5,
                 format = $6, organizer_id = $7, region_id = $8, max_participants = $9 WHERE id = $10 RETURNING *`,
                [
                    title,
                    description,
                    discipline_id,
                    start_date,
                    end_date,
                    format,
                    organizer_id,
                    region_id,
                    max_participants,
                    id,
                ]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await pool.query('DELETE FROM events WHERE id = $1', [id]);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = Event;