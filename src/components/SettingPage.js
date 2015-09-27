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

					<div className="flex-row PasswordChange">
						<div className="flex-columnn flex-fixed">
							<div className="Artist-name">
								<h1>Drake</h1>
								<p>Joined: 8/27/2014</p>
							</div>
							<div>
								<p>New Password</p>
								<label htmlFor="New Password"/>
								<input className="newPassword" type="text" placeholder="New Password"/>
							</div>
							<div>
								<p>Confirm New Password</p>
								<label htmlFor="Confirm New Password"/>
								<input className="confirmPassword" type="text" placeholder="Confirm New Password"/>
							</div>
						</div>
						
						<div className="flex-columnn settingImage flex-fixed">
							<div className="edit-set-preview">
			    				<img  id ="settingImage"src="./public/images/settile.png" ></img>
			    				<button id="change-set">Change Profile Image</button>
			    			</div>
						</div>

					</div>
					
					<div className=" socialmedia flex-columnn">
						<div>
							<p>website *</p>
							<label htmlFor="  "/>
							<input className="" type="text" placeholder="  "/>
						</div>
						<div>
							<p> soundclooud link</p>
							<label htmlFor="  "/>
							<input className="" type="text" placeholder="  "/>
						</div>
						<div>
							<p>youtube link *</p>
							<label htmlFor="  "/>
							<input className="" type="text" placeholder="  "/>
						</div>
						<div>
							<p>twitter link</p>
							<label htmlFor="  "/>
							<input className="" type="text" placeholder="  "/>
						</div>
						<div>
							<p>facebook link</p>
							<label htmlFor="  "/>
							<input className="" type="text" placeholder="  "/>
						</div>
						
					</div>
				</div>
			);
	}
});

module.exports = SettingPage;
