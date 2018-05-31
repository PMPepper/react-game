console.log('Server');

import {createStore, applyMiddleware} from 'redux';
import {enableBatching, batchActions} from 'redux-batched-actions';
import ReduxThunk from 'redux-thunk';

//Consts
import MessageTypes from '../consts/MessageTypes';

//Methods
import createWorldFunc from './createWorld';

//Reducers
import rootReducer from './rootReducer';
import {playerConnected} from '../reducers/server';

//Server knows nothing about how you're talking to the players, it just has methods called and sends messages which get handled by the 'connectors', e.g. worker

//Create the store
const middlewares = [ReduxThunk];

let store = createStore(
  enableBatching(rootReducer),
  applyMiddleware.apply(this, middlewares)
);

//vars
let sendMessageToPlayer;
let sendMessageToAllPlayers;
let serverPhase = 'initialising';


export function initialise(aSendMessageToPlayer, aSendMessageToAllPlayers) {
  sendMessageToPlayer = aSendMessageToPlayer;
  sendMessageToAllPlayers = aSendMessageToAllPlayers;
}

export function createWorld(definition) {
  if(serverPhase !== 'initialising') {
    throw new Error('Can only create world while Server is in "initialising" phase');
  }

  return createWorldFunc(store, definition);

  //Now waiting for players to connect
  serverPhase = 'connecting';
}

export function connectedPlayer(playerId, connectionData = null) {
  //mark player as connected, once all connected change game phase
  store.dispatch(playerConnected(playerId, connectionData));

  //are all players connected?
  const serverState = store.getState().server;

  sendMessageToAllPlayers({
    type: MessageTypes.PLAYER_IS_CONNECTED,
    playerId,
    connectedPlayers: Object.values(serverState).filter(player => (player.isConnected)).map(player => ({id: player.id, name: player.name})),
    pendingPlayers: Object.values(serverState).filter(player => (!player.isConnected)).map(player => ({id: player.id, name: player.name}))
  });

  if(Object.values(serverState).every(player => (player.isConnected))) {
    allPlayersConnected();
  }
}

function allPlayersConnected() {
  sendMessageToAllPlayers({
    type: MessageTypes.ALL_PLAYERS_CONNECTED
  });
}

export function getStateForPlayer(playerId) {
  return {};//TODO
}

export function addPlayerOrders(playerId, orders) {
  //TODO
}
