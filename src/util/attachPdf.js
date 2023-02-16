import axios from 'axios';

export async function uploadAttachPdf(cliente_id, attach, typeDocumentId) {
    const baseAttachURL = `https://crosis.feli.com.vc/v1/apan/clientes/${cliente_id}/anexos`;

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };
    
    let body = {
        "documentos": [
            {
                "tipo_documento_id": typeDocumentId,
                "arquivo": attach
            }
        ]
    };

    const result = axios.post(baseAttachURL, body, headers)
    console.log(result.data);

}

export async function downloadAttachPdf(urls, )
