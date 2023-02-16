export class CreditCardPage {

    /**
     * 
     * @param {import("../browser").Browser} browser
     * @param {import("simplified-logger").Logger} logger
     */
    constructor(browser, logger) {
        this.browser = browser;
        this.logger = logger;
    }

    async checkCreditCardSituation(page, account) {

        await Promise.all([
            page.isSelectorPresent("#aMenuLink"),
        ]);

        await Promise.all([
            page.click("#aMenuLink"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("a[title*='Cartão de Crédito']"),
        ]);

        await Promise.all([
            page.click("a[title*='Cartão de Crédito']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("a[title*='Cartão de Crédito']"),
        ]);

        await Promise.all([
            page.click("a[title*='Cartão de Crédito']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("#cpftdor"),
        ]);

        await Promise.all([
            page.click("#cpftdor"),
            page.type("#cpftdor", account._result.cpfCliente),
            page.setSelectValue("#cmbTipoCartao", "9"),
        ]);

        await Promise.all([
            page.click("a[title*='Consultar cliente']")
        ]);

        await Promise.all([
            page.setSelectValue("#cmbEnderecoFaturaSimples", "1"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.setSelectValue("#cmbBandeiraCartaoCreditoSimples", "7"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.setSelectValue("#cmbVarianteCartaoCreditoSimples", "23"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.setSelectValue("#cmbCartaoAdcional", "N"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.setSelectValue("#cmbDataVencimentoCartaoSimples", "12"),
            page.setSelectValue("#cmbTipoEnvioFatura-sim", "4")
        ]);

        await Promise.all([
            page.click("#limiteCartaoSimples"),
            page.type("#limiteCartaoSimples", account._result.creditCard.financingValue),
        ]);

        await Promise.all([
            page.click(".btn-azul[title*='Solicita']")
        ]);
    }
}