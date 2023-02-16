export class Account {
    statusOverDraft: String;
    cpfCliente: String;
    financingValue: String;

    getAccountResult(): AccountResult;
    setAccountResult(Account: AccountResult): void;
    setCrot(AccountCrot: AccountResult): void;
}
