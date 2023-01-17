import { CacheItemNotFoundError } from "./error/cache-item-not-found-error.js";

export class Cache {
    constructor() {
        this._memory = [];
    }

    /**
     * @param {string} id 
     * @return {any}
     */
    getItem(id) {
        const itemIndex = this._memory.findIndex(i => i.id == id);
        if (0 <= itemIndex) {
            return this._memory[itemIndex].value;
        }

        throw new CacheItemNotFoundError(id);
    }

    /**
     * @param {string} id 
     * @param {any} value 
     */
    setItem(id, value) {
        const itemIndex = this._memory.findIndex(i => i.id == id);
        if (0 <= itemIndex) {
            this._memory.splice(itemIndex, 1);
        }
        this._memory.push({ id, value });
    }
}
