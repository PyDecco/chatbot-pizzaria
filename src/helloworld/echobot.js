//portei estes pacotes para:
const restify = require('restify'); //levantar o sevidor
const builder = require('botbuilder'); //começar a trabalhar com chat bot 



// Configuração do serve via Restify:
let server = restify.createServer();
server.listen (process.env.port || process.env.PORT || 3978, () =>{
  console.log("%s Aplicação está executando na porta %s",
    server.name,
    server.url      
  );
});

let connector = new builder.ChatConnector({
  appId: "",
  appPassword: ""
});

server.post("/api/messagens", connector.listen());//todo envio de mensagem é um post 

let bot = new builder.UniversalBot(connector, (sessions) => {
  sessions.send("você disse......: %s", session.message.text);
});