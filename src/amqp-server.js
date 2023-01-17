import amqplib from "amqplib";
import { ServiceAlreadyBootedError } from "./error/service-already-booted-error.js";

/**
 * Rotinas de tráfego de mensagens via AMQP
 */
export class AmqpServer {
    /**
     * @param {object} connectionParams 
     * @param {number} prefetch
     * @param {import("simplified-logger").Logger} logger
     */
    constructor(connectionParams, prefetch, logger) {
        this.connectionParams = connectionParams;
        this.prefetch = prefetch;
        this.logger = logger.withLabel("ampq_server");
        this.consumingTags = [];
        this.pendingMessages = [];
        this.booted = false;
    }

    /**
     * Inicia a conexão e canais de tráfego de mensagens
     */
    async boot() {
        if (this.booted) {
            throw new ServiceAlreadyBootedError("amqp-server");
        }
        this.logger.debug("Iniciando conexão", { host: this.connectionParams.hostname });
        this.connection = await amqplib.connect(this.connectionParams);
        this.logger.debug("Iniciando canal de tráfego de mensagens");
        this.channel = await this.connection.createChannel();
        await this.channel.prefetch(this.prefetch);
        this.booted = true;
    }

    /**
     * Encerra conexão
     */
    async terminate() {
        if (!this.booted) {
            return;
        }
        this.booted = false;
        try {
            this.logger.debug("Encerrando conexões");
            await this.channel.nackAll(true);
            this.consumingTags.forEach(async tag => await this.channel.cancel(tag));
            await this.channel.close();
            await this.connection.close();
        } catch (e) {
            this.logger.error(e);
        } finally {
            this.consumingTags = [];
            this.channel = null;
            this.connection = null;
        }
    }

    /**
     * Garante que a queue informada está preparada para transitar mensagens
     */
    async assertQueue(queue) {
        await this.channel.assertQueue(queue);
    }

    /**
     * Envia mensagens para fila
     * @param {string} queueName
     * @param {Buffer} bufferContent
     * @returns {boolean}
     */
    async sendToQueue(queueName, bufferContent) {
        return await this.channel.sendToQueue(queueName, bufferContent);
    }

    /**
     * Registra um consumidor para este servidor
     * @param {string} queue
     * @param {function} callback
     */
    async consume(queue, callback) {
        const { consumerTag } = await this.channel.consume(queue, async message => {
            try {
                await callback(message);
                await this.channel.ack(message);
            } catch (error) {
                await this.channel.reject(message, true);
                this.logger.error(error);
            }
        });
        this.consumingTags.push(consumerTag);

        return consumerTag;
    }

    /**
     * Interrompe o consumo de mensagens da tag informada
     * @param {string} consumerTag 
     */
    async cancel(consumerTag) {
        await this.channel.cancel(consumerTag);
        const tagIndex = this.consumingTags.findIndex(tag => tag == consumerTag);
        if (0 <= tagIndex) {
            this.consumingTags.splice(tagIndex, 1);
        }
    }
}
