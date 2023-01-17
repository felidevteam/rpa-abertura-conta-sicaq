import { ApplicationError } from "./application-error";

class RpaAccountSicaqError extends ApplicationError {

    constructor(message, process, correspondent, loginFailed) {
        super(message);
        this.name = "RpaAccountSicaqError";
        this.processId = process.processo_credito_id ;
        this.automationId = process.id;
        this.process = process;
        this.loginFailed = loginFailed;
        this.correspondent = correspondent;
    }
}

module.exports = RpaAccountSicaqError;