var moment = require("moment");

var UpdateFunctions = {
	updateArtist: function(callback) {
		// console.log("Updating artist info...");
		var artistId = this.state.appState.get("artist_data").id;
		var requestURL = "http://localhost:3000/api/v/7/setrecords/artist/info/" + artistId;
		$.ajax({
			type: "GET",
			url: requestURL,
			success: function(res) {
				// console.log('Artist...');
				if (res.status == 'failure') {
					// console.log("An error occurred getting artist data.");
					callback(res.payload.error);
				} else {
					callback(null, res.payload.artist_info);
				}
			}
		});
	},
	updateSetmine: function(callback, params) {
		// console.log("Updating setmine info...");
		var cohortType = "";
		if (params != null) {
			cohortType = "?cohortType=" + params;
		}
		var artistId = this.state.appState.get("artist_data").id;
		var setmineRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/setmine/'
		+ artistId + cohortType;
		var setmineMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: setmineRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				// console.log("Setmine...");
				callback(null, res.setmine);
			},
			error: function(err) {
				callback(err);
			}
		});
	},
	updateSoundcloud: function(callback, params) {
		// console.log("Updating soundcloud info...");
		var cohortType = "";
		if (params != null) {
			cohortType = "?cohortType=" + params;
		}
		var artistId = this.state.appState.get("artist_data").id;
		var soundcloudRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/soundcloud/'
		+ artistId + cohortType;
		var soundcloudMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: soundcloudRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				// console.log('Soundcloud...');
				callback(null, res);
			},
			error: function(err) {
				callback(err);
			}
		});
	},
	updateYoutube: function(callback, params) {
		var cohortType = "";
		if (params != null) {
			cohortType = "?cohortType=" + params;
		}
		var artistId = this.state.appState.get("artist_data").id;
		var youtubeRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/youtube/'
		+ artistId + cohortType;
		var youtubeMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: youtubeRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				// console.log('Youtube...');
				callback(null, res.youtube);
			},
			error: function(err) {
				callback(err);
			}
		});
	},
	updateBeacons: function(callback, params) {
		var cohortType = "";
		if (params != null) {
			cohortType = "?cohortType=" + params;
		}
		var artistId = this.state.appState.get("artist_data").id;
		var beaconRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/beacons/'
		+ artistId + cohortType;
		var beaconMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: beaconRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				// console.log('Beacons...');
				callback(null, res.beacons);
			},
			error: function(err) {
				callback(err);
			}
		});
	},
	updateSocial: function(callback, params) {
		var artistId = this.state.appState.get("artist_data").id;
		var socialRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/social/'
		+ artistId;
		var socialMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: socialRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				// console.log('Social...');
				callback(null, res.social);
			},
			error: function(err) {
				callback(err);
			}
		});
	},
	updateSets: function(callback) {
		var requestURL = 'http://localhost:3000/api/v/7/setrecords/artist/sets/' + this.state.appState.get("artist_data").id;
		$.ajax({
			type: 'GET',
			url: requestURL,
			success: function(res) {
				// console.log('Sets...');
				if (res.status == 'failure') {
					// console.log('An error occurred getting set data.');
					callback(res.payload.error);
				} else {
					callback(null, res.payload.sets);
				}
			},
			error: function(err) {
				// console.log('There was an error retrieving current sets from the server.');
				callback(err);
			}
		});
	},
	updateMisc: function(callback) {
		var requestUrl = 'http://localhost:3000/api/v/7/setrecords/misc/info';
		$.ajax({
			type: 'GET',
			url: requestUrl,
			success: function(res) {
				callback(null, res.payload);
			},
			error: function(err) {
				// console.log("There was an error retrieving misc data from the server.");
				callback(err);
			}
		})
	}
};

module.exports = UpdateFunctions;
