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
            page.clickByXpath("//a[contains(text(),'Consultar')]"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        // TODO FAZER VERIFICAÇÃO LISTA VAZIA
        const hasCrotForm = await page.isXpathPresent("//*[contains(text(),'Cheque')]/following-sibling::td/a[contains(text(),'Avaliação')]");
        if (!hasCrotForm) {
            this.logger.error("CPF não possui formulário de cheque especial", cpf);
        }
        const hasCreditCardForm = await page.isXpathPresent("//*[contains(text(),'Cartão')]/following-sibling::td/a[contains(text(),'Avaliação')]");
        if (!hasCreditCardForm) {
            this.logger.error("cpf não possui formulário de Cartão de Crédito", cpf);
        }
    }

    async getInfosCrot(page, account, approvalStatusCrot, crotFinancingValue, financingValueFormatted) {
        await Promise.all([
            page.clickByXpath("//*[contains(text(),'Cheque')]/following-sibling::td/a[contains(text(),'Avaliação')]"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("td.header")
        ]);

        await Promise.all([
            approvalStatusCrot = await page.innerText(".header"),
        ])

        if (approvalStatusCrot === "Reprovado") {
            account.setCrotResult({
                approvalStatus: approvalStatusCrot,
                financingValue: 0,
                financingValueFormatted: 0
            })
            await Promise.all([
                page.click("a[title*='Voltar']"),
                page.waitForNavigation({ waitUntil: "networkidle0" })
            ]);
            return;
        }
            
        await Promise.all([
            crotFinancingValue = await page.innerTextByXpath("//td[contains(text(),'Valor Financiamento')]/following-sibling::td[1]")
        ])
        financingValueFormatted = parseInt(crotFinancingValue.replace(/\./g, ''));

        if(financingValueFormatted > 200 ) {
            let newValue = financingValueFormatted / 50;
            let newValueRound = Math.floor(newValue);
            financingValueFormatted = newValueRound * 50; 
        }
        account.setCrotResult({
                approvalStatus: approvalStatusCrot,
                financingValue: crotFinancingValue,
                financingValueFormatted: `${financingValueFormatted.toString()},00`
        });

        await Promise.all([
            page.click("a[title*='Voltar']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

    }

    async getInfosCreditCard(page, account, approvalStatusCC, creditCardFinancingValue) {
        await Promise.all([
            page.clickByXpath("//*[contains(text(),'Cartão')]/following-sibling::td/a[contains(text(),'Avaliação')]"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        await Promise.all([
            page.isSelectorPresent("td.header")
        ]);

        await Promise.all([
            approvalStatusCC = await page.innerText(".header"),
        ]);

        if (approvalStatusCC === "Reprovado") {
            account.addCreditCart({
                approvalStatus: approvalStatusCC,
                financingValue: 0
            });
            await Promise.all([
                page.click("a[title*='Voltar']"),
                page.waitForNavigation({ waitUntil: "networkidle0" })
            ]);
            return;
        }

        await Promise.all([
            creditCardFinancingValue = await page.innerTextByXpath("//td[contains(text(),'Valor Financiamento')]/following-sibling::td[1]")
        ]);
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