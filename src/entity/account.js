        // this.idCostumerHigestIncome = null,
        // this.cpfCostumerHigestIncome = null,
        // this.cpfCostumerSecondChoice = null,
        // this.statusCrot = null,
        // this.statusCreditCard = null,
        // this.correspondent = {
        //     id: null,
        //     code: null,
        //     login: null,
        //     password: null
        // },
        // this.crot = {
        //     approvalStatus: null,
        //     financingValue: null,
        //     financingValueFormatted: null
        // },
        // this.creditCards = [ 
        //     {
        //         approvalStatus: null,
        //         financingValue: null
        //     }
        // ]

export class Account {
    constructor(customerHighestIncome, customerSecondChoice, statusCrot, statusCreditCard) {
        this.customerHighestIncome = customerHighestIncome,
        this.customerSecondChoice = customerSecondChoice,
        this.statusCrot = statusCrot,
        this.statusCreditCard = statusCreditCard,
        this.correspondent = {},
        this.crot = {},
        this.creditCards = []
    }

    getAccountResult() {
        return this;
    }

    setCorrespondent(correspondent) {
        this.correspondent = correspondent;
    }

    setCrotResult(crot) {
        this.crot = crot;
    }

    addCreditCart(creditCard) {
        this.creditCards.push(creditCard);
    }
}
