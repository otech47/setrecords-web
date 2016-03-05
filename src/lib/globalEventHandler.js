import Rx from 'rx';
import R from 'ramda';
import Immutable from 'immutable';

var types = {
  INITIALIZE_APP: 'INITIALIZE_APP',
  SHALLOW_MERGE:  'SHALLOW_MERGE'
};

var obsValue = Rx.Observable.just;

function getInitialAppState(initState) {
  return obsValue(initState);
}

function shallowMerge(update, lastState) {
  var newState = R.merge(lastState.toJS(), update);
  return obsValue(Immutable.Map(newState));
}

function eventDispatcher(msg, lastState) {
  var type = msg.type;
  var data = msg.data;

  var newStateObservable;

  /**
   * XXX
   *
   * Every function that assigns to the `newStateObservable`
   * MUST RETURN AN OBSERVABLE THAT WILL PUBLISH IMMUTABLEJS MAPS
   */
  switch(type) {
    case types.INITIALIZE_APP:
      newStateObservable = getInitialAppState(data, lastState);
      break;
    case types.SHALLOW_MERGE:
      newStateObservable = shallowMerge(data, lastState);
  }

  return newStateObservable;
}

// initialState has to be an Immutable map
function getEventHandler(initialState) {

  // SHIIIIEEEEET DAS IT MAYNE
  var applicationState = Immutable.Map({});

  // All messages will be received by this
  var messageReceiver = new Rx.Subject();

  var push = (msg) => {
    if(!msg) { throw 'Push requires message'; }
    messageReceiver.onNext(msg);
  };

  var initializeMessage = {
    type: types.INITIALIZE_APP,
    data: initialState
  };

  var initialStateObservable = Rx.Observable.just(initializeMessage);

  var pushedMessagesObservable = initialStateObservable
                                    .merge(messageReceiver);

  // All state updates will come from here
  // TODO ensure no race-conditions
  var floodGate = pushedMessagesObservable.flatMap(msg => {
    return eventDispatcher(msg, applicationState);
  }).map(newState => {
    applicationState = newState;
    return applicationState;
  });

  return {
    push: push,
    types: types,
    floodGate: floodGate
  };
}

module.exports = getEventHandler;
