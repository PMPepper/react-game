//////////////////
// Imports      //
//////////////////

import {ADD_JUMP_LOCATION} from './jumpLocations';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  jumpLocationId: null,
  isJumpPoint: false,
  destinationSystemId: null,
  destinationJumpId: null,
  x: 0,
  y: 0
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
    case ADD_JUMP_LOCATION:
      return {id: action.id, ...action.data};
  }

  return state;
}


////////////////
// Helpers    //
////////////////
