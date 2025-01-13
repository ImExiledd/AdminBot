// Simple logging for the bot.
const dateTime = new Date();

const LOGGER = {
	info: function(data) {
		const currentDateTime = dateTime.toLocaleString('en-US');
		console.log(`[INFO - currentDateTime] ${data}`);
	},
	warn: function(data) {
		const currentDateTime = dateTime.toLocaleString('en-US');
		console.log(`[WARNING - currentDateTime] ${data}`);
	},
	error: function(data) {
		const currentDateTime = dateTime.toLocaleString('en-US');
		console.log(`[ERROR - currentDateTime] ${data}`);
	},
	fatal: function(data) {
		const currentDateTime = dateTime.toLocaleString('en-US');
		console.log(`[FATAL - currentDateTime] ${data}`);
	}
};