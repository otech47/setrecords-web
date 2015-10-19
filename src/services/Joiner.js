import _ from 'underscore';
import async from 'async';

var Joiner = {
	combineAudioFiles: function(files, callback) {
		console.log("Setting up audio context...");
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext();
		var finalBuffer;
		var self = this;

		console.log("Beginning async decode for files:");
		console.log(files);

		async.forEachSeries(files, function(file, callback) {
			console.log("File size: " + file.size);
			var request = new XMLHttpRequest();

			request.addEventListener("progress", function(event) {
				if (event.lengthComputable) {
					var percentComplete = (event.loaded / file.size) * 100;
					console.log(percentComplete + '%');
				}
			});

			console.log("Creating object URL for file:");
			console.log(file);
			var audioUrl = URL.createObjectURL(file);
			request.open("GET", audioUrl, true);
			request.responseType = 'arraybuffer';

			request.onload = function() {
				URL.revokeObjectURL(audioUrl);
				console.log("File loaded. Decoding...");
				context.decodeAudioData(request.response, function(buffer) {
					if (files.indexOf(file) == 0) {
						console.log("This is the first file. Creating starting buffer...");
						finalBuffer = buffer;
					} else {
						console.log("Decoded. Appending...");
						var numChannels = Math.min(finalBuffer.numberOfChannels, buffer.numberOfChannels);
						var combinedBuffer = context.createBuffer(numChannels, (finalBuffer.length + buffer.length), finalBuffer.sampleRate);
						for (var i = 0; i < numChannels; i++) {
							var channel = combinedBuffer.getChannelData(i);
							channel.set(finalBuffer.getChannelData(i), 0);
							channel.set(buffer.getChannelData(i), finalBuffer.length);
						}
						finalBuffer = combinedBuffer;
					}
					callback(null);
				})
			};

			console.log("Sending request...");
			request.send();
		}, function(err, results) {
			if (err) {
				console.log("There was an error joining.");
				console.log(err);
				callback(err);
			} else {
				console.log("All buffers appended.");
				var sampleRate = finalBuffer.sampleRate;
				console.log("Buffer sample rate: " + sampleRate);
				var numberOfChannels = finalBuffer.numberOfChannels;
				console.log("Buffer channels: " + numberOfChannels);

				console.log("Transforming buffer channel values...");
				var leftOriginal = finalBuffer.getChannelData(0);
				var rightOriginal = numberOfChannels > 1 ? finalBuffer.getChannelData(1) : null;
				var leftChannel = new Float32Array(leftOriginal.length);
				var rightChannel = numberOfChannels > 1 ? new Float32Array(rightOriginal.length) : null;
				for (var i = 0; i < leftOriginal.length; i++) {
					leftChannel[i] = leftOriginal[i] * 32767.5;
					if (numberOfChannels > 1) {
						rightChannel[i] = rightOriginal[i] * 32767.5;
					}
				}
				console.log("Done.")
				console.log("Creating encoder for this buffer...");
				var lib = new lamejs();
				var mp3Data = [];
				var mp3Encoder = new lib.Mp3Encoder(numberOfChannels, sampleRate, 128);

				var blockSize = 1152;
				var blocks = [];
				var mp3Buffer;

				var length = leftChannel.length;
				var percentage = 0;

				console.log("Encoding...");
				for (var i = 0; i < length; i += blockSize) {
					var currentPercentage = (i / length) * 100;
					if (currentPercentage > percentage + 1) {
						percentage = currentPercentage;
						console.log(percentage.toFixed() + '%');
					}

					var l = leftChannel.subarray(i, i + blockSize);
					if (rightChannel) {
						var r = rightChannel.subarray(i, i + blockSize);
						mp3Buffer = mp3Encoder.encodeBuffer(l, r);
					} else {
						mp3Buffer = mp3Encoder.encodeBuffer(l);
					}
					if (mp3Buffer.length > 0) {
						mp3Data.push(mp3Buffer);
					}
				}

				console.log("Finishing...");
				var mp3Finish = mp3Encoder.flush();

				if (mp3Finish.length > 0) {
					mp3Data.push(mp3Finish);
				}
				console.log("Creating a blob...");
				var blob = new Blob(mp3Data, {type: 'audio/mpeg'});
				callback(null, blob);
			}
		});
	}
}

module.exports = Joiner;
