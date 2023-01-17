export class AccountService {
    /**
     * @param {import("../browser").Browser} browser
     * @param {import("../cache").Cache} cache
     * @param {import("simplified-logger").Logger} logger
     * @param {import("../repository/account-repository").AccountRepository} accountRepository 
     * @param {import("../page/loginPage").LoginPage} loginPage
     */
    constructor(browser, cache, logger, accountRepository, loginPage) {
        this.browser = browser;
        this.cache = cache;
        this.logger = logger.withLabel("abertura_conta_sicaq_checker");
        this.accountRepository = accountRepository;
        this.loginPage = loginPage;
    }

    async checkAccountOverDraft(jsonMessage) {
        this.logger.info("Iniciado consulta no site do Sicaq", jsonMessage);

        const loginResult = await this.accountRepository.getLoginsRpaAberturaConta();

        this.jsonMessage = jsonMessage;

        return await this.loginPage.login(this.jsonMessage, loginResult)
    }
}