import * as Server from './server/Server';
import MessageTypes from './consts/MessageTypes';

function sendMessageToPlayer(playerId, message) {
  //send message to a player (if using worker then always send to the same client)
  postMessage({playerId, ...message});
}

function confirmMessageComplete(message, data = null) {
  if(message.id) {
    postMessage({
      type: MessageTypes.COMPLETE,
      replyId: message.id,
      data
    });
  }
};

Server.initialise(sendMessageToPlayer)

//Process recieved messages
onmessage = function(e) {
  const message = e.data;

  switch(message.type) {
    case MessageTypes.CREATE_WORLD:
      const createdFactions = Server.createWorld(message.data);

      confirmMessageComplete(message, createdFactions);
      return;
    case MessageTypes.CONNECT_PLAYER:
      //Other server connectors would need to record details about the connected
      //player, but worker always sends the messages to the same client
      Server.connectedPlayer(message.data.playerId);

      confirmMessageComplete(message);
      return;
    case MessageTypes.ADD_PLAYER_ORDERS:
      Server.addPlayerOrders(message.data.playerId, message.data.orders);
    case MessageTypes.REQUEST_PLAYER_STATE:
      const playerState = Server.getStateForPlayer(message.data.playerId);

      sendMessageToPlayer(message.data.playerId, {
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
      console.log('Unknown message: ', message);
      return;
  }
}




//Finally tell the client the worker is loaded
postMessage({type: MessageTypes.INITIALISED});
