import React from 'react/addons';


var MoibleSetEditor = React.createClass({
	_attachStreams: function() {
		var _this = this;
	},
	componentDidMount: function() {
		this._attachStreams();
	},
	render: function() {
		return (
			<div className="moible-set-editor flex-column">

				
					<div className="edit-set-name ">

						<h1 id="edit-set-name">TomorrowWorld 2013
						 <a id="moible-edit-name">EDIT</a>
						 <i className="fa fa-pencil"></i>
						</h1>
						<p>Uploaded:</p>
						<p className="plays">Plays:</p>
					</div>

			    	<div className="edit-set-preview">
			    		<img src="./public/images/settile.png" ></img>
			    		<button id="change-set">Change Set Image</button>
			    	</div>
					
					<div className="edit-set-track ">
						<div className="trackAdd">
							<h1>TrackList  <button id="addTrack"> <i className="fa fa-plus"></i>  add track   
							</button>
							</h1>
						</div>
						<div>
							<p>1001 trackiList URL (optional)</p>
							
						</div>
						<table className="trackiList-table">
							<tr>
								<td>0:00</td>
								<td>Skrillex - Legend of Zelda</td>
								<td><i className="fa fa-times deleteTrack"></i></td>
							</tr>
							<tr>
								<td>0:00</td>
								<td>Skrillex - Legend of Zelda</td>
								<td><i className="fa fa-times deleteTrack"></i></td>
							</tr>
							<tr>
								<td>0:00</td>
								<td>Skrillex - Legend of Zelda</td>
								<td><i className="fa fa-times deleteTrack"></i></td>
							</tr>
							<tr>
								<td>0:00</td>
								<td>Skrillex - Legend of Zelda</td>
								<td><i className="fa fa-times deleteTrack"></i></td>
							</tr>
							<tr>
								<td>0:00</td>
								<td>Skrillex - Legend of Zelda</td>
								<td><i className="fa fa-times deleteTrack"></i></td>
							</tr>
							<tr>
								<td>0:00</td>
								<td>Skrillex - Legend of Zelda</td>
								<td><i className="fa fa-times deleteTrack"></i></td>
							</tr>
						</table>
					</div>

				
				
			    	
			   
			</div>
		);
	}
});

module.exports = MoibleSetEditor;