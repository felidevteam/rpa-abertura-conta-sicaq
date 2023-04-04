import { fileFromPath } from "formdata-node/file-from-path"
import axios from 'axios';

export async function uploadAttachPdf(cliente_id, attach, typeDocumentId) {
    const baseAttachURL = `https://api.feli.com.br/v1/apan/clientes/${cliente_id}/anexos`;

    const data = new FormData();
    data.append("documentos[][tipo_documento_id]", typeDocumentId);
    data.append("documentos[][arquivo]", await fileFromPath(attach));

    await axios.post(
        baseAttachURL,
        data
    );
}