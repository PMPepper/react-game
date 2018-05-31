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
import {advanceTime} from '../reducers/game';

//Helpers
import {objFilter, mapObj, objForEach} from '../helpers/Object';
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
let gameLoopIntervalId;


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
    connectedPlayers: Object.values(serverState.players).filter(player => (player.isConnected)).map(player => ({id: player.id, name: player.name})),
    pendingPlayers: Object.values(serverState.players).filter(player => (!player.isConnected)).map(player => ({id: player.id, name: player.name}))
  });

  if(Object.values(serverState.players).every(player => (player.isConnected))) {
    allPlayersConnected();
  }
}

function allPlayersConnected() {
  sendMessageToAllPlayers({
    type: MessageTypes.ALL_PLAYERS_CONNECTED
  });

  //Start running the actual game
  serverPhase = 'active';

  gameLoopIntervalId = setInterval(gameLoop, 1000 / 60);
}

export function getStateForPlayer(playerId) {
  const gameState = store.getState().game;
  const playerFactionIds = Object.keys(gameState.factionPlayer.playerFaction[playerId]);

  return {
    playerId,
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

export function gameLoop() {
  advanceGameTime(3600);

  //Send updated state to all the connected players
  const state = store.getState();

  objForEach(state.server.players, (player) => {
    sendMessageToPlayer(
      player.id,
      {
        type: MessageTypes.UPDATE_PLAYER_STATE,
        data: getStateForPlayer(player.id)
      }
    );
  });
}

export function advanceGameTime(amount) {
  store.dispatch(advanceTime(amount));
}



//Internal helpers
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
