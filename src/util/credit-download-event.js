import { DownloadEvent } from "./download-event.js";
import { uploadAttachPdf } from "./attachPdf.js"
import { copyFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

export class CreditDownloadEvent extends DownloadEvent {
    /**
     * @param {import("../entity/account").Account} account
     */
    constructor(account) {
        super();

        this._account = account;
        this._guidList = new Map();
    }

    async downloadWillBegin(event) {
        if (event.url.includes("cartao_credito")) {
            this._guidList.set(event.guid, true);
        }
    }

    async downloadCompleted(event) {
        if (this._guidList.has(event.guid)) {
            console.log(`subindo credit de ${this._account.cpfCliente}`);

            // aqui o arquivo vai ter o nome igual ao guid, não necessita renomear
            const basename = resolve(this._downloadPath, event.guid);

            // 51 é o id utilizado para Cartão de Credito
            await uploadAttachPdf(this._account.customerHighestIncome.id, basename, 51);

            this._guidList.delete(event.guid);
        }
    }
}
