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
        return this.query(`SELECT * FROM ${settings.db.tablename} ORDER BY id ASC`);
    }

    updateAllData(data) {
        return promise.map(data, (element, index) => {
            return this.query(`
                INSERT INTO  ${settings.db.tablename} (id, info) 
                VALUES ($1, $2)
                ON CONFLICT (id) DO UPDATE 
                  SET info = $2;
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
            CREATE TABLE IF NOT EXISTS ${settings.db.tablename}
            (
                id INT PRIMARY KEY,
                info TEXT not null
            )
        `;

        return this.query(q).then(r => debug('Connected to the DB'));
    }
}

module.exports = {
    DB
};