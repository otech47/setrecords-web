import _ from 'underscore';
import async from 'async';

import constants from '../constants/constants';

var Downloader = {
    downloadAudioFile: function(audioUrl, callback) {
        var fileUrl = constants.S3_ROOT + audioUrl;
        console.log('Downloading file from ' + fileUrl);

        var blob = null;
        var xhr = new XMLHttpRequest();

        xhr.open("GET", fileUrl);
        xhr.responseType = 'blob';

        xhr.onload = function () {
            console.log('Blob downloaded.');
            blob = xhr.response;
            console.log(blob);

            callback(blob);
        };

        xhr.send();
    }
}

module.exports = Downloader;
