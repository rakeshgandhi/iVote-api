import mongoose from "mongoose";

import config from "../../config";
import { logger } from "../../utils/logger";

mongoose.Promise = global.Promise;
const uri = `mongodb://${config.db.userName}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;

export default function (callback) {
	const databaseString = getDatabaseStringToLogMessage();

	logger.info(`Trying to connect ${databaseString} ...`);


	mongoose.set("useNewUrlParser", true);
	const connection = mongoose.connect(uri, {
		socketTimeoutMS: 0,
		keepAlive: true,
		reconnectTries: 30
	});

	mongoose.connection.on('open', function () {
		logger.info(`Connected ${databaseString} successfully ...`);
		callback();
	});
	mongoose.connection.on('error', function (err) {
		logger.error(`Unable to connect ${databaseString} due to error mentioned below: \n${err}`)
	});
	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
		console.log('di');
	});
	mongoose.connection.on('close', function (ref) {
		console.log('close connection to mongo server'); 
	});
};

function getDatabaseStringToLogMessage() {
	return (`database ${config.db.database} on ${config.db.host}:${config.db.port}`);
}