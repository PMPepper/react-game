import MessageTypes from '../consts/MessageTypes';

let worker = null;
let isLoadedCallback = null;
let messageIdCounter = 1;
const responses = {};

function onmessage(e) {
  const message = e.data;

  switch (message.type) {
    case MessageTypes.INITIALISED:
      isLoadedCallback && isLoadedCallback();
      break;
    case MessageTypes.COMPLETE:
      if(!responses.hasOwnProperty(message.replyId)) {
        throw new Error('Reply to unknown message');
      }

      //Call response handler
      responses[message.replyId](message);

      //Tidy up
      delete responses[message.replyId];
      break;
    case MessageTypes.PLAYER_IS_CONNECTED:
      console.log('Player is connected: ', message.playerId, message.connectedPlayers, message.pendingPlayers);
      break;
    case MessageTypes.ALL_PLAYERS_CONNECTED:
      console.log('all players are connected - start the game!!!!');

      break;
    default:

  }
}

export function initialise(aIsLoadedCallback, {path = '../js/worker.js'} = {}) {
  worker = new Worker(path);
  isLoadedCallback = aIsLoadedCallback;

  worker.onmessage = onmessage;
}

export function createWorld(definition) {
  sendMessage(
    MessageTypes.CREATE_WORLD,
    definition,
    ({data}) => {
      console.log('world created!: ', data);

      //now connect all players
      Object.values(data.players).forEach(player => {
        sendMessage(MessageTypes.CONNECT_PLAYER, {playerId: player.id}, (message) => {
          console.log('on player connect: ', message.data)
        });
      });
    }
  );
}

function sendMessage(type, data, responseCallback = null) {

  if(responseCallback) {
    const id = messageIdCounter++;

    responses[id] = responseCallback;

    worker.postMessage({
      type,
      data,
      id
    });
  } else {
    worker.postMessage({
      type,
      data
    });
  }
}
