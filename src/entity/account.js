
export const AccountResult = {
    idCostumerHigestIncome: null,
    cpfCostumerHigestIncome: null,
    cpfCostumerSecondChoice: null,
    statusCrot: null,
    statusCreditCard: null,
    correspondent: {
        id: null,
        code: null,
        login: null,
        password: null
    },
    crot: {
        approvalStatus: null,
        financingValue: null,
        financingValueFormatted: null
    },
    creditCards:[ 
        {
            approvalStatus: null,
            financingValue: null
        }
    ]

}

export class Account {
    constructor() {
    }

    getAccountResult() {
        return AccountResult;
    }

    setAccountResult(accountResult) {
        this.AccountResult = accountResult;
    }

    setCrotResult(crot) {
        this.crot = crot;
    }

    addCreditCart(creditCard) {
        this.creditCards.push(creditCard);
    }
}
