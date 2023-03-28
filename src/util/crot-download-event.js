import { DownloadEvent } from "./download-event.js";
import { resolve } from "node:path";

export class CrotDownloadEvent extends DownloadEvent {
    /**
     * @param {import("../entity/account").Account} account
     */
    constructor(account) {
        super();

        this._account = account;
        this._guidList = new Map();
    }

    async downloadWillBegin(event) {
        if (event.url.includes("pre_abertura_conta")) {
            this._guidList.set(event.guid, true);
        }
    }

    async downloadCompleted(event) {
        if (this._guidList.has(event.guid)) {
            // aqui o arquivo vai ter o nome igual ao guid, não necessita renomear
            const basename = resolve(this._downloadPath, event.guid);

            // TODO subir o arquivo no spaces
            // use os dados em `this._account`
            console.log(`subindo crot de ${this._account.cpfCliente} a partir de ${basename}`);

            this._guidList.delete(event.guid);
        }
    }
}
