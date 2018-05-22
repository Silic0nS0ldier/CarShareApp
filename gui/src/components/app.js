import config from "../config.json";

import { h, Component } from "preact";
import { Router, route } from "preact-router";
import createStore from "unistore";
import jwtDecode from "jwt-decode";

import Verify from "../routes/verify";
import Register from "../routes/register";
import Profile from "../routes/profile/profile";
import OtherProfile from "../routes/profile/otherprofile";
import Login from "../routes/login";
import Home from "../routes/home";
import Header from "./header";
import VehicleNew from '../routes/vehicle/new';
import VehicleListings from '../routes/vehicle/listings';
import VehicleListing from '../routes/vehicle/listing';
import VehicleModify from '../routes/vehicle/modify';
import BookingNew from '../routes/booking/new';
import BookingModify from '../routes/booking/modify';
import BookingReview from '../routes/booking/review';

const store = createStore();

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = event => {
		// Handle session
		if (localStorage.getItem("access_token")) {
			// Decode token
			const token = jwtDecode(localStorage.getItem("access_token"));

			// Check expiry and expire is necessary
			if (new Date(token.exp) <= new Date()) {
				store.setState({
					user_id: null,
					userImgURL: null,
					imgURL: null
				});
				localStorage.removeItem("access_token");
			} else if (store.getState().user_id == null) {
				// Regenerate if not in store
				store.setState({
					user_id: token.user_id,
					userImgURL: config.url.img + localStorage.getItem("access_token") + "/" + token.img,
					imgURL: config.url.img + localStorage.getItem("access_token") + "/"
				});
			}
		} else {
			// Make sure store is clear
			if (store.getState().user_id) {
				store.setState({
					user_id: null
				})
			}
		}

		// Restrict access for logged out users
		if (store.getState().user_id == null
		&& !event.url.startsWith("/login")
		&& !event.url.startsWith("/register")
		&& !event.url.startsWith("/error")
		&& !event.url.startsWith("/verify")) {
			route("/login/" + encodeURIComponent(event.url));
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
					<Profile path="/profile" config={config} store={store}/>{/*Actual profile page... or something*/}
					<OtherProfile path="/profile/:userid" config={config} />
					<Login path="/login/:redirect?" config={config} store={store} />
					<Register path="/register" config={config} />
					<Verify path="/verify/:email/:code" config={config} store={store} />
					<VehicleNew path="/vehicle/create" config={config} store={store} />
					<VehicleListings path="/vehicles" config={config} store={store} />
					<VehicleListing path="/vehicle/:vin" config={config} store={store} />
					<VehicleModify path="/vehicle/modify" config={config} />
					<div path="/vehicle/create">TODO</div>
					<BookingNew path="/booking/new/:vin" config={config} />
					<BookingModify path="/booking/modify/:bookingid" config={config} />
					<BookingReview path="/booking/:bookingid/review" config={config} store={store}/>
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
