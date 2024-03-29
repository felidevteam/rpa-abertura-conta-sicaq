import { env } from "node:process";
import FormData from "form-data";
import fs from 'fs';
import axios from 'axios';

const _platformBasePath = env.PLATFORM_API_BASE_PATH;
const _platformApiUser = env.PLATFORM_API_USER;
const _platformApiPass = env.PLATFORM_API_PASSWORD;
let _token = { data: null, expiresAt: 0 };
async function _authToken() {
    const dt = Date.now();
    if (dt > _token.expiresAt) {
        const result = await axios.post(
            `${_platformBasePath}/login`,
            { email: _platformApiUser, password: _platformApiPass }
        );
        _token.data = result.data.access_token;
        _token.expiresAt = dt + result.data.expires_in * 1000;
    }

    return _token.data;
}

export async function uploadAttachPdf(cliente_id, filePath, fileName, typeDocumentId) {
    try {
        const baseAttachURL = `${_platformBasePath}/v1/apan/clientes/${cliente_id}/anexos`;
        const token = await _authToken();

        const data = new FormData();
        data.append("documentos[0][tipo_documento_id]", typeDocumentId);
        data.append("documentos[0][arquivo]", fs.createReadStream(filePath), fileName);

        const headers = { ...data.getHeaders(), Authorization: `Bearer ${token}`};

        const resp = await axios.post(
            baseAttachURL,
            data,
            { headers }
        );
        console.log(resp);
    } catch (e) {
        // TODO tomar a decisão correta aqui
        console.log(e);
    }
}
