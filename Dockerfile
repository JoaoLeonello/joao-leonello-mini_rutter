FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY tsconfig.json ./
COPY src ./src

COPY ./scripts/wait-for-it.sh /usr/src/app/scripts/wait-for-it.sh
RUN chmod +x /usr/src/app/scripts/wait-for-it.sh

RUN npm run build

EXPOSE 3000
EXPOSE 9229

# Wait for MySQL be available, run migrations and start
CMD ["/usr/src/app/scripts/wait-for-it.sh", "mysql:3306", "--", "sh", "-c", "npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/config/typeOrmConfig.ts && npm run dev"]