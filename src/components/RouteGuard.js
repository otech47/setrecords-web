import auth from './auth';

module.exports = {
	statics: {
		willTransitionTo: function(transition) {
			if (!auth.loggedIn()) {
				transition.redirect('/login');
			}
		}
	}
};