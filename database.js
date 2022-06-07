const Sequelize = require('sequelize');

const sequelize = new Sequelize('dutybot', 'dutybot', 'password' , {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'burgerboss.sqlite',
});

module.exports = {
    Employees : sequelize.define('employees', {
        name: {
            type: Sequelize.STRING,
        },
        clientid: {
            type: Sequelize.INTEGER,
            unique: true,
        },
        time_start: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }),
    Bills : sequelize.define('bills', {
        issuer: Sequelize.STRING,
        amount: Sequelize.INTEGER,
        client: Sequelize.STRING,
        date: Sequelize.DATE
    }),
}
