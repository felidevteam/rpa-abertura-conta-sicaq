import { DownloadEvent } from "./download-event.js";
import { resolve } from "node:path";
import { rmSync } from "node:fs";

export class CrotDownloadEvent extends DownloadEvent {
    /**
     * @param {import("../entity/account").Account} account
     */
    constructor(account) {
        this._account = account;
    }

    async downloadCompleted(event) {
        // aqui o arquivo vai ter o nome igual ao guid, não necessita renomear
        const basename = resolve(this._downloadPath, event.guid);

        // subir o arquivo no spaces
        // use os dados em `this._account`
        //uploadAttachPdf()

        // apagar o arquivo ao final
        rmSync(basename);
    }
}
