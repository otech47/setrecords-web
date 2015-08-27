var React = require('react');

var SearchBar = React.createClass({

	getInitialState: function() {
		return {
			searchInput: ''
		};
	},
	//old search functionality for reference; delete later
	search: function(query) {
		var results = null;
		$(".search-loader").removeClass("hidden")
		$(".search-loader").removeClass("hidden-fade")
		if(activeSearchAjax != null) {
			activeSearchAjax.abort();
			activeSearchAjax = null;
		}
		activeSearchAjax = $.ajax({
			type: "GET",
			url: API_ROOT + "search/" + query,
			success: function(response) {
				console.log(response)
				if(response.status == "success") {
					results = response.payload.search;
					spliceBigArray(results.sets)
					spliceBigArray(results.upcomingEvents)
					spliceBigArray(results.tracks)
					
					var allResults = 0;

					$('.search-results .search-section').empty();

					// Generate search containers

					var setsContainer = $(".search-results .search-section.sets");
					setsContainer.parents(".search-results-container").find(".item-number.sets").text(results.sets.length);
					var uEventsContainer= $(".search-results .search-section.upcoming-events");
					uEventsContainer.parents(".search-results-container").find(".item-number.upcoming-events").text(results.upcomingEvents.length);
					var tracksContainer = $(".search-results .search-section.tracks");
					tracksContainer.parents(".search-results-container").find(".item-number.tracks").text(results.tracks.length);

					// Populate search containers

					for(var s in results.sets) {
						createSetTile(results.sets[s], setsContainer);
						allResults++
						if(allResults == (results.sets.length + results.upcomingEvents.length + results.tracks.length)) {
							displaySearchSections()
						}
					}
					for(var u in results.upcomingEvents) {
						createUpcomingEventTile(results.upcomingEvents[u], uEventsContainer);
						allResults++
						if(allResults == (results.sets.length + results.upcomingEvents.length + results.tracks.length)) {
							displaySearchSections()
						}
					}
					for(var t in results.tracks) {
						createTrackTile(results.tracks[t], tracksContainer);
						allResults++
						if(allResults == (results.sets.length + results.upcomingEvents.length + results.tracks.length)) {
							displaySearchSections()
						}
					}
				} else {
					results = null;
				}
			}
		});
	},
	render: function() {
		return (
			<div className='center flex flex-row'>
				<i className="nav-button fa fa-search center click"/>
				<input id="search" className="flex" placeholder='search'/>
          </div>
		);
	}

});

module.exports = SearchBar;