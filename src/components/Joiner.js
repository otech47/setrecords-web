var React = require('react/addons');
var Dropzone = require('react-dropzone');
import _ from 'underscore';
import async from 'async';

var Joiner = React.createClass({
	getInitialState: function() {
		return {
			files: []
		};
	},
	render: function() {
		return (
			<div className="flex-column wizard-step">
				<audio ref='player' autoplay controls>
					<source ref='playerSource' src='' />
				</audio>
				<Dropzone onDrop={this.onDrop} multiple={true}>
					Drop files here!
				</Dropzone>
				<button onClick={this.combineFiles}>Combine</button>
			</div>
		);
	},

	onDrop: function(file) {
		var self = this;
		var newFiles = React.addons.update(this.state.files, {$push: file});
		this.setState({
			files: newFiles
		}, function() {
			console.log(self.state);
		});
	},
	combineFiles: function(event) {
		console.log("Send files command issued.");
		console.log("Setting up audio context...");
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext();
		var fileArray = this.state.files;
		var finalBuffer;
		var self = this;
		
		console.log("Beginning async forEachSeries for file array:");
		console.log(fileArray);

		async.forEachSeries(fileArray, function(file, callback) {
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
					if (fileArray.indexOf(file) == 0) {
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
				console.log("There was an error.");
				console.log(err);
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
				console.log("Done.");

				console.log("Let's try printing this mp3...");
				console.debug(mp3Data);
				console.log("Creating a blob...");
				var blob = new Blob(mp3Data, {type: 'audio/mpeg'});
				console.log(blob);
				console.log(blob.size);
				console.log(blob.type);
				var blobUrl = (window.URL || window.webkitURL).createObjectURL(blob);
				var link = window.document.createElement('a');
				link.href = blobUrl;
				link.download = 'joined.mp3';
				var click = document.createEvent("Event");
				click.initEvent("click", true, true);
				link.dispatchEvent(click);
				
				console.log("Setting audio source to blob object...");
				var source = React.findDOMNode(self.refs.playerSource);
				source.setAttribute('src', blobUrl);
				console.log("Here's what the source looks like now...");
				console.log(source);
				console.log("Attempting to play...");			
				var audio = React.findDOMNode(self.refs.player);
				audio.load();
				audio.play();


				// console.log("Adding finalBuffer to BufferSource...");
				// var playSound = context.createBufferSource();
				// playSound.buffer = finalBuffer;
				// console.log("Connecting to destination...");
				// playSound.connect(context.destination);
				// console.log("Starting...");
				// playSound.start(0);
				// console.log("The length of this track is:");
				// console.log(playSound.buffer.duration);
			}
		});
	},

	appendBuffer: function(buffer1, buffer2, context) {

		var numChannels = Math.min(buffer1.numberOfChannels, buffer2.numberOfChannels);
		var combinedBuffer = context.createBuffer(numChannels, (buffer1.length + buffer2.length), buffer1.sampleRate);
		for (var i = 0; i < numChannels; i++) {
			var channel = combinedBuffer.getChannelData(i);
			channel.set(buffer1.getChannelData(i), 0);
			channel.set(buffer2.getChannelData(i), buffer1.length);
		}
		return combinedBuffer;
	}
});

module.exports = Joiner;