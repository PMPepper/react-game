import * as Server from './server/Server';
import MessageTypes from './consts/MessageTypes';


//send message to a player (if using worker then always send to the same client)
const sendMessageToPlayer = postMessage;


function confirmMessageComplete(message, data = null) {
  if(message.id) {
    postMessage({
      playerId: message.playerId,
      type: MessageTypes.COMPLETE,
      replyId: message.id,
      data
    });
  }
};


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
      confirmMessageComplete(message, Server.getStateForPlayer(message.data.playerId));

      //Mark player as connected
      Server.connectedPlayer(message.data.playerId);

      return;
    case MessageTypes.ADD_PLAYER_ORDERS:
      Server.addPlayerOrders(message.data.playerId, message.data.orders);
    case MessageTypes.REQUEST_PLAYER_STATE:
      const playerState = Server.getStateForPlayer(message.data.playerId);

      sendMessageToPlayer({
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
      console.log('Unknown message: ', message);
      return;
  }
}

//Start the server
Server.initialise(sendMessageToPlayer);


//Finally tell the client the worker is loaded
//postMessage({type: MessageTypes.INITIALISED});
