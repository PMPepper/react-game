import {createStore, applyMiddleware} from 'redux';
import {enableBatching, batchActions} from 'redux-batched-actions';
import ReduxThunk from 'redux-thunk';

import rootReducer from './rootReducer';

import createWorldFunc from './createWorld';

//Server knows nothing about how you're talking to the players, it just has methods called and sends messages which get handled by the 'connectors', e.g. worker

//Create the store
const middlewares = [ReduxThunk];

let store = createStore(
  enableBatching(rootReducer),
  applyMiddleware.apply(this, middlewares)
);

//vars
let sendMessageToPlayer;


export function initialise(aSendMessageToPlayer) {
  sendMessageToPlayer = aSendMessageToPlayer;
}

export function createWorld(definition) {
  createWorldFunc(store, definition);

  
}

export function getStateForPlayer(playerId) {
  return {};//TODO
}

export function addPlayerOrders(playerId, orders) {
  //TODO
}
