import { Account } from "../entity/account.js";

export class accountRpaAdapter {

    /**
     * @param {import("amqplib").Message} message
     * @return {Account}
     */
    static fromAmqpRequestMessage(message) {
        const jsonMessage = JSON.parse(message.content);

        const account = new Account(jsonMessage.customerHighestIncome, jsonMessage.customerSecondChoice, jsonMessage.statusCrot, jsonMessage.statusCreditCard);

        account.setCorrespondent(jsonMessage.correspondent)
        
        return account;
    }
}