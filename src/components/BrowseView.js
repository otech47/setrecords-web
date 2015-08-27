import React from 'react';
import ViewTitleContainer from './ViewTitleContainer';
import constants from '../constants/constants';
import BrowseTile from './BrowseTile';

var BrowseView = React.createClass({
	getArtists: function(){
		$.ajax({
			url: 'http://setmine.com'+constants.API_ROOT+'artist',
			type: 'GET',
		})
		.done(function(response) {
			console.log("success");
			var artists = []
			var splitArtists = []
			if(response.status=='success') {
				var artistModels = response.payload.artist
				for(var a in artistModels) {
					artists[a] = artistModels[a]
					if(artists.length == artistModels.length) {
						var splits = Math.ceil(artists.length / 50)
						for(var i = 0 ; i < splits ; i++) {
							splitArtists[i] = []
							for(var j = (i*50) ; j < (i*50)+50 ; j++) {
								if(j < artists.length) {
									splitArtists[i].push(artists[j]);
								} else break
							}
						}
					}
				}
			}
		}.bind(this))
		.fail(function(xhr, status, err) {
			console.error(this.props.url, status, err.toString());
		}.bind(this))
	},
	getFestivals: function() {
		$.ajax({
			url: 'http://setmine.com'+constants.API_ROOT+'festival',
			type: 'GET',
		})
		.done(function(response) {
			var festivals = [];
			if(response.status == "success") {
				var festivalModels = response.payload.festival;
				for(var f in festivalModels) {
					festivals.push(festivalModels[f])
				}
			}
			this.setState({
				data: festivals,
				title: 'Festivals' 
			});
		}.bind(this))
		.fail(function(xhr, status, err) {
			console.error(this.props.url, status, err.toString());
		}.bind(this))
	},
	getMixes: function() {
		$.ajax({
			url: 'http://setmine.com'+constants.API_ROOT+'mix',
			type: 'GET',
		})
		.done(function(response) {
			var mixes = []
			if(response.status == 'success') {
				var mixModels = response.payload.mix;
				for(var m in mixModels) {
					mixes.push(mixModels[m])
				}
			}
			this.setState({
				data: mixes,
				title: 'Mixes'
			});
		}.bind(this))
		.fail(function(xhr, status, err) {
			console.error(this.props.url, status, err.toString());
		}.bind(this));	
	},
	render: function() {
		var tiles = [];
		this.props.data.map(function(tile, index) {
			tiles.push(<BrowseTile text={tile.artist} key={index} image={tile.imageURL} />);
		});
		return (
			<div id="browse" className="view overlay-container">
				<ViewTitleContainer title={this.props.title} />
				<div className="results-container flex-row flex">
					{tiles}
				</div>
			</div>
		);
	}
});		

module.exports = BrowseView;