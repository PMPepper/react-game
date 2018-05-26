//////////////////
// Imports      //
//////////////////

import {ADD_PLAYER} from './players';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  playerId: null,
  name: null
};


//////////////////
// Action types //
//////////////////




/////////////////
// Actions     //
/////////////////




////////////////
// Reducer/s  //
////////////////

export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case ADD_PLAYER:
      return {id: action.id, ...action.data};
  }

  return state;
}


////////////////
// Helpers    //
////////////////
