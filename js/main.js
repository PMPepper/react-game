//Constants
const DO_LOG = false;

//polyfills
import 'babel-polyfill';
import './utils/Polyfills';

//DOM
import './utils/trackFocus';

//React
import React from 'react'
import {render} from 'react-dom'

//Redux
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux';
import {enableBatching} from 'redux-batched-actions';
import ReduxThunk from 'redux-thunk';
import rootReducer from './RootReducer'
import {setDefaultStore, subscribe} from './helpers/Redux'
import {createLogger} from 'redux-logger';//DEV

//Components
import Game from './components/containers/Game';


//Redux reducers/actions
import {setCulture} from './reducers/localisation';
import {setPixelRatio} from './reducers/device';

//localisation
import lang_enGB from './data/lang/en-GB.json';


//Misc
import monitorDevicePixelRatio from './utils/monitorDevicePixelRatio';

let logger = undefined;

//first boolean to enable/disable logger
if(DO_LOG && process.env.NODE_ENV !== 'production') {
  logger = createLogger({
    diff: true
  });
}

//Create & initialise the store
const middlewares = [ReduxThunk];


if(logger) {
  middlewares.push(logger);
}

let store = createStore(
  enableBatching(rootReducer),
  applyMiddleware.apply(this, middlewares));

setDefaultStore(store);

//Load initial localisation data
store.dispatch(setCulture(lang_enGB.culture, lang_enGB.strings));

//Device pixel ratio monitoring
monitorDevicePixelRatio(store, 'device.pixelRatio', setPixelRatio);



//Initialise the app
render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('app')
);


import {tempInitGameState} from './temp';


tempInitGameState(store);


//debugging code
if(process.env.NODE_ENV !== 'production') {
  console.log(store)
  window.temp1 = store;

  //-global 'is shift key down'
  const handler = (e) => {
    window.isShiftKeyDown = e.shiftKey;
  };

  window.addEventListener('keydown', handler);
  window.addEventListener('keyup', handler);

  //make catching code that triggers warnings and errors easier
  var oldWarningFunction = console.warn;

  console.warn = function () {
    debugger;
    oldWarningFunction.apply(console, arguments);
  };

  var oldErrorFunc = console.error;
  var ignoreErrors = []

  console.error = function (msg) {
    if(ignoreErrors.every(err => {
      return msg.indexOf(err) !== 0;
    })) {
      debugger;
    }

    oldErrorFunc.apply(console, arguments);
  }
}
