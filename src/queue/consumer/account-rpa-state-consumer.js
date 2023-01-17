import { AccountRpaStateAdapter } from "../../adapter/account-rpa-state-adapter.js";

export class AccountRpaStateConsumer {
    /**
     * @param {import("../../amqp-server").AmqpServer} amqpServer 
     * @param {string} exchangeName 
     * @param {import("../../cache").Cache} cache
     * @param {import("simplified-logger").Logger} logger 
     */
    constructor(amqpServer, exchangeName, cache, logger) {
        this.amqpServer = amqpServer;
        this.exchangeName = exchangeName;
        this.cache = cache;
        this.logger = logger.withLabel("rpa_create_account_sicaq_state_consumer");
        this.booted = false;
    }

    async boot() {
        if (this.booted) {
            return;
        }

        this.logger.debug(`Iniciando consumo de mensagens em "${this.exchangeName}"`);
        if (!this.amqpServer.booted) {
            await this.amqpServer.boot();
        }

        // TODO não acessar "server.channel" diretamente
        await this.amqpServer.channel.assertExchange(
            this.exchangeName,
            "fanout",
            { durable: true }
        );
        const assertQueue = await this.amqpServer.channel.assertQueue(
            "",
            { durable: true, autoDelete: true }
        );
        await this.amqpServer.channel.bindQueue(
            assertQueue.queue,
            this.exchangeName,
            ""
        );

        this.queueName = assertQueue.queue;
        const logger = this.logger;
        const cache = this.cache;
        this.consumerTag = await this.amqpServer.consume(this.queueName, async message => {
            const state = AccountRpaStateAdapter.fromAmqpRequestMessage(message);
            logger.info("Alteração de status do robô", { novo_status: state.active });
            cache.setItem("is-active", state.active);
        });

        this.booted = true;
    }

    async terminate() {
        if (!this.booted) {
            return;
        }
        this.booted = false;
        this.logger.debug(`Encerrando consumo de mensagens em ${this.queueName}`);
        await this.amqpServer.cancel(this.consumerTag);
    }
}
