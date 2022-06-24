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