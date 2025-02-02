const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const globalCommands = [];
const localCommands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			if(command.isGuildLimited === true) {
				localCommands.push(command.data.toJSON());
				console.log(`PUSHED ${filePath} TO NAMED GUILD`)
			} else if(!command.isGuildLimited) {
				globalCommands.push(command.data.toJSON());
				console.log(`PUSHED ${filePath} TO GLOBAL`)
			}
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module


// and deploy your commands!

(async () => {
	try {
		const rest = new REST().setToken(token);
		console.log(`Started refreshing ${globalCommands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			//Routes.applicationGuildCommands(clientId, guildId),
            // #### COMMENT OUT ABOVE AND UNCOMMENT BELOW TO MAKE CHANGES GLOBAL #### //
			
            Routes.applicationCommands(clientId),
			{ body: globalCommands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
	try {
		const rest = new REST().setToken(token);
		console.log(`Started refreshing ${localCommands.length} localized application (/) commands.`);
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: localCommands }
		)
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();