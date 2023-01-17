import { Container } from "./container.js";

/**
 * Classe de controle global da aplicação
 */
export class Application {
    /**
     * @param {Container} serviceContainer 
     */
    constructor(serviceContainer) {
        this.container = serviceContainer;
        process.on("uncaughtException", async error => { await this.terminate(error) });
        process.on("unhandledRejection", async (reason, _) => { await this.terminate(reason) });
        process.on("SIGTERM", async () => { await this.terminate("Processo encerrado pelo usuário") });
    }

    /**
     * Inicia todos os serviços de longa duração da aplicacao
     */
    async boot() {
        /** @type {import("simplified-logger").Logger} */
        const logger = await this.container.get("app.logger");
        logger.info("Iniciando aplicação");

        /** @type {import("./amqp-server").AmqpServer} */
        this.amqpServer = await this.container.get("app.amqp-server");
        await this.amqpServer.boot();

        /** @type {import("./queue/consumer/account-rpa-state-consumer").AccountRpaStateConsumer} */
        this.accountRpaStateConsumer = await this.container.get("app.queue.account-rpa-state-consumer");
        await this.accountRpaStateConsumer.boot(); 

        /** @type {import("./queue/publisher/account-publisher").AccountPublisher} */
        this.accountPublisher = await this.container.get("app.queue.account-publisher");
        await this.accountPublisher.boot();

        /** @type {import("./queue/consumer/account-consumer").AccountConsumer} */
        this.accountConsumer = await this.container.get("app.queue.account-consumer");
        await this.accountConsumer.boot();

        //TODO MAKES BOOT FROM CONSUMER, PUBLISHER, AND STATE CONSUMER
        // let accountService = await this.container.get("app.service.account")
        // const data = await accountService.checkAccountOverDraft(JSON.parse(`{
        //     "login": "amanda",
        //     "senha": "alegria9",
        //     "cod_correspondente": "000651648",
        //     "correspondente_id": 2,
        //     "cliente_id": "99999",
        //     "cpf_proponente": "36609417865",
        //     "sexo_proponente": "M",
        //     "statusCrot": false,
        //     "statusCreditCard": true
        // }`));
        // "cod_correspondente": "000651648",
        // "cpf_proponente": "01243288574",
        // console.log(data);
    }

    /**
     * Encerra os processos rodando em segundo plano e finaliza o sistema
     */
    async terminate() {
        try {
            /** @type {import("simplified-logger").Logger} */
            const logger = await this.container.get("app.logger");
            if (arguments[0]) {
                if (arguments[0] instanceof Error) {
                    logger.error(arguments[0]);
                    process.exit(1);
                }
                logger.info(arguments[0]);
            } else {
                logger.info("Aplicação encerrada sem informações adicionais");
            }
            process.exit(0);
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    }
}
