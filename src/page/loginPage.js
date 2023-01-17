import { Account } from "../entity/account.js";
import DateTimeTools from '../tools/datetime-tools.js'

export class LoginPage {

    /**
     * 
     * @param {import("../browser").Browser} browser
     * @param {import("simplified-logger").Logger} logger
     * @param {import("./crotPage").CrotPage} crotPage
     * @param {import("./creditCardPage").CreditCardPage} creditCardPage
     * @param {import("./checkCrotAndCreditPage").CheckCrotAndCreditPage} checkCrotAndCreditPage
     */
    constructor(browser, logger, crotPage, creditCardPage, checkCrotAndCreditPage) {
        this.browser = browser;
        this.logger = logger;
        this.crotPage = crotPage;
        this.creditCardPage = creditCardPage;
        this.checkCrotAndCreditPage = checkCrotAndCreditPage;
    }

    async login(jsonMessage, loginResult) {
        let account = new Account();
        let page = null;
        let baseHost = "https://caixaaqui.caixa.gov.br";
        let correspondenteAtual = loginResult.data.find(correspondente => correspondente.correspondente_id == jsonMessage.correspondente_id);
        if (!correspondenteAtual.bloqueado) {
            try {

                page = await this.browser.getPage();

                await this.loginSicaq(correspondenteAtual, baseHost, page);
                await this.checkCrotAndCreditPage.checkCrotAndCreditCard(jsonMessage, page, account);
                if(jsonMessage.statusCrot){
                    await this.crotPage.checkOverDraftSituation(page, account);
                }
                if(jsonMessage.statusCreditCard) {
                    await this.creditCardPage.checkCreditCardSituation(page, account);
                }


            } catch (error) {
                throw error;
            } finally {
                if(this.page) {
                    await this.page.browser.close();
                }
            }
        } else {
            await DateTimeTools.delay(10000);
            // TODO disparar aqui um log no discord
            throw new RpaAccountSicaqError("Login bloqueado", this.jsonMessage, correspondenteAtual, true);
        }

        this.logger.info("Finalizado consulta no site do Sicaq", jsonMessage);

        return account;
    }

    async loginSicaq(correspondenteAtual, baseHost, page) {

        await page.navigate(baseHost);
    
        await Promise.all([
            page.isSelectorPresent(`#convenio`),
            page.isSelectorPresent(`#login`),
            page.isSelectorPresent(`#password`)
        ]);
    
        await page.native((correspondenteAtual) => {
            document.getElementById("convenio").value = correspondenteAtual.cod_correspondente;
            document.getElementById("login").value = correspondenteAtual.login;
            document.getElementById("password").value = correspondenteAtual.senha;
    
            return Promise.resolve(true);
        }, correspondenteAtual)
    
        await page.waitTimeout(1500);
    
        await Promise.all([
            page.click("input[value='Confirma']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);
    
        await page.waitTimeout(1500);
    
        await this.checkLogin(correspondenteAtual);
    }
    
    async checkLogin(correspondenteAtual) {
        let success = true;
        try {
            const text = await page.$eval("#form-login", divs => divs.innerText)
    
            success = !(
                text.toLowerCase().includes("dados invalidos") ||
                text.toLowerCase().includes("operador bloqueado")
            );
        } catch (error) { }
    
        if (!success) {
            // correspondenteAtual.bloqueado = true;
    
            // const rpasSenhaBloqueadaQueue = await RpasSenhaBloqueadaQueueBuilder.build();
            // await rpasSenhaBloqueadaQueue.sendMessage(correspondenteAtual);
    
            // loginResult.data.forEach(correspondente => {
            //     if (correspondente.id == correspondenteAtual.id) {
            //         correspondente.bloqueado = true;
            //     }
            // });
    
            await DateTimeTools.delay(100000);
            throw new RpaAccountSicaqError("Login bloqueado", this.jsonMessage, correspondenteAtual, true);
        }
    }
}