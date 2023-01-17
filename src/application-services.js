import { levels, Logger } from "simplified-logger";
import { AmqpServer } from "./amqp-server.js";
import { Browser, Page } from "./browser.js";
import { CacheWarmer } from "./cache-warmer.js";
import { AccountConsumer } from "./queue/consumer/account-consumer.js";
import { AccountRpaStateConsumer } from "./queue/consumer/account-rpa-state-consumer.js";
import { AccountPublisher } from "./queue/publisher/account-publisher.js";
import { AccountService } from "./service/account-service.js";
import { AccountRepository } from "./repository/account-repository.js"
import { LoginPage } from "./page/loginPage.js";
import { CrotPage } from "./page/crotPage.js";
import { CreditCardPage } from "./page/creditCardPage.js";
import { CheckCrotAndCreditPage } from "./page/checkCrotAndCreditPage.js";

export default {
    "app.config.env": () => {
        let appEnv = "dev";
        if ("prod" == process.env.APP_ENV) {
            appEnv = "prod";
        }

        return appEnv;
    },
    "app.cache": async c => {
        return await CacheWarmer.execute();
    },
    "app.logger": async c => {
        const appEnv = await c.get("app.config.env");
        let loggerLevel = levels.DEBUG;
        if ("prod" == appEnv) {
            loggerLevel = levels.INFO;
        }

        return new Logger("rpa_create_account_sicaq", loggerLevel);
    },
    "app.config.amqp": () => {
        return {
            hostname: process.env.RABBITMQ_HOST,
            port: process.env.RABBITMQ_PORT,
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASS,
            vhost: process.env.RABBITMQ_VHOST
        };
    },
    "app.amqp-server": async c => {
        const config = await c.get("app.config.amqp");
        const prefetch = parseInt(process.env.RABBITMQ_PREFETCH);
        const logger = await c.get("app.logger");

        return new AmqpServer(config, prefetch, logger);
    },
    "app.config.queue.result-publisher.queue-name": async c => {
        return process.env.ACCOUNT_DONE_QUEUE_NAME;
    },
    "app.queue.account-publisher": async c => {
        const amqpServer = await c.get("app.amqp-server");
        const queueName = await c.get("app.config.queue.result-publisher.queue-name");
        const logger = await c.get("app.logger");

        return new AccountPublisher(amqpServer, queueName, logger);
    },
    "app.config.queue.consumer.simulation.queue-name": async c => {
        return process.env.ACCOUNT_CONSUME_QUEUE_NAME;
    },
    "app.queue.account-consumer": async c => {
        const amqpServer = await c.get("app.amqp-server");
        const queueName = await c.get("app.config.queue.consumer.simulation.queue-name");
        const accountResultPublisher = await c.get("app.queue.account-publisher");
        const logger = await c.get("app.logger");

        return new AccountConsumer(amqpServer, queueName, accountResultPublisher, logger);
    },
    "app.browser": async c => {
        const headless = "true" == process.env.BROWSER_HEADLES;
        const defaultTimeout = process.env.BROWSER_DEFAULT_TIMEOUT;

        return new Browser(headless, defaultTimeout);
    },
    "app.service.account": async c => {
        const browser = await c.get("app.browser");
        const cache = await c.get("app.cache");
        const logger = await c.get("app.logger");
        const accountRepository = new AccountRepository();
        const crotPage = new CrotPage(browser,logger);
        const creditCardPage = new CreditCardPage(browser, logger);
        const checkCrotAndCreditCardPage = new CheckCrotAndCreditPage(browser, logger);
        const loginPageSicaq = new LoginPage(browser, logger, crotPage, creditCardPage, checkCrotAndCreditCardPage);
        
        return new AccountService(browser, cache, logger, accountRepository, loginPageSicaq);
    },
    "app.config.queue.consumer.rpa-state.exchange-name": async c => {
        return process.env.ACCOUNT_RPA_STATE_EXCHANGE_NAME;
    },
    "app.queue.account-rpa-state-consumer": async c => {
        const amqpServer = await c.get("app.amqp-server");
        const exchangeName = await c.get("app.config.queue.consumer.rpa-state.exchange-name");
        const cache = await c.get("app.cache");
        const logger = await c.get("app.logger");

        return new AccountRpaStateConsumer(amqpServer, exchangeName, cache, logger);
    }
};
