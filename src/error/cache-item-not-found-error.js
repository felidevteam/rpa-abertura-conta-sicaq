import { ApplicationError } from "./application-error.js";

export class CacheItemNotFoundError extends ApplicationError {
    constructor(missingId) {
        super(`Item ${missingId} não encontrado em cache`);
    }
}
