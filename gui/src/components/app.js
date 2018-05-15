import { Router, route } from 'preact-router';
import { h, Component } from 'preact';

import Profile from '../routes/profile';
import Home from '../routes/home';
import Header from './header';
import Vehicle from '../routes/vehicle';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<Vehicle path="/vehicle/listing" />
				</Router>
			</div>
		);
	}
}
