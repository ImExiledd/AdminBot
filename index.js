const {clientId} = require("./config.json");
const {LOGGER} = require('./logging.js');
const setupFunctions = {
	inviteGenerator: function() {
		// We use this to allow the user to run initial setup for their bot. This will automatically generate
		// an invite link to add the bot to their server, based on the data in `config.json`
		const inviteString = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=581773184724167&integration_type=0&scope=bot`;
		console.log("Invite string created!");
		console.log(" ... ");
		console.log(" ... ");
		console.log(inviteString);
		console.log(" ... ");
		console.log(" ... ");
		console.log("Copy-paste this link into your browser to invite the bot to your guild!");
		process.exit();
	}
};

/*
*
*	Uncomment ONE of the below at a time to run auxilary functions.
*
*/

// setupFunctions.inviteGenerator();

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const process = require("node:process")

process.on('unhandledRejection', async (reason, promise) => {
	console.log("Unhandled Rejection @ ", promise, "Reason: ", reason);
});
process.on('uncaughtException', (err) => {
	console.log('Uncaught Exception: ', err);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
	console.log('Uncaught Exception Monitor: ', err, origin);
});

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(token);