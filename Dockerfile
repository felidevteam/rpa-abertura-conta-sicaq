FROM node:18.4.0-alpine3.15
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    TZ=America/Sao_Paulo \
    APP_ENV=prod
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    tzdata
RUN mkdir -p /home/node/Downloads /home/node/app \
    && chown -R node:node /home/node
WORKDIR /home/node/app
ADD --chown=node:node . .
USER node
RUN npm install
CMD [ "node", "index.js" ]
