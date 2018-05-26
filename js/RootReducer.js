import {combineReducers} from 'redux';

import device from './reducers/device';
import localisation from './reducers/localisation';
import game from './reducers/game';
import ui from './reducers/ui';


const reducer = combineReducers({
  device,
  localisation,
  game,
  ui
});

export default reducer;
