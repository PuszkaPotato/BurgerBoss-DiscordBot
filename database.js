const Sequelize = require('sequelize');

const sequelize = new Sequelize('burgerboss', 'burgerboss', 'password' , {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'burgerboss.sqlite',
    logging: function (str) {
        console.log(`Sequelize: ${str}`);
    }
});

module.exports = {
    Employees : sequelize.define('employees', {
        name: {
            type: Sequelize.STRING,
        },
        clientid: {
            type: Sequelize.INTEGER,
            unique: true,
        }
    }),
    Bills : sequelize.define('bills', {
        issuer: Sequelize.STRING,
        amount: Sequelize.INTEGER,
        client: Sequelize.STRING
    }),
}
