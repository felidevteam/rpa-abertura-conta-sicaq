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

    async createCreditCard(page, account) {

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
            page.type("#cpftdor", account.customerHighestIncome.cpf),
            page.setSelectValue("#cmbTipoCartao", "9"),
        ]);

        await Promise.all([
            page.click("a[title*='Consultar cliente']")
        ]);

        if(!!account.customerSecondChoice){
            await this.createAdditionalCard(page, account.customerSecondChoice.cpf, account.customerSecondChoice.shortName);
        }

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
            page.type("#limiteCartaoSimples", account.creditCards[0].financingValue),
        ]);

        await Promise.all([
            page.click(".btn-azul[title*='Solicita']")
        ]);

        await Promise.all([
            page.click("a[title*='Imprimir'")
        ]);
    }

    async createAdditionalCard(page, cpf, shortName) {
        await Promise.all([
            page.isSelectorPresent("#cmbCartaoAdcional")
        ]);

        await Promise.all([
            page.setSelectValue("#cmbCartaoAdcional", "S")
        ]);

        await Promise.all([
            page.click("#numeroCpf1"),
            page.type("#numeroCpf1", cpf)
        ]);

        await Promise.all([
            page.click("a[title*='Consultar CPF']")
        ])

        await Promise.all([
            page.click("#nomeReduzido1"),
            page.type("#nomeReduzido1", shortName)
        ]);

        await Promise.all([
            page.setSelectValue("#cmbGrauParentesco", "1")
        ]);

        await Promise.all([
            page.click("a[title='Inserir']")
        ]);
    }
}