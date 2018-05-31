import MessageTypes from '../consts/MessageTypes';
import * as Server from '../server/Server';

//Reducers
import {update} from '../reducers/gameClient';


let store;
let isLoadedCallback = null;
let startGameCallback = null;
let messageIdCounter = 1;
const responses = {};


export function initialise(aStore, aIsLoadedCallback, aStartGameCallback, options = {}) {
  store = aStore;
  isLoadedCallback = aIsLoadedCallback;
  startGameCallback = aStartGameCallback;

  Server.initialise(handleMessageFromServer);

  //Finally tell the client the worker is loaded
}

export function createWorld(definition) {
  sendMessageToServer(
    MessageTypes.CREATE_WORLD,
    definition,
    ({data}) => {
      console.log('world created!: ', data);

      //now connect all players
      Object.values(data.players).forEach(player => {
        sendMessageToServer(MessageTypes.CONNECT_PLAYER, {playerId: player.id}, (message) => {
          console.log('on player connect: ', message.data)

          store.dispatch(update(player.id, message.data));
        });
      });
    }
  );
}


//Server functions
function handleMessageFromServer(message) {
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

      startGameCallback();
      break;
    case MessageTypes.UPDATE_PLAYER_STATE:
      store.dispatch(update(message.playerId, message.data));
    default:

  }
}


//Client functions

//This sends a message to the server
function sendMessageToServer(type, data, responseCallback = null) {

  if(responseCallback) {
    const id = messageIdCounter++;

    responses[id] = responseCallback;

    doSendMessageToServer({
      type,
      data,
      id
    });
  } else {
    doSendMessageToServer({
      type,
      data
    });
  }
}

//This is identical between this and worker js - should it be imported?
function doSendMessageToServer(message) {
  switch(message.type) {
    case MessageTypes.CREATE_WORLD:
      const createdFactions = Server.createWorld(message.data);

      confirmMessageComplete(message, createdFactions);
      return;
    case MessageTypes.CONNECT_PLAYER:

      //Other server connectors would need to record details about the connected
      //player, but worker always sends the messages to the same client
      confirmMessageComplete(message, Server.getStateForPlayer(message.data.playerId));

      //Mark player as connected
      Server.connectedPlayer(message.data.playerId);

      return;
    case MessageTypes.ADD_PLAYER_ORDERS:
      Server.addPlayerOrders(message.data.playerId, message.data.orders);
    case MessageTypes.REQUEST_PLAYER_STATE:
      const playerState = Server.getStateForPlayer(message.data.playerId);

      handleMessageFromServer({
        playerId: message.data.playerId,
        type: MessageTypes.UPDATE_PLAYER_STATE,
        data: playerState,
        replyId: message.id
      });
    /*case 'action':
      //store.dispatch(message.action);
      return;
    case 'actions':
      //store.dispatch(batchActions(message.actions));
      return;*/
    default:
      debugger;
      console.log('Unknown message: ', message);
      return;
  }
}

function confirmMessageComplete(message, data = null) {
  if(message.id) {
    handleMessageFromServer({
      type: MessageTypes.COMPLETE,
      replyId: message.id,
      data
    });
  }
};
