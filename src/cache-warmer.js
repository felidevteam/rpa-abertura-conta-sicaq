import axios from "axios";
import { Cache } from "./cache.js";

export class CacheWarmer {
    static async execute() {
        const cache = new Cache();

        // let url = `http://${process.env.RPA_MANAGER_HOST}:${process.env.RPA_MANAGER_PORT}/rpa-manager/rpa/${process.env.RPA_ACCOUNT_ID}`;
        // let result = await axios.get(url);
        cache.setItem("is-active", true);

        // url = `http://${process.env.RPA_MANAGER_HOST}:${process.env.RPA_MANAGER_PORT}/rpa-manager/login/unico/rpa/${process.env.RPA_ACCOUNT_ID}`;
        // result = await axios.get(url);
        // cache.setItem("ir-url", result.data.link);

        return cache;
    }
}
