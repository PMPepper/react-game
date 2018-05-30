import MessageTypes from '../consts/MessageTypes';

let worker = null;
let isLoadedCallback = null;
let messageIdCounter = 1;
const responses = {};

function onmessage(e) {
  const message = e.data;

  switch (message.type) {
    case MessageTypes.INITIALISED:
      isLoadedCallback && isLoadedCallback();
      break;
    case MessageTypes.COMPLETE:
      if(!responses.hasOwnProperty(message.replyId)) {
        throw new Error('Reply to unknown message');
      }

      //Call response handler
      responses[message.replyId](message);

      //Tidy up
      delete responses[message.replyId];
      break;
    default:

  }
}

export function initialise(aIsLoadedCallback, {path = '../js/worker.js'} = {}) {
  worker = new Worker(path);
  isLoadedCallback = aIsLoadedCallback;

  worker.onmessage = onmessage;
}

export function createWorld(definition) {
  sendMessage(
    MessageTypes.CREATE_WORLD,
    definition,
    () => {console.log('world created!')}
  );
}

function sendMessage(type, data, responseCallback = null) {

  if(responseCallback) {
    const id = messageIdCounter++;

    responses[id] = responseCallback;

    worker.postMessage({
      type,
      data,
      id
    });
  } else {
    worker.postMessage({
      type,
      data
    });
  }
}
