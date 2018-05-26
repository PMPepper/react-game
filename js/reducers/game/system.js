//////////////////
// Imports      //
//////////////////

//import {combineReducers} from 'redux';
//import {assignPropReducer, objectReducer} from '../../helpers/Redux';
import {ADD_SYSTEM} from './systems';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  primary: null,
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
    case ADD_SYSTEM:
      return {id: action.id, ...action.data};
  }

  return state;
}


////////////////
// Helpers    //
////////////////
