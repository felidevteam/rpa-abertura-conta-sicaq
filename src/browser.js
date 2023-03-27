import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

/**
 * Manipula navegador de internet
 */
export class Browser {
    /**
     * @param {boolean} headless 
     * @param {number} defaultTimeout
     */
    constructor(headless, defaultTimeout) {
        this.headless = headless;
        this.defaultTimeout = defaultTimeout;
    }

    /**
     * @param {string} url 
     *
     * @returns {Promise<Page>}
     */
    async getPage() {
        const browser = await puppeteer.launch({
            headless: false,
            ignoreHTTPSErrors: true,
            args: [
                "--no-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox",
                "--ignore-certificate-errors",
                "--ignore-certificate-errors-spki-list",
                "--enable-features=NetworkService",
                "--no-zygote",
                "--aggressive-cache-discard",
                "--disable-cache",
                "--disable-application-cache",
                "--disable-offline-load-stale-cache",
                "--disable-gpu-shader-disk-cache",
                "--media-cache-size=0",
                "--disk-cache-size=0"
            ]
        });

        const ppage = await browser.newPage();
        await ppage.setViewport({ width: 1024, height: 768 });
        ppage.setDefaultTimeout(this.defaultTimeout);
        ppage.setDefaultNavigationTimeout(this.defaultTimeout);

        return new Page(ppage);
    }
}

/**
 * Manipula elementos da página
 */
export class Page {
    /**
     * @param {puppeteer.Page} puppeteerPage 
     */
    constructor(puppeteerPage) {
        this._page = puppeteerPage;
    }

    /**
     * @returns {puppeteer.Browser}
     */
    getBrowser() {
        return this._page.browser();
    }

    /**
     * @returns {puppeteer.Protocol.Network.Cookie[]}
     */
    async getCookies() {
        return await this._page.cookies();
    }

    /**
     * @param {puppeteer.Protocol.Network.Cookie[]} cookies 
     */
    async setCookies(cookies) {
        return await this._page.setCookie(...cookies);
    }

    /**
     * Encerra a navegação e o browser
     */
    async close() {
        let browser = await this._page.browser();
        await this._page.close();
        await browser.close();
    }

    /**
     * Navega pela página indicada
     * @param {string} url 
     */
    async navigate(url) {
        await this._page.goto(url, { waitUntil: "load" });
    }

    /**
     * Recupera o objeto HTTPResponse da chamada de self::navigate mais recente
     *
     * @returns {import("puppeteer").HTTPResponse}
     */
    lastResponse() {
        return this._lastResponse;
    }

    /**
     * Executa código nativo diretamente no navegador
     * @param {function} callback
     * @param {...any} args
     */
    async native(callback, args) {
        return await this._page.evaluate(callback, args);
    }

    /**
     * Retorna o conteúdo preenchido em um input[type=text]
     * @param {string} selector
     * @returns {Promise<string|null>}
     */
    async value(selector) {
        return await this.native(selector => {
            const element = document.querySelector(selector);
            if (element) {
                return element.value;
            }

            return null;
        }, selector);
    }

    /**
     * Retorna o node de texto a partir de um selector
     * @param {string} selector
     * @returns {Promise<string|null>}
     */
    async innerText(selector) {
        return await this.native(selector => {
            const element = document.querySelector(selector);
            if (element) {
                return element.innerText;
            }

            return null;
        }, selector);
    }

    /**
     * Retorna o node de texto a partir de um xPath
     * @param {string} selector
     * @returns {Promise<string|null>}
    */
    async innerTextByXpath(xpath) {
        return await this.native(xpath => {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                return element.innerText;
            }

            return null;
        }, xpath);
    }


    /**
     * Verifica se existe o selector informado
     * @param {string} selector
     */
    async isSelectorPresent(selector) {
        try {
            await this._page.waitForSelector(selector);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Preenche campos input[type=text] com o texto informado
     * @param {string} selector
     * @param {string} value
     */
    async type(selector, value) {
        const delay = Math.random() * 300 + 100;
        await (await this._page.waitForSelector(selector/*, { visible: true }*/)).type(value, { delay });
    }

    /**
     * Dispara um click simples no elemento informado
     */
    async click(selector) {
        await (await this._page.waitForSelector(selector)).click();
    }

    async clickByXpath(xpath) {
        await (await this._page.waitForXPath(xpath)).click();
    }

    async isXpathPresent(xpath) {
        try {
            await this._page.waitForXPath(xpath);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Seleciona um determinado <option> dentro de um <select>
     */
    async setSelectValue(selectSelector, value) {
        await (await this._page.waitForSelector(selectSelector)).select(value);
    }

    /**
     * Registra um event handler
     * 
     * @param {string} event
     * @param {function} callback 
     */
    async on(event, callback) {
        return await this._page.on(event, callback);
    }

    /**
     * Aguarda até o navegador acabar de carregar e liberar a rede
     */
    async waitForNetworkIdle() {
        await this._page.waitForNetworkIdle();
    }

    /**
     * Aguarda até o navegador iniciar uma navegação
     */
    async waitForNavigation() {
        await this._page.waitForNavigation({ waitUntil: "networkidle2" });
    }

    /**
     * sleep() com outro nome
     */
    async waitTimeout(milliseconds) {
        await this._page.waitForTimeout(milliseconds);
    }
}
