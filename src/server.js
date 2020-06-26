import express from 'express';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import { createRouterMiddleware } from './routes/index.js';
import { errorHandler } from './modules/handleErrors.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const dbName = 'disxt';

const connection = 'mongodb://mongodb:27017';
const dbOpts = {
  useUnifiedTopology: true,
};

async function init() {
  try {
    const { MongoClient } = mongodb;
    const client = await MongoClient.connect(connection, dbOpts);
    const db = client.db(dbName);

    app.locals.db = db;

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());

    createRouterMiddleware({ app });

    app.use(errorHandler);

    app.listen(port, () => console.log(`API running at http://localhost:${port}`));
  } catch (error) {
    console.log('error: ', error);
  }
}

init();
