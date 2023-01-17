import axios from 'axios'

export class AccountRepository {

    constructor() {
        this.rpaManagerHost = process.env.RPA_MANAGER_HOST
        this.rpaManagerPort = process.env.RPA_MANAGER_PORT
    }

    async getLoginsRpaAberturaConta() {
        const getStatusHost = `http://${this.rpaManagerHost}:${this.rpaManagerPort}/rpa-manager/login/caixa_aqui`;
        let result = await axios.get(getStatusHost);
        return result;
    }
}