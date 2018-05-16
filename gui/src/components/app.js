import config from "../config.json";

import createStore from "unistore";
import { Router, route } from "preact-router";
import { h, Component } from "preact";

import Verify from "../routes/verify";
import Register from "../routes/register";
import Profile from "../routes/profile";
import Login from "../routes/login";
import Home from "../routes/home";
import Header from "./header";
import VehicleListings from '../routes/vehicle/listings';
import VehicleListing from '../routes/vehicle/listing';
import VehicleModify from '../routes/vehicle/modify';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

const store = createStore();

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = event => {
		// Used to bypass login lockout during dev
		this.currentUrl = event.url;
		return;
		// Check if session is still active
		if (localStorage.getItem("session_id")) {
			fetch(config.url.api + "session", {
				methd: "HEAD",
				body: JSON.stringify({
					session_id: localStorage.getItem("session_id")
				}),
				cache: "no-cache"
			}).then(response => {
				// Non-200 response indications expired session
				if (response.status !== 200) {
					store.setState({
						user: null,
						session_id: null,
						url: null
					});
					localStorage.removeItem("session_id");
					route("/login/" + encodeURIComponent(event.url));
				}
			}).catch(error => {
				route("/error");
			});
		}

		// Guard access to pages that pull protected resources.
		if (store.getState().user == null
			&& event.url !== "/login"
			&& event.url !== "/register"
			&& event.url !== "/error"
			&& !event.url.startsWith("/verify")) {
			// Attempt to restore session if 
			if (localStorage.getItem("session_id")) {
				fetch(config.url.api + "session", {
					method: "GET",
					body: JSON.stringify({
						session_id: localStorage.getItem("session_id")
					}),
					cache: "no-cache"
				}).then(response => {
					// Handle response
					if (response.status === 200) {
						// 200 = session restored
						response.json().then(payload => {
							store.setState({
								user: payload.user,
								session_id: localStorage.getItem("session_id"),
								url: {
									api: config.url.api + localStorage.getItem("session_id") + "/",
									img: config.url.img + localStorage.getItem("session_id") + "/"
								}
							});
							route(event.url);
						}).catch(error => {
							// This shouldn't happen, but we can never be sure.
							// Redirect to the error page
							route("/error");
						});
					} else if (response.status === 400) {
						// 400 = session has since expired
						localStorage.removeItem("session_id");
						route("/login");
					} else {
						// Something bad happened.
						throw new Error("Failure attempting to restore session");
					}

				}).catch(error => {
					// We failed to reach the server or something broke the connection
					// Redirect to error page
					route("/error");
				})
			} else {
				// Route to login page
				route("/login");
			}

		} else {
			// Route as normal
			this.currentUrl = event.url;
		}
	};

	render = () => {
		return (
			<div id="app">
				<Header config={config} store={store}/>
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile" />{/*Actual profile page... or something*/}
					<Login path="/login" config={config} store={store} />
					<Login path="/login/:redirect" config={config} store={store} />
					<Register path="/register" config={config} />
					<Verify path="/verify/:email/:otp" config={config} store={store} />
					<VehicleListings path="/vehicles" config={config} />
					<VehicleListing path="/vehicle/listing" config={config} />
					<VehicleModify path="/vehicle/modify" config={config} />
					<div path="/error">
						An unrecoverable error occured. Sorry. 😕
					</div>
					<div default>
						Are you lost? Did we get lost? (404) 🤷
					</div>
				</Router>
			</div>
		);
	}
}
