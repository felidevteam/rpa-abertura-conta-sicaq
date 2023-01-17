import { CircularReferenceError } from "./error/circular-reference-error.js";
import { ServiceNotFoundError } from "./error/service-not-found-error.js";

/**
 * Service Container que armazena instâncias de serviços utilizados pela aplicação
 */
export class Container {
    /**
     * Construtor deve receber lista de serviços a serem registrados
     *
     * @param {object<string, function>} definition Lista de serviços a serem registrados
     */
    constructor(definition) {
        this.raw = definition;
        this.services = [];
        this.loading = [];
    }

    /**
     * Cria ou recupera sempre a mesma instância de um serviço
     *
     * @param {string} serviceId Nome do serviço requerido
     * @returns {Promise<object>}
     */
    async get(serviceId) {
        if ("undefined" == typeof this.raw[serviceId]) {
            throw new ServiceNotFoundError(serviceId);
        }
        if (this.loading[serviceId]) {
            throw new CircularReferenceError(serviceId);
        }
        if ("undefined" == typeof this.services[serviceId]) {
            this.loading[serviceId] = true;
            const raw = this.raw[serviceId];
            if ("function" == typeof raw) {
                this.services[serviceId] = await raw(this);
            } else {
                this.services[serviceId] = raw;
            }
            this.loading[serviceId] = false;
        }

        return this.services[serviceId];
    }
}
