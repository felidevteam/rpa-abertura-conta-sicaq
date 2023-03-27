export class PuppeteerDownloadObserver {
    /**
     * @param {import("puppeteer").Browser} browser
     */
    constructor(browser) {
        this._browser = browser;

        /**
         * @type {import("./download-event").DownloadEvent[]}
         */
        this._eventHandlerList = [];

        this._dowloadPath = resolve("./downloads");
    }

    async boot() {
        const client = await this._browser.target().createCDPSession();

        await client.send("Browser.setDownloadBehavior", {
            behavior: "allowAndName",
            downloadPath: this._dowloadPath,
            eventsEnabled: true
        });

        client.on('Browser.downloadProgress', async event => {
            if (event.state === 'completed') {
                for (let handler of this._eventHandlerList) {
                    await handler.downloadCompleted(event);
                }
            }
        });
    }

    /**
     * @param {import("./download-event").DownloadEvent} event
     */
    register(event) {
        event.setDonwloadPath(this._dowloadPath);
        this._eventHandlerList.push(event);
    }
}
