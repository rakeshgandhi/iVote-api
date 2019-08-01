import bodyParser from 'body-parser';
import express from 'express';

import config from './config';
import db from './services/mongoose';
import { logger } from './utils/logger';
import api from './api';

import middleware from './middleware';

const app = express();

// setup the logger

app.use(middleware.httpLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

logger.info('Starting server ... ');
db(_ => {
	app.use(config.app.apiRoute, api());
	app.listen(config.app.port, err => {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
		logger.info(
			`API is now running on port ${config.app.host}:${config.app.port}${config.app.apiRoute}`
		);
	});
});