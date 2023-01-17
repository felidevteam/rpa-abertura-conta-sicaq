import axios from "axios";

/**
 * @param {import("../browser").Page} page 
 * @returns {Promise<string>}
 */
export async function irCaptchaCode(page) {
    const base64 = await page.native(async () => {
        const img = document.getElementById("imgCaptcha");
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        const base64 = canvas.toDataURL("image/png");

        return base64
            .replace(/^data:image\/(png|jpg);base64,/, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    });
    const resultRecaptchaCode = await axios.post(process.env.CAPTCHA_RESOLVER_HOST, {
        image: base64,
    });

    return resultRecaptchaCode.data.result;
}
