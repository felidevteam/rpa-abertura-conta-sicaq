export class AccountService {
    /**
     * @param {import("../browser").Browser} browser
     * @param {import("../cache").Cache} cache
     * @param {import("simplified-logger").Logger} logger
     * @param {import("../repository/account-repository").AccountRepository} accountRepository 
     * @param {import("../page/login-page").LoginPage} loginPage
     */
    constructor(browser, cache, logger, accountRepository, loginPage) {
        this.browser = browser;
        this.cache = cache;
        this.logger = logger.withLabel("abertura_conta_sicaq_checker");
        this.accountRepository = accountRepository;
        this.loginPage = loginPage;
    }

    async checkAccountOverDraft(account) {
        this.logger.info("Iniciado consulta no site do Sicaq", account);

        const loginResult = await this.accountRepository.getLoginsRpaAberturaConta();

        return await this.loginPage.login(account, loginResult)
    }
}