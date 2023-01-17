import { ApplicationError } from "./application-error.js";

export class ServiceAlreadyBootedError extends ApplicationError {
    /**
     * @param {string} serviceName 
     */
    constructor(serviceName) {
        super(`Serviço "${serviceName}" já inicializado`);
    }
}
