import { AccountRpaState } from "../entity/account-rpa-state.js";

export class AccountRpaStateAdapter {
    /**
     * @param {import("amqplib").Message} message 
     * @returns {AccountRpaState}
     */
    static fromAmqpRequestMessage(message) {
        const content = JSON.parse(message.content);
        const state = new AccountRpaState();
        state.active = content.ativo;

        return state;
    }
}
