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
		console.log(requestURL);
		$.ajax({
				url: requestURL,
				success: function(res){
						console.log(res);
						var artistObject = res.payload.artist; 
						console.log(artistObject.artist);
				},
				error: function(err){
					console.log (err);
				}
			})
	},
	render :function (){
	return(
	<body className="setrecords-body">	
		<div>
			<div>
				<img src="/public/images/setrecords.png"/>
				<div className="setrecords-title">Setrecords</div>
			</div>
			<div className="form-group">
				
				<form className="login-container">
				<div>
					<label htmlFor="username"></label>
					<input type="text" className="username-input" id="username" placeholder="Username" onChange={this.handleChange}/>
				</div>
			    <div>
			    	<label htmlFor="password"></label>
			    	<input type="text" className="password-input" id="password-input" placeholder="Password"/>
			    </div>
			    <button type="submit" className="setrecords-signin" onClick={this.submitLogin}>DOO IT , JUST DOO IT</button>
				</form>
			</div>
		</div>
	</body>	
	);
}
});
module.exports = LoginPage;