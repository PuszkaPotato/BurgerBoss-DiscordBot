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

const {Bills} = require(appRoot + '/database.js');
const {botChannels} = require(appRoot + '/config.json');

module.exports = {
    name: 'newBill',
    eventType: 'messageCreate',
    execute(message) {
        if(message.channelId === botChannels.newBill)
        {
            if (message.author.bot && message.embeds) {
                try {
                    messageContents = message.embeds[0].description;
                } catch (error) {
                    console.log(error.message);
                }
                
                if (typeof messageContents !== 'undefined' ) {
                    let client = messageContents.match('\\*\\*(.*)\\s\\(')
    
                    let price = messageContents.match('\\$([0-9]+)');
    
                    let employee = messageContents.match('Gracza:\\*\\*\\s(.*)\\s\\(');
    
                    if(price && employee && client)
                    {
                        console.log(client[1]);
                        console.log(price[1]);
                        console.log(employee[1]);
                        console.log(`Rachunek dla ${client[1]} o wartości ${price[1]} wystawiony przez ${employee[1]}`);

                        try {
                            const bill = Bills.create({
                                issuer: employee[1],
                                amount: price[1],
                                client: client[1]
                            });

                            console.log(`Pomyślnie dodano nowy rachunek do bazy danych`);

                        } catch (error) {
                            if (error.name === 'SequelizeUniqueConstraintError') {
                                console.log(`Wystąpił błąd podczas zapisywania rachunku`);;
                            }
            
                            console.log(`Wystąpił nieznany błąd`);
                        }
                    } else {
                        console.log('Nie udało się znaleźć danych rachunku');
                    }
                }
            }
        }
    }
}