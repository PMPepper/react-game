import * as Server from './server/Server';
import MessageTypes from './consts/MessageTypes';

function sendMessageToPlayer(playerId, message) {
  //send message to a player (if using worker then always send to the same client)
  postMessage({playerId, ...message});
}

function confirmMessageComplete(message) {
  if(message.id) {
    postMessage({
      type: MessageTypes.COMPLETE,
      replyId: message.id
    });
  }
};

Server.initialise(sendMessageToPlayer)

onmessage = function(e) {
  const message = e.data;

  switch(message.type) {
    case MessageTypes.CREATE_WORLD:
      Server.createWorld(message.data);

      confirmMessageComplete(message);

      //'connect' player?
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
