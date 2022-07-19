/**
 * @TODO
 * Send message when added to candidate role
 * 
 */

const {candidateRole, botChannels} = require('../config.json');

module.exports = {
    name: "newCandidate",
    eventType: "guildMemberUpdate",
    async execute(oldMember, newMember) {
        if(newMember.roles.cache.has(candidateRole))
        {
            message = "Otrzymano wiadomość e-mail z adresu **elliot.miller@burgershot.com** (<@218635445825699840>)\n\`\`\`Witam,\n\n" +
            "Dziękujemy za zainteresowanie pracą w restauracji BurgerShot. Jest to wiadomość mająca na celu poinformowanie cię o pozytywnym rozpatrzeniu Twojego CV. \n" +
            "Skontaktujemy się z Tobą w ciągu kolejnych dni w celu umówienia rozmowy o pracę. Ewentualnie możesz odpisać na ten adres e-mail z odpowiednimi dla Ciebie terminami.\n\n" +
            "Pozdrawiam,\n" +
            "Elliot Miller, Manager Restauracji BurgerShot\`\`\`" +
            "*Ta wiadomość została wysłana automatyczanie ponieważ zostało przyjęte CV Twojej postaci i nadano Ci rangę **Kandydat** na serwerze BurgerShot PixaRP*";
            await newMember.send(message).catch((error) => {});
        }
        console.log(newMember)

        channel = newMember.guild.channels.cache.get(botChannels.staffChannel);

        await channel.send(`Wysłano wiadomość o zaakceptowanym CV do ${newMember}. Pamiętaj o napisaniu i umówieniu wizyty!`);
    }
}