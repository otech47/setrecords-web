var React = require('react');

var NavMenu = React.createClass({

	render: function() {
		return (
			<div id="nav-menu" className='flex-column'>
				{this.props.items.map(function(nav){
					return(
						<div className='nav-list-item click flex set-flex' key={nav.id}>
							<div className='center'>{nav}</div>
						</div>
					); 
				})}
			</div>
		);
	}

});

module.exports = NavMenu;