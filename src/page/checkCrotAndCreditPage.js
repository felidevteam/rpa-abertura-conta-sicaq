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

    async checkCrotAndCreditCard (jsonMessage, page, account) {
        let statusCrot = null;
        let crotFinancingValue = null;
        let financingValueFormatted = null;
        let statusCreditCard = null;
        let creditCardFinancingValue = null;


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

        await Promise.all([
            page.click("#cpfCliente"),
            page.type("#cpfCliente", jsonMessage.cpf_proponente)
        ]);

        await Promise.all([
            page.click("a[title='Consultar']"),
            page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        if(jsonMessage.statusCrot){
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
                statusCrot = await page.innerText(".header"),
                crotFinancingValue = await page.innerTextByXpath("//td[contains(text(),'Valor Financiamento')]/following-sibling::td[1]")
            ])
            
            financingValueFormatted = parseInt(crotFinancingValue.replace(/\./g, ''));
    
            if(financingValueFormatted > 200 ) {
                let newValue = financingValueFormatted / 50;
                let newValueRound = Math.floor(newValue);
                financingValueFormatted = newValueRound * 50; 
            }
            account.setAccountResult({
                cpfCliente: jsonMessage.cpf_proponente,
                sexoCliente: jsonMessage.sexo_proponente,
                crot: {
                    statusCrot,
                    financingValue: crotFinancingValue,
                    financingValueFormatted: `${financingValueFormatted.toString()},00`
                }
            });
    
            await Promise.all([
                page.click("a[title*='Voltar']"),
                page.waitForNavigation({ waitUntil: "networkidle0" })
            ]);
    
        }

        if(jsonMessage.statusCreditCard) {
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
                statusCreditCard = await page.innerText(".header"),
                creditCardFinancingValue = await page.innerTextByXpath("//td[contains(text(),'Valor Financiamento')]/following-sibling::td[1]")
            ])
            if (financingValueFormatted) {
                financingValueFormatted = `${financingValueFormatted.toString()},00`
            }
            account.setAccountResult({
                cpfCliente: jsonMessage.cpf_proponente,
                sexoCliente: jsonMessage.sexo_proponente,
                crot: {
                    statusCrot,
                    financingValue: crotFinancingValue,
                    financingValueFormatted
                },
                creditCard: {
                    statusCreditCard,
                    financingValue: creditCardFinancingValue
                }
            });
            
            await Promise.all([
                page.click("a[title*='Voltar']"),
                page.waitForNavigation({ waitUntil: "networkidle0" })
            ]);
        this.logger.info("account", account);

        }
    }
}