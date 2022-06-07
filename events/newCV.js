const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'newCV',
    eventType: 'messageCreate',
    execute(message) {
            if(message.channelId === '970267803762458674')
            {

                if(message.attachments.size > 0)
                {
                    const firstAttachment = [...message.attachments][0];
                
                    var attachment = firstAttachment[1];
                }
                
                if (!message.author.bot) {
                    const embed = new MessageEmbed()
                        .setColor('#3da324')
                        .setTitle(`CV - ${message.author.username}`)
                        .setAuthor({ name: message.author.username, iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpg` })
                        .setDescription(message.content)
                        .setTimestamp()
                        .setFooter({ text: 'CV Kandydata BurgerShot'})

                    if(typeof attachment !== 'undefined' && attachment)
                    {
                        if(attachment.contentType == 'image/png' || 'image/jpg' || 'image/jpeg')
                        {
                            embed.addField('Załączone CV', '\u200B')
                            embed.setImage(attachment.attachment)
                        }
                    }

                    channel = message.guild.channels.cache.get('982368446929059881');

                    channel.send({ embeds: [embed] });
                }
                
            }
    }
}