import "dotenv/config";
import { Application } from "./src/application.js";
import { Container } from "./src/container.js";
import applicationServices from "./src/application-services.js";

(async () => {
    const container = new Container(applicationServices);
    const app = new Application(container);
    await app.boot();
})();
