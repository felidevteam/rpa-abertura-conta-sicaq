import { rmSync } from "node:fs";
import { resolve } from "node:path";

export class PuppeteerDownloadObserver {
    /**
     * @param {import("puppeteer").Browser} browser
     * @param {boolean} keepFileAfterRead
     */
    constructor(browser, keepFileAfterRead = false) {
        this._browser = browser;
        this._keepFileAfterRead = keepFileAfterRead;

        /**
         * @type {import("./download-event").DownloadEvent[]}
         */
        this._eventHandlerList = [];

        this._downloadPath = resolve("./downloads");
    }

    async boot() {
        const client = await this._browser.target().createCDPSession();

        await client.send("Browser.setDownloadBehavior", {
            behavior: "allowAndName",
            downloadPath: this._downloadPath,
            eventsEnabled: true
        });

        client.on("Browser.downloadWillBegin", async event => {
            for (let handler of this._eventHandlerList) {
                await handler.downloadWillBegin(event);
            }
        });

        client.on("Browser.downloadProgress", async (event) => {
            if (event.state === "completed") {
                try {
                    for (let handler of this._eventHandlerList) {
                        await handler.downloadCompleted(event);
                    }
                } finally {
                    if (!this._keepFileAfterRead) {
                        const basename = resolve(this._downloadPath, event.guid);
                        rmSync(basename);
                    }
                }
            }
        });

        Promise.resolve(client);
    }

    /**
     * @param {import("./download-event").DownloadEvent} event
     */
    register(event) {
        event.setDonwloadPath(this._downloadPath);
        this._eventHandlerList.push(event);
    }
}
