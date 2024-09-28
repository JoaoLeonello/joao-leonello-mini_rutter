FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 3000
EXPOSE 9229

CMD ["sh", "-c", "npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/config/ormConfig.ts && npm run dev"]
