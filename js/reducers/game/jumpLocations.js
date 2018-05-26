//////////////////
// Imports      //
//////////////////

import {objectReducer} from '../../helpers/Redux';
import jumpLocation, {DEFAULT_STATE as DEFAULT_JUMP_LOCATION_STATE} from './jumpLocation';


//////////////////
// Default      //
//////////////////

const DEFAULT_STATE = {};


//////////////////
// Action types //
//////////////////

export const ADD_JUMP_LOCATION = 'systemBodies/ADD_JUMP_LOCATION';


/////////////////
// Actions     //
/////////////////

export function addJumpLocation(id, data) {
  return {
    type: ADD_JUMP_LOCATION,
    id: id.toString(),
    data
  };
}


////////////////
// Reducer/s  //
////////////////

export default objectReducer(DEFAULT_JUMP_LOCATION_STATE, jumpLocation, {
  idProp: 'id',
  edit: [ADD_JUMP_LOCATION]
});


////////////////
// Helpers    //
////////////////
