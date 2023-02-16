import { Account } from "../entity/account.js";

export class accountRpaAdapter {

    /**
     * @param {import("amqplib").Message} message
     * @return {Ir}
     */
    static fromAmqpRequestMessage(message) {
        const jsonMessage = JSON.parse(message.content);

        const account = new Account();

        account.setAccountResult({
            customerHighestIncome: jsonMessage.customerHighestIncome,
            customerSecondChoice: jsonMessage.customerSecondChoice,
            statusCrot: jsonMessage.statusCrot,
            statusCreditCard: jsonMessage.statusCreditCard,
            correspondent: jsonMessage.correspondent
        })
        
        return account;
    }
}