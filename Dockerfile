# Dockerfile
FROM node:lts

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Instalar dependências
COPY package*.json ./


# Instalar todas as dependências, incluindo devDependencies
RUN npm install --legacy-peer-deps

# Instalar TypeScript e compilar o código
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Expor as portas da aplicação e a de depuração
EXPOSE 3000
EXPOSE 9229

# Comando para rodar a aplicação com a flag de depuração
# CMD ["node", "--inspect=0.0.0.0:9229", "dist/app.js"]
CMD ["npm", "run", "dev"]
