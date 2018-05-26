//////////////////
// Imports      //
//////////////////




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

export default function (state = DEFAULT_STATE, action) {
  switch(action.type) {
    case SET_CONTROLLED_FACTION:
      return {
        ...state,
        controlledFactionId: action.controlledFactionId
      };
    case TICK:
      return {
        ...state,
        tick: state.tick+1
      };
  }

  return state;
}


////////////////
// Helpers    //
////////////////
