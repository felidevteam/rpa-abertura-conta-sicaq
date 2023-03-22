export class Account {
    statusOverDraft: String;
    cpfCliente: String;
    financingValue: String;

    getAccountResult(): AccountResult;
    setAccountResult(Account: AccountResult): void;
    setCrotResult(AccountCrot: AccountResult): void;
    setCorrespondent(AccountCorrespondent: AccountResult): void;
    addCreditCart(AccountCreditCard: AccountResult): void;
;}
