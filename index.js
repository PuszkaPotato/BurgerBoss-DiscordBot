/**
 * BurgerBoss is a Discord Bot to help manage a business on FiveM RP server
 *  Copyright (C) 2022 - Michał Kołodziej (CanExiOne)
 * 
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License v3 as published by
 *   the Free Software Foundation.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * 	You can contact original owner of this software on github or by e-mail
 * 
 *  @github https://github.com/CanExiOne
 * 	@email canexione@gmail.com
 */

// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
global.appRoot = path.resolve(__dirname);
const { Client, Collection, GatewayIntentBits, InteractionType, Partials } = require('discord.js');
const { token } = require(appRoot + '/config.json');
const { Employees, Bills } = require(appRoot + '/database.js');

// Create a new client instance
const client = new Client(
		{ 
			intents: 
			[
				GatewayIntentBits.Guilds, 
				GatewayIntentBits.GuildMessages, 
				GatewayIntentBits.GuildMessageReactions, 
				GatewayIntentBits.MessageContent, 
				GatewayIntentBits.GuildMembers
			],

			partials:
			[
				Partials.GuildMember
			]
		}
	);


/**
 * Load all commands
 */
client.commands = new Collection();
const commandsPath = appRoot + '/commands/';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

/**
 * Load all events
 */
const eventsPath = appRoot + '/events/';
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
	if (interaction.type !== InteractionType.ApplicationCommand) return;

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
