const { SlashCommandBuilder } = require('@discordjs/builders');
const { Bills } = require('../database.js');
const { MessageEmbed } = require('discord.js');
const { Op, Sequelize } = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bills')
		.setDescription('Zarządzanie rachunkami')
		.addSubcommand(subcommand => 
			subcommand
				.setName('totals')
				.setDescription('Pokazuje sumę wystawionych rachunków przez pracowników w określonym czasie')
				.addStringOption(option =>
					option.setName('startdate')
					.setDescription('Początkowa data sumowanych rachunków')
					.setRequired(true))
				.addStringOption(option =>
					option.setName('enddate')
					.setDescription('Końcowa data sumowanych rachunków')
					.setRequired(false))
				
		)
		.addSubcommand(subcommand => 
			subcommand
				.setName('generate')
				.setDescription('Generuje przykładowy rachunek do testów')
				.addStringOption(option =>
					option.setName('issuer')
					.setDescription('Imie i nazwisko postaci wystawiającej rachunek: Elliot Miller (CanExiOne)')
					.setRequired(true))
				.addStringOption(option =>
					option.setName('client')
					.setDescription('Imie i nazwisko postaci otrzymującej rachunek: Elliot Miller (CanExiOne)')
					.setRequired(true))
				.addIntegerOption(option =>
					option.setName('amount')
					.setDescription('Wartość rachunku')
					.setRequired(true))
				.addStringOption(option =>
					option.setName('reason')
					.setDescription('Powód rachunku')
					.setRequired(true))
		),

	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'totals')
		{
			const startDate = interaction.options.getString('startdate').split("/");

			const endDate = interaction.options.getString('enddate').split("/");

			//We are pretty much adding hours because date is 2 hours behind
			var startDateObject = new Date(`${startDate[1]}/${startDate[0]}/${startDate[2]}`).setHours(02, 00, 00);

			//We want it to be the end of the day so we set end of the day + 2 hours
			var endDateObject = new Date(`${endDate[1]}/${endDate[0]}/${endDate[2]}`).setHours(25,59,59);

			var startDateObject = new Date(startDateObject);

			var endDateObject = new Date(endDateObject);

			console.log(startDateObject.toISOString());

			console.log(endDateObject.toISOString());

			const bills = Bills.findAll({
				raw: true,
				attributes: [
					'issuer',
					[Sequelize.fn('SUM', Sequelize.col('amount')), 'amount']
				],
				group: ['issuer'],
				 where: {createdAt: {[Op.between]: [startDateObject.toISOString(), endDateObject.toISOString()]}}
				}).then( async res => {
					content = `Suma rachunków między dniami **${interaction.options.getString('startdate')}** - **${interaction.options.getString('enddate')}**\n\n`;
					res.forEach(element => {
						content = content.concat(`**${element['issuer']}**: **${element['amount']}**\n`);
					});
					console.log(content);

					await interaction.reply({content: `**Suma Wystawionych Rachunków**`, ephermal: false});

					try {
						const embed = new MessageEmbed()
                        .setColor('#3da324')
                        .setDescription(content)
                        .setTimestamp()
                        .setFooter({ text: 'Suma rachunków'})

                    	channel = interaction.guild.channels.cache.get(interaction.channelId);
					
						channel.send({ embeds: [embed] });
					} catch (error) {
						console.log(error);

						return interaction.followUp(`Wystąpił błąd podczas wysyłania sumy rachunków!`);
					}
                    
				})

		}
		if (interaction.options.getSubcommand() === 'generate') 
		{
			const issuer = interaction.options.getString('issuer');
			const client = interaction.options.getString('client');
			const reason = interaction.options.getString('reason');
			const amount = interaction.options.getInteger('amount');

			const content = `**${client}** otrzymał/a rachunek.\n**Kwota:** $${amount}\n**Od Gracza:** ${issuer}\n**Powód:** ${reason}`
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
