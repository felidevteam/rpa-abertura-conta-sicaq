import { ApplicationError } from "./application-error.js";

/**
 * Erro utilizado pelo container de serviços
 * na ocorrência de erros de referência circular
 */
export class CircularReferenceError extends ApplicationError {
    /**
     * @param {string} serviceId ID do serviço não encontrado
     */
    constructor(serviceId) {
        super(`Referência circular encontrada em ${serviceId}`);
    }
}
