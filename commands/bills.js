const { SlashCommandBuilder } = require('@discordjs/builders');
const { Bills } = require('../database.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bill')
		.setDescription('Zarządzanie rachunkami')
		.addSubcommand(subcommand => 
			subcommand
				.setName('generate')
				.setDescription('Generuje przykładowy rachunek do testów')
		),

	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'generate') 
		{
			const content = 'Duncan Sands (handonfire) otrzymał/a rachunek.\nKwota: $165\nOd Gracza: Max Leaf (Kusiek)\nPowód: 3x zamowienie'
			const embed = new MessageEmbed()
                        .setColor('#3da324')
                        .setTitle(`Wygenerowany Rachunek do Testów`)
                        .setDescription(content)
                        .setTimestamp()
                        .setFooter({ text: 'Wygenerowany rachunek'})

                    channel = interaction.guild.channels.cache.get('981493766332514304');

                    channel.send({ embeds: [embed] });
		}
	}
};
