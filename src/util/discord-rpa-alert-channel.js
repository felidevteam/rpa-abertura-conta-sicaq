import { fileFromPath } from "formdata-node/file-from-path"
import axios from "axios";

export const avatar = {
    cadmut: "https://app.feli.com.br/assets/images/robots/cadmut.png",
    ciweb: "https://app.feli.com.br/assets/images/robots/ciweb.png",
    ir: "https://app.feli.com.br/assets/images/robots/ir.png",
    serasa: "https://app.feli.com.br/assets/images/robots/serasa.png"
};

export class DiscordRpaAlertChannel {
    /**
     * @param {string} username
     */
    constructor(username) {
        this._username = username;
        this._hookUrl = "https://discord.com/api/webhooks/993856018448662558/bpuMiAZrPdymDV4If_xw-aHAfPFghAg474xhbadxY_igXzQFQjyebamNg4E3S68Ih3Nn";
    }

    /**
     * @param {string} username 
     */
    withUsername(username) {
        return new DiscordRpaAlertChannel(username);
    }

    /**
     * @param {import("./discord-message-payload").DiscordMessagePayload} payload
     */
    async notificate(payload) {
        const data = new FormData();
        data.append("content", payload.content);
        data.append("username", payload.username ?? this._username);
        if (payload.avatarUrl) {
            data.append("avatar_url", payload.avatarUrl);
        }
        if (payload.files) {
            for (let i = 0; i < payload.files.length; i++) {
                data.append(`files[${i}]`, await fileFromPath(payload.files[i]));
            }
        }
        await axios.post(
            this._hookUrl,
            data
        );
    }
}
