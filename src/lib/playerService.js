import Q from 'q';
import R from 'ramda';
import $ from 'jquery';
import SM2 from 'soundmanager2';

import convert from './convert';
import constants from '../constants/constants';

var soundManager = SM2.soundManager;

// This will resolve when soundManager loads
var smDeferred = Q.defer();
var smPromise = smDeferred.promise;


soundManager.setup({
  url: '/swf/soundmanager2.swf',
  onready: function() {
    console.log('SM2 loaded');
    smDeferred.resolve();
  },
  ontimeout: function() {
    console.log('Error loading SoundManager2');
  }
});


function errorPromise(jqXHR, textStatus, errorThrown) {
	console.log('ERROR MAKING AJAX CALL', jqXHR, textStatus, errorThrown);
	return  Q.reject(errorThrown);
}


function fetchTrackList(selectedSet) {
  var trackListUrl = constants.API_ROOT + 'tracklist/' + selectedSet.id;

  return $.ajax({
    url: trackListUrl,
    type: 'get'
  });
}


function generateSound(loadStart, appState, push) {

  var setSMObject = appState.get('setSMObject');
  var currentSet = appState.get('currentSet');
  var selectedSet = currentSet.selectedSet;

  var currentSetCopy = R.clone(currentSet);

  if(loadStart) {
    loadStart = convert.MMSSToMilliseconds(loadStart);
  } else {
    loadStart = 0;
  }

  //// XXX TODO MOVE THIS
  if(setSMObject != null) {
    soundManager.destroySound('currentSound');
  }


fetchTrackList(selectedSet).then(function(response) {
  return response.payload;
}, errorPromise);


  var songURL = constants.S3_ROOT + selectedSet.songURL;
  console.log(songURL);

  var soundConf = {
    id: 'currentSound',
    url: songURL,
    load: loadStart,
    onload: function() {
      var totalTime = setSMObject.durationEstimate;
      console.log(totalTime);
    },

    whileplaying: function() {
      var currentTime = setSMObject.position;
      currentSetCopy.timePosition = currentTime;
      push({
        type: 'SHALLOW_MERGE', // XXX this exists in event handler consts
        data: { currentSet: currentSetCopy }
      });
    }
  };

  return smPromise.then(function() {
    setSMObject = soundManager.createSound(soundConf);
    //TODO confirm this starts it at correct pos
    setSMObject.setPosition(loadStart);
    soundManager.play('currentSound');
    return setSMObject;
  });
}

module.exports = {
  generateSound: generateSound,
  convert: convert // TODO MOVE CONVERT INTO SEPARATE SERVICE
};
