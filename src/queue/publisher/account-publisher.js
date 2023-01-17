import { AccountAdapter } from "../../adapter/account-adapter.js";
import { ApplicationError } from "../../error/application-error.js";

export class AccountPublisher {
    /**
     * @param {import("../../amqp-server").AmqpServer} amqpServer 
     * @param {string} queueName 
     * @param {import("simplified-logger").Logger} logger 
     */
    constructor(amqpServer, queueName, logger) {
        this.amqpServer = amqpServer;
        this.queueName = queueName;
        this.logger = logger.withLabel("rpa_create_account_sicaq_publisher");
        this.booted = false;
    }

    async boot() {
        this.logger.debug(`Preparando fila de respostas em "${this.queueName}"`);
        if (!this.amqpServer.booted) {
            await this.amqpServer.boot();
        }
        this.amqpServer.assertQueue(this.queueName);
        this.booted = true;
    }

    async terminate() {
        // não há tarefas especificas
        this.booted = false;
    }

    /**
     * @param {import("../../entity/account").Account} account
     */
    async publishAccountResult(account) {
        this.logger.info(
            "Publicando resultado",
            {
                //TODO Alterar log
            }
        );
        const content = AccountAdapter.toAmqpResponseMessage(account);
        const success = await this.amqpServer.sendToQueue(this.queueName, Buffer.from(JSON.stringify(content)));
        if (!success) {
            throw new ApplicationError("Não foi possível publicar a resposta");
        }
    }
}
