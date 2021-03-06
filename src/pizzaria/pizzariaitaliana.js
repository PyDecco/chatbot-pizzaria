/**
 * Arquivo> pizzaria/pizarriaItaliana.js
 * Data: 10/06/2020
 * Descrição: Desenvolvimento de um chatBot de pedido de pizzas integrado com o luis.ai
 * Author: André Urpia 
 * */

require('dotenv-extend').load({
  path: "../.env"
}); 

const restify = require('restify');
const builder = require('botbuilder');
const moment = require('moment');

const server =restify.createServer();

//configuração do chatBot
let connector = new builder.ChatConnector({
  appId: "",
  appPassord: ""
});


let bot = new builder.UniversalBot(connector);

// Configuração do LUIS: 
let recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
let intents = new builder.IntentDialog({ recognizers: [recognizer]})

// configuração dos 'intents' (Intenções) :

// Endpoint - Saudar ;

intents.matches('Saudar', (session, results)=> {
  session.send('Oi! Tudo bem? Em que posso ajudar?');
});

intents.matches('Pedir', [
  (session, args, next) =>{
    var pizzas = [
      "Quatro Queijos",
      "Calabresa",
      "Frango Catupiry",
      "Portuguesa",
      "Mussarela",
      "Especial da casa",
      "Romeu e Julieta",
      "Baiana"
    ];

    let entityPizza = builder.EntityRecognizer.findEntity(args.entities, 'Pizza');


    // Fazer um match da escolha da pizza que o usuario fez:
    if(entityPizza){
      var match = builder.EntityRecognizer.findBestMatch(pizzas, entityPizza.entity);
    }
    if(!match){
      builder.Propmpts.choice(session,'No momento só temos essas pizzas! Qual você gostaria de pedir?', pizzas);
    } else{
      next({ response: match});
    }
  },
  (session, results) => {
    if ( results.response){
      // Aqui é para indicar em quanto tempo chegará o pedido da pizza do usuario
      var time = moment().add(30,'m');

      session.dialogData.time = time.format('HH:mm');
      session.send("Perfeito! sua pizza de **%s** chegará as **%s**", results.response.entity,dialogData.time);
    } else{
      session.send('Sem problemas! Se não gostarem, podem pedir numa proxima vez!');
    }
  }
]);

//Endpoint - Cancelar; 

intents.matches('Cancelar', (session, results) => {
  session.send('Pedido cancelado com sucesso! Muito Obrigado(o)');
});

//Endpoint - Verificar:
intents.matches('Verificar',(session, results)=>{
  session.send('Sua pizza chegara as **%s**', session.dialogData.time)
});

// Endpoint - default:
let teste = intents.onDefault(
  builder.DialogAction.send('Desculpe! Mas, não entendi o que você quis dizer')
);

bot.dialog('/', intents);

// Configuração do servidor via restify:
server.post ('/api/messages', connector.listen())

server.listen(process.env.port || process.env.PORT|| 3978, () => {
  console.log('Aplicação está sendo executada na porta %s', server.name, server.url);
});

