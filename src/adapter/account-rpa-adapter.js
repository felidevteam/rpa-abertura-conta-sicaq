import { Account } from "../entity/account.js";
import { DiscordRpaAlertChannel } from "../util/discord-rpa-alert-channel.js";


export class accountRpaAdapter {

    /**
     * @param {import("amqplib").Message} message
     * @return {Account}
     */
    static async fromAmqpRequestMessage(message) {
        const jsonMessage = JSON.parse(message.content);
        const discordNotifier = new DiscordRpaAlertChannel("Abertura de Conta");

        await verifyJsonMessage(jsonMessage, discordNotifier)

        const account = new Account(jsonMessage.customerHighestIncome, jsonMessage.customerSecondChoice, jsonMessage.statusCrot, jsonMessage.statusCreditCard);

        account.setCorrespondent(jsonMessage.correspondent)
        
        return account;
    }

    async verifyJsonMessage(jsonMessage, discordNotifier) {
        if(!jsonMessage.customerHighestIncome.id && jsonMessage.customerHighestIncome.id == null) {
            await discordNotifier.notificate({ content: "CustomerHighestIncome com ID NULO"});
        }

        if(!jsonMessage.customerHighestIncome.cpf && jsonMessage.customerHighestIncome.cpf == null) {
            await discordNotifier.notificate({ content: "CustomerHighestIncome com CPF NULO"});
        }

        if(!jsonMessage.customerHighestIncome.name && jsonMessage.customerHighestIncome.name == null) {
            await discordNotifier.notificate({ content: "CustomerHighestIncome com Nome NULO"});
        }

        if(!jsonMessage.customerHighestIncome.shortName && jsonMessage.customerHighestIncome.shortName == null) {
            await discordNotifier.notificate({ content: "CustomerHighestIncome com Nome Abreviado NULO"});
        }

        if(!jsonMessage.customerHighestIncome.gender && jsonMessage.customerHighestIncome.gender == null) {
            await discordNotifier.notificate({ content: "CustomerHighestIncome com Gênero NULO"});
        }

        if(!jsonMessage.customerSecondChoice.id && jsonMessage.customerSecondChoice.id == null) {
            await discordNotifier.notificate({ content: "CustomerSecondChoice com ID NULO"});
        }

        if(!jsonMessage.customerSecondChoice.cpf && jsonMessage.customerSecondChoice.cpf == null) {
            await discordNotifier.notificate({ content: "CustomerSecondChoice com CPF NULO"});
        }

        if(!jsonMessage.customerSecondChoice.name && jsonMessage.customerSecondChoice.name == null) {
            await discordNotifier.notificate({ content: "CustomerSecondChoice com Nome NULO"});
        }

        if(!jsonMessage.customerSecondChoice.shortName && jsonMessage.customerSecondChoice.shortName == null) {
            await discordNotifier.notificate({ content: "CustomerSecondChoice com Nome Abreviado NULO"});
        }

        if(!jsonMessage.customerSecondChoice.gender && jsonMessage.customerSecondChoice.gender == null) {
            await discordNotifier.notificate({ content: "CustomerSecondChoice com Gênero NULO"});
        }
        

    }
}