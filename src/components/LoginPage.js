/*Login Page for SetRecords */
/*One Componenet to hold the the Logo , username and password */
/*Acutal Login information*/
/*Username and passowrd*/
/*password*/
var React = require('react');
var LoginPage = React.createClass ({
	getInitialState: function() {
    	return {
      		username: ""
    	};
  	},
  	handleChange: function(event) {
  		this.setState({username: event.target.value});
  	},
	submitLogin:function(){ 
		var requestURL = "https://setmine.com/api/v/7/artist/" + this.state.username;
		$.ajax({
			url: requestURL,
			success: function(res){			
				console.log(requestURL);
				$.ajax({
					url: requestURL,
					success: function(res){
						console.log(res);
						var artistObject = res.payload.artist; 
						console.log(artistObject.artist);
					},
					error: function(err){
						 console.log("Username or Password Incoreect" + " " + err);
					}
				});
			}
		});
	},
	render: function (){
		return(

			
			<div className="view">
					<div>
						<video id="introvid" preload="auto" autoplay="auto" loop="loop" src="https//:setmine.com/videos/setrecords-login-compress.mp4"></video>
						<form>
							<div className="format"> 

								<div>
									<label htmlFor="username"></label>
									<input type="text" className="username-input main-input" id="username" placeholder="Username" onChange={this.handleChange}/>
								</div>
					    		<div>
					    			<label htmlFor="password"></label>
					    			<input type="text" className="password-input main-input" id="password-input" placeholder="Password"/>
					    		</div>
					    		<div>
					    		<button type="submit" className="setrecords-signin main-input" onClick={this.submitLogin}>
					    		Sign In
					    		</button>
								</div>
							</div>
						</form>
					</div>
				
				
			</div>	
		);
	}
})
module.exports = LoginPage;