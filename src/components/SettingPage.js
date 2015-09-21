import React from 'react';

var SettingPage = React.createClass({
	render: function(){
		return(
				<div className=" SettingPage flex-columnn">
					
					<div className="flex-row SVC ">
						<div  className="flex-fixed  ">
							<button  id="save">Save</button>
						</div>
						<div   className="flex-fixed ">
							<button id="undo">Revert</button>
						</div>
						<div   className="flex-fixed ">
							<button id="cancel">Cancel</button>
						</div>
					</div>	

					<div className="flex-row">
						<div className="flex-columnn flex-fixed">
							<div></div>
							<div></div>
							<div></div>
						</div>
						
						<div className="flex-columnn flex-fixed">
							<div></div>
						</div>
					</div>
					
					<div className="flex-columnn">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			);
	}
});

module.exports = SettingPage;