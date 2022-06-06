const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'newCV',
    eventType: 'messageCreate',
    execute(message) {
            if(message.channelId === '970267803762458674')
            {
                console.log(message);
                const firstAttachment = [...message.attachments][0];
                
                const attachment = firstAttachment[1].attachment;
                if (!message.author.bot) {
                    const embed = new MessageEmbed()
                        .setColor('#3da324')
                        .setTitle(`CV - ${message.author.username}`)
                        .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpg` })
                        .setDescription(message.content)
                        .addField('Załączone CV', '\u200B')
                        .setImage(attachment)
                        .setTimestamp()
                        .setFooter({ text: 'CV Kandydata BurgerShot'})

                    channel = message.guild.channels.cache.get('982368446929059881');

                    channel.send({ embeds: [embed] });
                }
                
            }
    }
}