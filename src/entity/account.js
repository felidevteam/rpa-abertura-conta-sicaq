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
