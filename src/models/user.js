const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const dbConfig = require('../config/database');

const pool = new Pool(dbConfig);

const User = {
    getAll: async () => {
        try {
            const result = await pool.query('SELECT * FROM users');
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    create: async (user) => {
        try {
            const { role, name, region_id, email, password } = users;
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const result = await pool.query(
                'INSERT INTO users (role, name, region_id, email, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [role, name, region_id, email, passwordHash]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    update: async (id, user) => {
        try {
            const { role, name, region_id, email, password } = users;
            let passwordHash;
            if (password) { //  Если пароль передан, хешируем его
                const saltRounds = 10;
                passwordHash = await bcrypt.hash(password, saltRounds);
            }

            const result = await pool.query(
                `UPDATE users SET role = $1, name = $2, region_id = $3, email = $4,
                 ${password ? 'password_hash = $5,' : ''} updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
                password
                    ? [role, name, region_id, email, passwordHash, id]
                    : [role, name, region_id, email, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await pool.query('DELETE FROM users WHERE id = $1', [id]);
        } catch (error) {
            throw error;
        }
    },

    getByEmail: async (email) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
};

module.exports = User;