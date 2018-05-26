//////////////////
// Imports      //
//////////////////

import {objectReducer} from '../../helpers/Redux';
import system, {DEFAULT_STATE as DEFAULT_SYSTEM_STATE} from './system';


//////////////////
// Default      //
//////////////////



//////////////////
// Action types //
//////////////////

export const ADD_SYSTEM = 'systems/ADD_SYSTEM';


/////////////////
// Actions     //
/////////////////

export function addSystem(id, data) {
  return {
    type: ADD_SYSTEM,
    id: id.toString(),
    ...data
  };
}


////////////////
// Reducer/s  //
////////////////

export default objectReducer(DEFAULT_SYSTEM_STATE, system, {
  idProp: 'id',
  edit: [ADD_SYSTEM]
});


////////////////
// Helpers    //
////////////////
