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
<<<<<<< HEAD
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
			
=======
			<div className="content-page">
				it's the content page!
>>>>>>> f7eb9659a4f67dc711165815f39f68b2c4e2b919
			</div>
		);
	}
});

module.exports = ContentView;