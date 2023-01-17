import { ApplicationError } from "./application-error.js";

export class RejectedMessageError extends ApplicationError {
    constructor() {
        super("Mensagem rejeitada");
    }
}
