// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { Employees, Bills } = require('./database.js');

// Create a new client instance
const client = new Client({ intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'] });


/**
 * Load all commands
 */
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

/**
 * Load all events
 */
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
 
console.log("Loaded Events:")

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	console.log(`- ${event.name}`);
	if (event.once) {
		client.once(event.eventType, (...args) => event.execute(...args));
	} else {
		client.on(event.eventType, (...args) => event.execute(...args));
	}
}

// Listen for commands executions
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// client.on('messageCreate', async message =>{
// 	console.log('bop');
// 	console.log(message);
// });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	Employees.sync({force: false});
	Bills.sync({force: false});

	console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);
