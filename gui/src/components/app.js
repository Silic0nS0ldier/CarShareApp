import config from "../config.json";

import createStore from "unistore";
import { Router, route } from 'preact-router';
import { h, Component } from 'preact';

import Profile from '../routes/profile';
import Login from "../routes/login";
import Home from '../routes/home';
import Header from './header';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

const store = createStore();

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = event => {
		// Guard access to pages that pull protected resources.
		/*if (store.getState().user == null && event.url !== "/login" && event.url !== "/register") {
			// Route to login page
			route("/login");
		} else {
			// Route as normal
			this.currentUrl = event.url;
		}*/this.currentUrl = event.url;
	};

	render = () => {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile" />{/*Actual profile page... or something*/}
					<Login path="/login" config={config} />{/*login page here*/}
					<div path="/register" />{/*register page here*/}
					<div path="/:catchall" />{/*Need to flesh this out to an actual 404 page*/}
				</Router>
			</div>
		);
	}
}
