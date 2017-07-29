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
            this.query(`               
                INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING
            `, [ index ]);

            return this.query(`
                INSERT INTO shares (user_id, info)
                VALUES ($1, $2)
                ON CONFLICT (user_id) DO UPDATE
                    SET info = $2
            `, [ index, element ]);
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
        `;

        return this.query(q).then(r => debug('Connected to the DB'));
    }
}

module.exports = {
    DB
};