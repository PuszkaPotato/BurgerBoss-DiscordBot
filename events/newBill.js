const {Bills} = require('../database.js');

module.exports = {
    name: 'newBill',
    eventType: 'messageCreate',
    execute(message) {
            if(message.channelId === '981493766332514304')
            {
                if (message.author.bot && message.embed) {
                    message = message.embeds[0].description;
      
                    let client = message.match('\\*\\*(.*)\\s\\(')
      
                    let price = message.match('\\$([0-9]+)');
      
                    let employee = message.match('Gracza:\\*\\*\\s(.*)\\s\\(');
      
                    if(price && employee && client)
                    {
                        const currentTime = new Date();
                        
                        console.log(client[1]);
                        console.log(price[1]);
                        console.log(employee[1]);
                        console.log(`Rachunek dla ${client[1]} o wartości ${price[1]} wystawiony przez ${employee[1]}`);

                        try {
                            const bill = Bills.create({
                                issuer: employee[1],
                                amount: price[1],
                                client: client[1],
                                date: currentTime
                            });

                            console.log(`Pomyślnie dodano nowy rachunek do bazy danych`);

                        } catch (error) {
                            if (error.name === 'SequelizeUniqueConstraintError') {
                                console.log(`Wystąpił błąd podczas zapisywania rachunku`);;
                            }
            
                            console.log(`Wystąpił nieznany błąd`);
                        }
                    }
                }
            }
    }
}