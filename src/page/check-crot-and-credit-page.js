export class CheckCrotAndCreditPage {

    /**
     * 
     * @param {import("../browser").Browser} browser
     * @param {import("simplified-logger").Logger} logger
     */
    constructor(browser, logger) {
        this.browser = browser;
        this.logger = logger;
    }

    async checkCrotAndCreditCard (account, page ) {
        let approvalStatusCrot = null;
        let crotFinancingValue = null;
        let financingValueFormatted = null;
        let approvalStatusCC = null;
        let creditCardFinancingValue = null;

        await this.navigateSearchForms(page); 
        await this.searchFormsByCPF(page, account.customerHighestIncome.cpf);

        if(account.statusCrot){
            await this.getInfosCrot(page, account, approvalStatusCrot, crotFinancingValue, financingValueFormatted);            
        }

        if(account.statusCreditCard) {
            await this.getInfosCreditCard(page, account, approvalStatusCC, creditCardFinancingValue);
            if (!!account.costumerSecondChoice || account.costumerSecondChoice !== null) {
                await this.searchFormsByCPF(page, account.costumerSecondChoice.cpf);
                await this.getInfosCreditCard(page, account, approvalStatusCC, creditCardFinancingValue);
            }
            this.logger.info("account", account);
        }
    }

    async navigateSearchForms(page) {
        await Promise.all([
            page.isSelectorPresent("#menu-principal"),
            page.isSelectorPresent("a[title='Serviços ao Cliente']")
        ]);

        await Promise.all([
            page.click("a[title='Serviços ao Cliente']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("a[title='Negócios']")
        ]);

        await Promise.all([
            page.click("a[title='Negócios']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ])
    
        await Promise.all([
            page.isSelectorPresent("a[title='Formulários Enviados']"),
            page.isSelectorPresent("a[title='Abertura de Contas']")
        ]);

        await Promise.all([
            page.click("a[title='Formulários Enviados']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent(".explicaCampo"),
            page.isSelectorPresent("#cpfCliente"),
            page.isSelectorPresent("a[title='Consultar']")
        ]);
    }

    async searchFormsByCPF(page, cpf) {
        await Promise.all([
            page.click("#cpfCliente"),
            page.type("#cpfCliente", cpf)
        ]);

        await Promise.all([
            page.click("a[title='Consultar']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);
    }

    async getInfosCrot(page, account, approvalStatusCrot, crotFinancingValue, financingValueFormatted) {
        await Promise.all([
            page.isXpathPresent("//*[contains(text(),'Cheque')]/following-sibling::td/a[contains(text(),'Avaliação')]")
        ]);

        await Promise.all([
            page.clickByXpath("//*[contains(text(),'Cheque')]/following-sibling::td/a[contains(text(),'Avaliação')]"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("td.header")
        ]);

        await Promise.all([
            approvalStatusCrot = await page.innerText(".header"),
            crotFinancingValue = await page.innerTextByXpath("//td[contains(text(),'Valor Financiamento')]/following-sibling::td[1]")
        ])
        
        financingValueFormatted = parseInt(crotFinancingValue.replace(/\./g, ''));

        if(financingValueFormatted > 200 ) {
            let newValue = financingValueFormatted / 50;
            let newValueRound = Math.floor(newValue);
            financingValueFormatted = newValueRound * 50; 
        }
        account.setCrotResult({
            crot: {
                approvalStatus: approvalStatusCrot,
                financingValue: crotFinancingValue,
                financingValueFormatted: `${financingValueFormatted.toString()},00`
            }
        });

        await Promise.all([
            page.click("a[title*='Voltar']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

    }

    async getInfosCreditCard(page, account, approvalStatusCC, creditCardFinancingValue) {
        await Promise.all([
            page.isXpathPresent("//*[contains(text(),'Cartão')]/following-sibling::td/a[contains(text(),'Avaliação')]")
        ]);

        await Promise.all([
            page.clickByXpath("//*[contains(text(),'Cartão')]/following-sibling::td/a[contains(text(),'Avaliação')]"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("td.header")
        ]);

        await Promise.all([
            approvalStatusCC = await page.innerText(".header"),
            creditCardFinancingValue = await page.innerTextByXpath("//td[contains(text(),'Valor Financiamento')]/following-sibling::td[1]")
        ])
        account.addCreditCart({
                approvalStatus: approvalStatusCC,
                financingValue: creditCardFinancingValue
        });
        
        await Promise.all([
            page.click("a[title*='Voltar']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);
    }
}