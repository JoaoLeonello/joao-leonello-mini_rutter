# Dockerfile
FROM node:lts

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Instalar TypeScript e compilar o código
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Expor a porta da aplicação
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
