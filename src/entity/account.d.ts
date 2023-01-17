export class Account {
    statusOverDraft: String;
    cpfCliente: String;
    financingValue: String;

    getAccountResult(): AccountResult;
    setAccountResult(AccountState: AccountResult): void;
}
