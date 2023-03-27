import { DownloadEvent } from "./download-event.js";
import { resolve } from "node:path";
import { renameSync, rmSync } from "node:fs";

export class CrotDownloadEvent extends DownloadEvent {
    /**
     * @param {import("../entity/account").Account} account
     * @param {boolean} keepFileAfterRead
     */
    constructor(account, keepFileAfterRead = false) {
        super();

        this._account = account;
        this._keepFileAfterRead = keepFileAfterRead;
    }

    async downloadCompleted(event) {
        // aqui o arquivo vai ter o nome igual ao guid, não necessita renomear imediatamente
        const basename = resolve(this._downloadPath, event.guid);

        // subir o arquivo no spaces
        // use os dados em `this._account`
        //uploadAttachPdf()

        // apagar, ou não, o arquivo ao final
        if (!this._keepFileAfterRead) {
            rmSync(basename);
            return;
        }

        renameSync(basename, resolve(this._downloadPath, `crot-${this._account.cpfCliente}.pdf`));
    }
}
