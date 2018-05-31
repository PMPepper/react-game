console.log('reducers/server');

//////////////////
// Imports      //
//////////////////

import {ADD_PLAYER} from './game/player';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {};


//////////////////
// Action types //
//////////////////

export const PLAYER_CONNECTED = 'server/PLAYER_CONNECTED';


/////////////////
// Actions     //
/////////////////

export function playerConnected(playerId, connectionData = null) {
  return {
    type: PLAYER_CONNECTED,
    id: playerId,
    connectionData
  };
}


////////////////
// Reducer/s  //
////////////////

export default function (state = DEFAULT_STATE, action) {
  if(action.type === ADD_PLAYER) {
    return {
      ...state,
      [action.id]: {
        ...action.data,
        id: action.id,
        isConnected: false,
        connectionData: null
      }
    };
  } else if(action.type === PLAYER_CONNECTED) {
    const player = state[action.id];

    if(!player) {
      return state;
    }

    return {
      ...state,
      [action.id]: {
        ...player,
        isConnected: true,
        connectionData: action.connectionData
      }
    }
  }

  return state;
}


////////////////
// Helpers    //
////////////////
