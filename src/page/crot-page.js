export class CrotPage {

    /**
     * 
     * @param {import("../browser").Browser} browser
     * @param {import("simplified-logger").Logger} logger
     */
    constructor(browser, logger) {
        this.browser = browser;
        this.logger = logger;
    }

    async createAccountByCrot(page, account) {

        await Promise.all([
            page.isSelectorPresent("#aMenuLink")
        ]);

        await Promise.all([
            page.click("#aMenuLink"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("#menu-principal"),
            page.isSelectorPresent("a[title='Abertura de Contas']")
        ]);

        await Promise.all([
            page.click("a[title*='Abertura de Contas']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);


        await Promise.all([
            page.click("a[title*='Solicitar Contas']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.type("input[name*='numeroCpf']", account.customerHighestIncome.cpf)
        ]);

        await Promise.all([
            page.click("a[title*='Consultar']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.click("a[title*='Avançar']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        let address = null;

        await Promise.all([
            address = page.innerText("#endereco")
        ]);

        if (!address) {
            return;
        }
        await Promise.all([
            page.click("a[title*='Avançar']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("#tipoConta"),
            page.setSelectValue("#tipoConta", "1")
        ]);

        if (account.crot.approvalStatus === "Aprovada") {
            await Promise.all([
                page.setSelectValue("#contaCCheque", "S"),
                page.waitForNavigation({ waitUntil: "networkidle0" })
            ]);
            await Promise.all([
                page.click("#chequeEspecial"),
                page.type("#chequeEspecial", account.crot.financingValueFormatted)
            ])
            await Promise.all([
                page.click("#adepNAO")
            ])

        }
        if (account.crot.approvalStatus === "Reprovado") {
            await Promise.all([
                page.setSelectValue("#contaCCheque", "N"),
                page.waitForNavigation({ waitUntil: "networkidle0" })
            ]);
        }

        await Promise.all([
            page.click("a[title*='Gerar Nr Conta']"),
        ]);

        await Promise.all([
            page.click("#btnEncaminhar")
        ]);

        await Promise.all([
            page.click("a[title*='Imprimir'")
        ]);
    }

}
