/*Login Page for SetRecords */
/*One Componenet to hold the the Logo , username and password */
/*Acutal Login information*/
/*Username and passowrd*/
/*password*/
import React, {findDOMNode} from 'react';
import {Router, Route, Link, Navigation} from 'react-router';
import auth from './auth';

var LoginPage = React.createClass ({
	mixins: [Navigation],
  	handleSubmit: function(event) {
  		event.preventDefault();

  		var username = React.findDOMNode(this.refs.userField).value;
  		var password = React.findDOMNode(this.refs.passField).value;
  		var self = this;
  		auth.login(username, password, (loggedIn) => {
  			if (!loggedIn) {
  				console.log('incorrect password');
  				React.findDOMNode(this.refs.userField).value = '';
  				React.findDOMNode(this.refs.passField).value = '';
  			} else {
  				var push = this.props.push;
  				var artistId = JSON.parse(auth.getToken()).artist_id;
  				var requestUrl = "https://setmine.com/api/v/7/artist/" + artistId;
  				$.ajax({
  					type: "GET",
  					url: requestUrl,
  					success: function(res) {
  						push({
  							type: "SHALLOW_MERGE",
  							data: {
  								loggedIn: true,
  								artistData: res.payload.artist
  							}
  						});
  						console.log('redirecting to content...');
  						self.transitionTo('content', {appState: self.props.appState}, {push: self.props.push});
  					},
  					error: function(err) {
  						console.log('no data in the api for that artist');
  					}
  				});
	  		}
  		});
  	},
	render: function (){
		return(
			<div className="view black-bkgrd">
				<div>
					<form>
						<div className="format">
							<div>
								<label htmlFor="username"></label>
								<input type="text" ref="userField" className="username-input main-input" id="username" placeholder="Username" onChange={this.handleUser}/>
							</div>
				    		<div>
				    			<label htmlFor="password"></label>
				    			<input type="text" ref="passField" className="password-input main-input" id="password-input" placeholder="Password" onChange={this.handlePass}/>
				    		</div>
				    		<div>
				    		<button type="submit" className="setrecords-signin main-input" onClick={this.handleSubmit}>
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