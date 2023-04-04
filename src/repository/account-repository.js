import axios from 'axios'

export class AccountRepository {

    constructor() {
        this.rpaManagerHost = process.env.RPA_MANAGER_HOST
    }

    async getLoginsRpaAberturaConta() {
        const getStatusHost = `https://${this.rpaManagerHost}/rpa-manager/login/caixa_aqui`;
        let result = await axios.get(getStatusHost);
        return result;
    }
}