const { SlashCommandBuilder } = require('@discordjs/builders');
const { Bills } = require('../database.js');
const { MessageEmbed } = require('discord.js');
const { Op, Sequelize } = require('sequelize');
const dateHelper = require("../helpers/dateHelper.js");

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
					.setRequired(true))
				
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
			const startDate = interaction.options.getString('startdate');

			const endDate = interaction.options.getString('enddate');

			const dateRange = dateHelper.ConvertDateRange(startDate, endDate);

			const bills = await Bills.findAll({
				raw: true,
				attributes: [
					'issuer',
					[Sequelize.fn('SUM', Sequelize.col('amount')), 'sum_amount']
				],
				group: ['issuer'],
				order: [
					[Sequelize.col('sum_amount'), 'DESC']
				],
				 where: {createdAt: {[Op.between]: [dateRange['startDate'], dateRange['endDate']]}}
				}).then( async res => {
					content = `Suma rachunków między dniami **${dateRange['startDateString']}** - **${dateRange['endDateString']}**\n\n`;
					res.forEach(element => {
						content = content.concat(`**${element['issuer']}**: **${element['sum_amount']}**\n`);
					});

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
