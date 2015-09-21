import React from 'react/addons';
import SetEditor from './SetEditor';
import SetTile from './SetTile';
import MoibleSetEditor from './MoibleSetEditor'

var ContentView = React.createClass({
	displayName: 'ContentView',
	_attachStreams: function() {
		var _this = this;
	},
	componentDidMount: function() {
		this._attachStreams();
	},

	render: function() {
		return (

			<div className="content-page flex-column">
				<div className=" set-list flex">
					<div className="moible-column flex-row  ">
						<div className="addSet">
							<a>	
								<i className="fa fa-plus"></i>
								<p>ADD A SET</p>
							</a>
						</div>
						<div className="addSong">
							<i className="fa fa-plus"></i>
							<p>ADD A SONG</p>
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