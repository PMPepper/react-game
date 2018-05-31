console.log('rootReducer');

import {combineReducers} from 'redux';

import game from '../reducers/game';
import server from '../reducers/server';


const reducer = combineReducers({
  server,
  game
});

export default reducer;
