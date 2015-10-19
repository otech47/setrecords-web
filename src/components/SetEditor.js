import React from 'react';


var SetEditor = React.createClass({

	render: function() {
		return (
			<div className="set-editor set-flex">
				<div className="first flex-column flex-fixed-2x">
					<div className="edit-set-name flex-column flex-fixed-2">

						<h1 id="edit-set-name">TomorrowWorld 2013  <i className="fa fa-pencil"></i></h1>
						<p>Uploaded:</p>
						<p className="plays">Plays:</p>
					</div>

					<div className="edit-set-track flex-column flex-fixed-3">
						<div>
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
				<div className="second flex-column flex-fixed-3x">
			    	<div className="edit-set-preview flex-column flex-fixed-7x ">
			    		<img src="./public/images/settile.png" ></img>
			    		<button id="change-set">Change Set Image</button>
			    	</div>
			    	<div className="apply-or-revert set-flex flex-fixed-2x ">


			    			<button id="apply">Apply Changes</button>



			    			<button id="revert">Revert</button>

			    	</div>
			    </div>
			</div>
		);
	}
});

module.exports = SetEditor;
