import {createStore, applyMiddleware} from 'redux';
import {enableBatching} from 'redux-batched-actions';
import ReduxThunk from 'redux-thunk';

import rootReducer from './worker/rootReducer';

onmessage = function(e) {
  console.log('Message received from main script');
  var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log('Posting message back to main script');
  postMessage(workerResult);
}

const middlewares = [];

let store = createStore(
  enableBatching(rootReducer),
  applyMiddleware.apply(this, middlewares)
);
