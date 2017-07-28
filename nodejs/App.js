process.env.DEBUG = "app, db";

const debug     = require('debug')('app');
const express   = require('express');
const cors      = require('cors');
const bparser   = require('body-parser');
const promise   = require('bluebird');
const settings  = require('./settings.json');
const { DB }    = require('./db');

class App {
    constructor() {
        this.exp = express();
        this.init();
    }

    init() {
        let self = this;

        // DB
        this.db = new DB();

        return new promise((res) => {
            self.exp.listen(settings.server_port, res);
        }).then((err) => {
            if (err)
                throw err;

            debug('Server is listening on %s', settings.server_port);
        }).then(() => {
            // Middleware
            self.exp.use(cors());
            self.exp.use(bparser.json());
        }).then(() => {
            self.exp.get("/GET", (req, resp) => {
                return this.getData().then((data) => {
                    resp.send(JSON.stringify(data.rows));
                });
            });

            self.exp.post("/POST", (req, resp) => {
                try {
                    this.saveData(req.body).then(() => {
                        resp.send('200');
                    });
                }
                catch (e) {
                    console.log(e);
                    resp.send('400');
                }
            });

        }).then(() => {
            debug('Initialization is done');
        }).catch((e) => {
            return debug('[Error] An error occurred: %s', e);
        });
    }

    getData() {
        return this.db.getAllData();
    }

    saveData(data) {
        return this.db.updateAllData(data);
    }
}

(new App());