export class DownloadEvent {
    /**
     * @param {string} path
     */
    setDonwloadPath(path) {
        this._downloadPath = path;
    }

    async downloadWillBegin(event) {
        throw new Error("Not implemented");
    }

    async downloadCompleted(event) {
        throw new Error("Not implemented");
    }
}
