const { SlashCommandBuilder } = require('@discordjs/builders');
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
				.addStringOption(option =>
					option.setName('clientid')
					.setDescription('Użytkownik Discord')
					.setRequired(true)
					.addChoice("Elliot Miller", "123456789")))
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
			let option = interaction.options.get("clientid")
			
			console.log(option.value);
		} else if (interaction.options.getSubcommand() === 'list') {
			const employeeList = await Employees.findAll({ attributes: ['name', 'clientid'] });

			const employeeString = employeeList.map(t => t.name).join(', ') || 'No tags set.'

			return interaction.reply(`Lista pracowników: ${employeeString}`);
		}
	},
};
