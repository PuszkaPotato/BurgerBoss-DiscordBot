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

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const {Employees} = require('../database.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('employee')
		.setDescription('Zarządzanie pracownikami')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Dodaj pracownika do bazy danych')
				.addUserOption(option =>
					option.setName('clientid')
						.setDescription('Użytkownik Discord')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('icname')
						.setDescription('Imię i nazwisko postaci IC')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Usuń pracownika z bazy danych')
				.addIntegerOption(option =>
					option.setName('id')
					.setDescription('ID pracownika, sprawdź za pomocą komendy od listy pracowników')
					.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('Pokaze listę pracowników w bazie danych')),
	async execute(interaction) {
        const currentTime = new Date();

		if (interaction.options.getSubcommand() === 'add') {
			const user = interaction.options.getUser('clientid');
			const icname = interaction.options.getString('icname');

			try {
				const employee = await Employees.create({
					name: icname,
					clientid: user,
				});

				await interaction.reply({content: `Pomyślnie dodano użytkownika ${user} z postacią **${icname}** do bazy danych`, ephermal: true});
			} catch (error) {
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply({content: `Ten użytkownik został już dodany`, ephermal: true});
				}

				await interaction.reply({content: 'Wystąpił nieznany błąd!', ephermal: true});
				return interaction.followUp(error.message);
			}
		} else if (interaction.options.getSubcommand() === 'remove') {
			const employeeId = interaction.options.getInteger('id');

			try {
				const employeeData = await Employees.findOne({raw: true, where: { id: employeeId } });
				const employee = Employees.destroy({ where: { id: employeeId } });

				if(employeeData !== null)
				{
					return interaction.reply({content: `Pomyślnie usunięto pracownika **${employeeData.name} (${employeeData.clientid})** z bazy danych!`, ephermal: true});
				}

				return interaction.reply({ content:`Nie znaleziono pracownika o ID: **${employeeId}**`, ephermal:true });
			} catch (error) {
				console.log(error);

				return interaction.reply({content: 'Wystąpił nieznany błąd!', ephermal: true});
			}
		} else if (interaction.options.getSubcommand() === 'list') {

			await interaction.deferReply();
			
			const embed = new EmbedBuilder()
                        .setColor('#3da324')
                        .setTitle(`Lista Pracowników`)
                        .setDescription(`Lista pracowników znajdujących się aktualnie w bazie danych`);

			try {
				const employeeMap = await Employees.findAll({raw: true, attributes: ['id', 'name', 'clientid'] });
	
				const employeeList = Object.fromEntries(employeeMap.entries());
	
				Object.keys(employeeList).forEach(i => {
					embed.addFields([
						{ name: `${employeeList[i]['name']} - ID (${employeeList[i]['id']})`, value: employeeList[i]['clientid']}
					])
				})
				channel = interaction.guild.channels.cache.get(interaction.channelId);
	
				channel.send({ embeds: [embed] }).catch((error) => {
					interaction.member.send("Wystąpił błąd podczas wysyłania listy pracowników! Błąd:");
					interaction.member.send(error.message);

					return interaction.editReply({ content: "Wystąpił błąd podczas wysyłania listy pracowników!", ephermal: true});
				});

				return interaction.editReply({content: `**Pomyślnie wysłano listę pracowników!**`, ephermal: true});
			} catch (error) {
				console.log(error);
				
				return interaction.reply({content: `Wystąpił błąd!`, ephermal: true});
			}
		}
	},
};
