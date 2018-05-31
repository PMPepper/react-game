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

//Helpers
import {objFilter, mapObj} from '../helpers/Object';
import {arrayHasIntersection} from '../helpers/Array';

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
  const gameState = store.getState().game;
  const playerFactionIds = Object.keys(gameState.factionPlayer.playerFaction[playerId]);

  return {
    time: gameState.time,

    factions: objFilter(gameState.factions, (key, value, obj) => (playerFactionIds.includes(key))),
    players: gameState.players,

    factionPlayer: filterFactionStateByFactions(playerFactionIds, gameState.factionPlayer, 'factionPlayer', 'playerFaction'),

    //filter by faction
    systems: filterStateByFactions(playerFactionIds, gameState.systems, gameState.factionSystem.systemFaction),
    systemBodies: filterStateByFactions(playerFactionIds, gameState.systemBodies, gameState.factionSystemBody.systemBodyFaction),

    factionSystem: filterFactionStateByFactions(playerFactionIds, gameState.factionSystem, 'factionSystem', 'systemFaction'),
    factionSystemBody: filterFactionStateByFactions(playerFactionIds, gameState.factionSystemBody, 'factionSystemBody', 'systemBodyFaction'),

    //TODO add 'known factions' (and who controls them?)
    //TODO add 'known names' e.g. faction 1 knows what faction 2 calls a body...?
    //TODO
    jumpLocations: {}
  };
}

function filterStateByFactions(factionIds, state, factionsStates) {

  return objFilter(state, (id, value, obj) => {
    const factionState = factionsStates[id];
    const stateFactionIds = Object.keys(factionState);

    return arrayHasIntersection(factionIds, stateFactionIds);
  });
}

function filterFactionStateByFactions(factionIds, factionState, key1, key2) {
  return {
    [key1]: objFilter(factionState[key1], (factionId, value, obj) => {
      return factionIds.includes(factionId);
    }),
    [key2]: mapObj(objFilter(factionState[key2], (stateId, value, obj) => {
      return arrayHasIntersection(factionIds, Object.keys(value));
    }), (value, key, obj) => {
      return objFilter(value, (factionId, value, obj) => {
        return factionIds.includes(factionId);
      });
    }),
  }
}

export function addPlayerOrders(playerId, orders) {
  //TODO
}
