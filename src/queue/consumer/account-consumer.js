import { accountRpaAdapter } from "../../adapter/account-rpa-adapter.js";

export class AccountConsumer {
    /**
     * @param {import("../../amqp-server").AmqpServer} amqpServer 
     * @param {string} queueName 
     * @param {import("../publisher/account-publisher").AccountPublisher} accountResultPublisher
     * @param {import("simplified-logger").Logger} logger 
     */
    constructor(amqpServer, queueName, accountService, accountResultPublisher, logger) {
        this.amqpServer = amqpServer;
        this.queueName = queueName;
        this.accountService = accountService;
        this.accountResultPublisher = accountResultPublisher;
        this.logger = logger.withLabel("rpa_create_account_sicaq_consumer");
        this.booted = false;
    }

    async boot() {
        this.logger.debug(`Iniciando consumo de mensagens em "${this.queueName}"`);
        if (!this.amqpServer.booted) {
            await this.amqpServer.boot();
        }
        if (!this.accountResultPublisher.booted) {
            this.accountResultPublisher.boot();
        }

        const accountResultPublisher = this.accountResultPublisher;
        const logger = this.logger;
        await this.amqpServer.assertQueue(this.queueName);
        this.consumerTag = await this.amqpServer.consume(this.queueName, async message => {

            const account = accountRpaAdapter.fromAmqpRequestMessage(message)
            if (account.statusCrot === false && account.statusCreditCard === false){
                logger.debug(`Ops, esse robô não era pra ser executado pois nenhum checkbox foi marcado...   Crot:${jsonMessage.statusCrot}  CreditCard:${jsonMessage.statusCreditCard}`)
                return;
            }
             const result = await this.accountService.checkAccountOverDraft(account.AccountResult);
            logger.debug("Mensagem recebida",
             { 
                // TODO AJUSTAR LOG
             }
            );
            await accountResultPublisher.publishAccountResult(result);
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