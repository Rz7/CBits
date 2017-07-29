const { Pool } = require('pg');

const debug = require('debug')('db');
const settings = require('./settings.json');
const promise = require('bluebird');

class DB {
    constructor() {
        this.pool = new Pool(settings.db);
        this.tablename = settings.db.tablename;

        this.init();
    }

    getAllData() {
        return this.query(`
            SELECT *
            FROM ${settings.db.tables.users}
            INNER JOIN ${settings.db.tables.shares}
            ON ${settings.db.tables.users}.id = ${settings.db.tables.shares}.user_id;
        `);
    }

    updateAllData(data) {
        return promise.map(data, (element, index) => {
            return this.query(`SELECT updateData($1, $2);`, [ index, element ]);
        });
    }

    query(q, data) {
        return this.pool.query(q, data).catch(e => {
            debug('Query error: %s', e); return null;
        });
    }

    init() {
        const q = `
            CREATE TABLE IF NOT EXISTS ${settings.db.tables.users}
            (
                id INT PRIMARY KEY
            );
            
            CREATE TABLE IF NOT EXISTS ${settings.db.tables.shares}
            (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                info TEXT NOT NULL
            );
            
            CREATE OR REPLACE FUNCTION updateData(index integer, el text) RETURNS void AS $$
                #variable_conflict use_variable
                BEGIN
                    INSERT INTO users (id) VALUES (index) ON CONFLICT (id) DO NOTHING;
                    INSERT INTO shares (user_id, info) VALUES (index, el) ON CONFLICT (user_id) DO UPDATE SET info = el;
                END;
            $$ LANGUAGE plpgsql;
        `;

        return this.query(q).then(r => debug('Connected to the DB'));
    }
}

module.exports = {
    DB
};