#Adaptar o código abaixo para nosso código
# criar imagem do projeto no azure hub ou doker hub
#img para publicar o projeto
FROM node:16-alpine

#Diretório de trabalho dentro do contêiner
WORKDIR usr/src/app

#Copiar arquivos de dependência e instalar as dependencias
COPY package*.json ./
RUN npm install

#Copiar os arquivos restantes da aplicação para o diretório de trabalho
COPY ..

#Expor a porta que a aplicação usará 
EXPOSE 80

#Comando para executar a aplicação
CMD ["node", "server.js"]

#posso gerar uma imgem  a partir do termninal para baixar na maquina e subir no servido
# docker build -t test .