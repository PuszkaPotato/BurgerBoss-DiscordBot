const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('duty')
		.setDescription('Zapisuje stan rozpoczęcia lub ukończenia pracy!'),
	async execute(interaction) {
        const currentTime = new Date();
		const user = interaction.user
		await interaction.reply(`${user} - Godzina rozpoczęcia pracy: ` + currentTime.getHours() + ':' + currentTime.getMinutes() + ' ' + currentTime.getTime());
	},
};
