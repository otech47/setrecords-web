import React from 'react/addons';
import SetEditor from './SetEditor';
import SetTile from './SetTile';


var ContentView = React.createClass({
	displayName: 'ContentView',
	_attachStreams: function() {
		var _this = this;
	},
	componentDidMount: function() {
		this._attachStreams();
	},
	render: function() {
		var artistData = this.props.appState.get("artistData");
		var sets = artistData.sets;
		var setTiles = [];
		sets.map(function (set, index) {
			setTiles.push(<SetTile set={set} key={set.id} />)
		});

		return (
			<div className="content-page flex-column">
				<div className=" set-list flex">
					<div className="moible-column flex-row  ">
						<div className="addSet">
							<i className="fa fa-plus"></i>
							<p>ADD A SET</p>
						</div>
						<SetTile/>
						<SetTile/>
						<SetTile/>
						<SetTile/>
						<SetTile/>
						<SetTile/>
						<SetTile/>
					</div>
					
				</div>
			
			</div>
		);
	}
});

module.exports = ContentView;