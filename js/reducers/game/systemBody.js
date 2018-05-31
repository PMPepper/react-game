console.log('reducer/game/systemBody');

//////////////////
// Imports      //
//////////////////


import {volumeOfSphere} from '../../helpers/Maths';
import {gravityAtDistanceFromMass, escapeVelocity} from '../../helpers/Physics';
import {systemBodyPositionAtTime, systemBodySurfaceTemperature} from '../../helpers/App';

import SystemBodyTypes from '../../consts/SystemBodyTypes';

//////////////////
// Default      //
//////////////////

export const DEFAULT_STATE = {
  type: null,
  children: [],
  x: 0,
  y: 0,
  type: null,

  mass: 0,
  radius: 0,
  volume: 0,
  day: 0,
  axialTilt: 0,
  tidalLock: false,

  //calculated
  diameter: 0,
  density: 0,
  volume: 0,
  surfaceGravity: 0,
  escapeVelocity: 0,
  isColonisable: false,
  surfaceTemperature: 0,

  //sub-props
  orbit: null,//{type, maxRadius, minRadius, period}
  //regular orbit: {radius, offset}

  systemId: null,
  parentId: null,

  //star props
  luminosity: 0,


  //sub-stellar body
  albedo: 1,
  minerals: {},
  colonies: [],

  //-planet
  atmosphere: null,
};

const colonisableSystemBodyTypes = [SystemBodyTypes.PLANET, SystemBodyTypes.ASTEROID, SystemBodyTypes.COMET];


//////////////////
// Action types //
//////////////////

export const ADD_SYSTEM_BODY = 'systemBodys/ADD_SYSTEM_BODY';

export const UPDATE_SYSTEM_BODY_POSITION = 'systemBody/UPDATE_SYSTEM_BODY_POSITION';
export const UPDATE_SYSTEM_BODY_ENVIRONMENT = 'systemBody/UPDATE_SYSTEM_BODY_ENVIRONMENT';


/////////////////
// Actions     //
/////////////////

export function updateSystemBodyPosition(time, systemBodys) {
  return {
    type: UPDATE_SYSTEM_BODY_POSITION,
    time,
    systemBodys
  };
};


export function updateSystemBodyEnvironment(time, systemBodys) {
  return {
    type: UPDATE_SYSTEM_BODY_ENVIRONMENT,
    time,
    systemBodys
  };
};


////////////////
// Reducer/s  //
////////////////

export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case ADD_SYSTEM_BODY:
      const data = action.data;
      const volume = volumeOfSphere(data.radius);

      return {
        ...DEFAULT_STATE,
        ...data,
        id: action.id.toString(),
        diameter: data.radius * 2,
        density: data.mass / volume,
        volume: volume,
        surfaceGravity: gravityAtDistanceFromMass(data.mass, data.radius),
        escapeVelocity: escapeVelocity(data.mass, data.radius),
        isColonisable: colonisableSystemBodyTypes.indexOf(data.type) !== -1
      };
    case UPDATE_SYSTEM_BODY_POSITION:
      return {
        ...state,
        ...systemBodyPositionAtTime(state, action.time, action.systemBodys)
      };
    case UPDATE_SYSTEM_BODY_ENVIRONMENT:
      return {
        ...state,
        surfaceTemperature: systemBodySurfaceTemperature(state, action.systemBodys)
        //TODO anything else that will change, e.g. surface temperature
      };
  }

  return state;
}


////////////////
// Helpers    //
////////////////
