
export const AccountResult = {
    idCliente: null,
    cpfCliente: null,
    crot: {
        statusCrot: null,
        financingValue: null,
        financingValueFormatted: null
    },
    creditCard: {
        financingValue: null
    }

}

export class Account {
    constructor() {
        this._result = {
            idCliente: null,
            cpfCliente: null,
            crot: {
                statusCrot: null,
                financingValue: null,
                financingValueFormatted: null
            },
            creditCard: {
                statusCreditCard: null,
                financingValue: null
            }

        };
    }

    getAccountResult() {
        return this._result;
    }

    setAccountResult(accountResult) {
        this._result = accountResult;
    }
}
