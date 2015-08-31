/*Login Page for SetRecords */
/*One Componenet to hold the the Logo , username and password */
/*Acutal Login information*/
/*Username and passowrd*/
/*password*/
var React = require('react');
import {Router, Navigation} from 'react-router';

var LoginPage = React.createClass ({
	statics: {
		willTransitionTo: function (transition) {
			console.log("checking login...");

		}
	},
	mixins: [Navigation],
	getInitialState: function() {
    	return {
      		username: ""
    	};
  	},
  	handleChange: function(event) {
  		this.setState({username: event.target.value});
  	},
  	loginSuccessful:function() {
  		this.transitionTo("content");
  	},
	submitLogin:function(){ 
		var self = this;
		var push = this.props.pushFn;
		var requestURL = "https://setmine.com/api/v/7/artist/" + this.state.username;
		$.ajax({
			url: requestURL,
			success: function(res){
				$.ajax({
					url: requestURL,
					success: function(res){
						var artistObject = res.payload.artist; 
						push({
							type: "SHALLOW_MERGE",
							data: {
								loggedIn: true,
								artistData: artistObject
							}
						});
						self.loginSuccessful();
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