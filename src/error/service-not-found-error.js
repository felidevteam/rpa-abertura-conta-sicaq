import { ApplicationError } from "./application-error.js";

/**
 * Erro utilizado pelo container de serviços
 * na ocorrência de erros de serviço não definido
 */
export class ServiceNotFoundError extends ApplicationError {
    /**
     * @param {string} serviceId ID do serviço não encontrado
     */
    constructor(serviceId) {
        super(`Serviço "${serviceId}" não registrado`);
    }
}
