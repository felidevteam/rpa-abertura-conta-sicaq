import { Application } from "./src/application.js";
import { Container } from "./src/container.js";
import applicationServices from "./src/application-services.js";
import "dotenv/config";

(async () => {
    const container = new Container(applicationServices);
    const app = new Application(container);
    await app.boot();
})();
