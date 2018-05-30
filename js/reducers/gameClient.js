//////////////////
// Imports      //
//////////////////




//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {};


//////////////////
// Action types //
//////////////////

const UPDATE = 'gameClient/UPDATE'


/////////////////
// Actions     //
/////////////////

export function update(data) {
  return {
    type: UPDATE,
    data
  };
}


////////////////
// Reducer/s  //
////////////////

export default function (state = DEFAULT_STATE, action) {
  if(action.type === UPDATE) {
    return action.data;
  }

  return state;
}


////////////////
// Helpers    //
////////////////
