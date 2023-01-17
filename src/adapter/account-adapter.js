import { Account } from "../entity/account.js"

export class AccountAdapter {

    /**
     * @param {import("amqplib").Message} message
     * @return {import("../entity/account").Account}
     */
    static fromAmqpRequestMessage(message) {
        const content = JSON.parse(message.content);
        // TODO MAKES ENTITY
    }

    /**
     * @param {import("../entity/account").Account} account 
     * @return {object}
     */
    static toAmqpResponseMessage(account) {
        return {
            
        };
    }
}
