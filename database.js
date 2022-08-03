/**
 * Discord Bot to help manage a business on FiveM RP server
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

const Sequelize = require('sequelize');
const { DB } = require(appRoot + '/config.json');

const sequelize = new Sequelize(DB.database, DB.user, DB.password , {
    host: DB.host,
    dialect: DB.dialect,
    storage: DB.storage,
    logging: DB.logging,
    logging: function (str) {
        if(DB.loggingDev)
        {
            console.log(`Sequelize: ${str}`);
        }
    }
});

module.exports = {
    Guilds : sequelize.define('guilds', {
        guildId : {
            type: Sequelize.INTEGER,
            unique: true
        },
        channels : {
            type: Sequelize.JSON
        }
    }),
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
