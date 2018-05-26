//////////////////
// Imports      //
//////////////////

import {objectReducer} from '../../helpers/Redux';
import player, {DEFAULT_STATE as DEFAULT_PLAYER_STATE} from './player';


//////////////////
// Default      //
//////////////////



//////////////////
// Action types //
//////////////////

export const ADD_PLAYER = 'players/ADD_PLAYER';


/////////////////
// Actions     //
/////////////////

export function addPlayer(id, data) {
  return {
    type: ADD_PLAYER,
    id: id.toString(),
    data
  };
}


////////////////
// Reducer/s  //
////////////////

export default objectReducer(DEFAULT_PLAYER_STATE, player, {
  idProp: 'id',
  edit: [ADD_PLAYER]
});


////////////////
// Helpers    //
////////////////
