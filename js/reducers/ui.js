//////////////////
// Imports      //
//////////////////

import {combineReducers} from 'redux';
import makeWindowingManagerReducer from './ui/makeWindowingManager';
import makeWindowReducer from './ui/makeWindow';
import makeTabsReducer from './ui/makeTabs';


//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  factionId: null,
  tick: 0
};


//////////////////
// Action types //
//////////////////

export const SET_CONTROLLED_FACTION = 'ui/SET_CONTROLLED_FACTION';
export const TICK = 'ui/TICK';


/////////////////
// Actions     //
/////////////////

export function setControlledFaction(factionId) {
  return {
    type: SET_CONTROLLED_FACTION,
    controlledFactionId: factionId.toString()
  };
}

export function tick() {
  return {
    type: TICK
  }
}


////////////////
// Reducer/s  //
////////////////

export default combineReducers({
  tick: (state = 0, action) => {
    if(action.type === TICK) {
      return state + 1;
    }

    return state;
  },
  controlledFactionId: (state = null, action) => {
    if(action.type === SET_CONTROLLED_FACTION) {
      return action.controlledFactionId;
    }

    return state;
  },
  gameWM: makeWindowingManagerReducer('ui.gameWM'),
  colonyManagement: combineReducers({
    window: makeWindowReducer('ui.colonyManagement.window'),
    tabs: makeTabsReducer('ui.colonyManagement.tabs')
  }),
  systemOverview: combineReducers({
    window: makeWindowReducer('ui.systemOverview.window')
  }),
});


////////////////
// Helpers    //
////////////////
