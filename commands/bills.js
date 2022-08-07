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
;
const { Bills } = require(appRoot + '/database.js');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { Op, Sequelize } = require('sequelize');
const dateHelper = require(appRoot + '/helpers/dateHelper.js');
const {botChannels} = require(appRoot + '/config.json');

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
			const startDate = interaction.options.getString('startdate');

			const endDate = interaction.options.getString('enddate');

			const dateRange = dateHelper.ConvertDateRange(startDate, endDate);

			const bills = await Bills.findAll({
				raw: true,
				attributes: [
					'issuer',
					[Sequelize.fn('SUM', Sequelize.col('amount')), 'sum_amount'],
					[Sequelize.fn('COUNT', Sequelize.col('amount')), 'count_amount']
				],
				group: ['issuer'],
				order: [
					[Sequelize.col('sum_amount'), 'DESC']
				],
				 where: {createdAt: {[Op.between]: [dateRange['startDate'], dateRange['endDate']]}}
				}).then( async res => {
					content = `Suma rachunków między dniami **${dateRange['startDateString']}** - **${dateRange['endDateString']}**\n\n`;
					res.forEach(element => {
						content = content.concat(`**${element['issuer']}**: **${element['sum_amount']} | ${element['count_amount']}**\n`);
					});

					try {
						await interaction.deferReply({ ephermal: true });
						console.log(interaction);

						const embed = new EmbedBuilder()
                        .setColor('#3da324')
                        .setDescription(content)
                        .setTimestamp()
                        .setFooter({ text: 'Suma rachunków'})

                    	channel = interaction.guild.channels.cache.get(interaction.channelId);
					
						channel.send({ embeds: [embed] }).catch(() => {
							interaction.member.send(`**Nie mam dostępu do tego kanału!** *(${interaction.channelId})*`)
							
							return interaction.editReply({ content: "**Wystąpił Błąd! Więcej informacji w wiadomości prywatnej!**", ephermal: true });
						});

						return interaction.editReply("**Suma Wystawionych Rachunków**");
					} catch (error) {
						console.log(error);
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
			const embed = new EmbedBuilder()
                        .setColor('#3da324')
                        .setTitle(`Wygenerowany Rachunek do Testów`)
                        .setDescription(content)
                        .setTimestamp()
                        .setFooter({ text: 'Wygenerowany rachunek'})

                    channel = interaction.guild.channels.cache.get(botChannels.newBill);

                    channel.send({ embeds: [embed] }).catch(() => {interaction.member.send("**Nie udało się wysłać wiadomości na wybrany kanał! Może to być brak uprawnień do kanału!**")});
		}
	}
};
