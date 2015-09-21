import React from 'react';

var SetstoryLandingPage = React.createClass({
	
	
	render: function(){
		return (
				<div>
					<div className="SetstoryLandingPage">
						<div className="mainLandingPage flex-column  set-flex">

							
							<div className=" brady flex-row flex-fixed-5x">
								<div className=" flex-column flex-fixed-7x space">
									
								</div>
								<div className=" flex-column flex-fixed-2x drake ">
									<img src="./public/images/Setstory-logo.png"/>
								</div>
							</div>

							<div className=" flex-row flex-fixed-2x cartman">
								<div className="flex-column hub flex-fixed">
									<p>The Hub for Retailers</p>
								</div>
								<div className="flex-row setstory-apps flex-fixed">
									<i href="" className="fa fa-apple"></i>
									<i className="fa fa-android"></i>
								</div>
							</div>

						</div>

						<div className=" secondLanding flex-row set-flex ">

								
								<div className="flex-row flex-fixed ghost ">
									
								</div>

								<div className="flex-column flex-fixed boss">
									<h1 className="work">You are the boss.</h1>
									<p>Artist will send you an offer to push their content to you beacon.</p>
									<p>You have the control over the content received at you beacon by approving or declining.</p> 			
								</div>

							
						</div>
					</div>	
				</div>
			);

	}
});

module.exports = SetstoryLandingPage ;