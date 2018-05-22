import Card from "preact-material-components/Card";
import Button from "preact-material-components/Button";
import authorizedFetch from "../../lib/authorizedFetch";
import { h, Component } from "preact";
import Form from "../../components/Forms/Form";
import TextField from "../../components/Forms/TextFormField";

import SubmitButton from "../../components/Forms/SubmitButton";
import "preact-material-components/Button/style.css";
import "preact-material-components/Card/style.css";

import style from "./style";

export default class Profile extends Component {
	/* 
		// Old login for record/reference
	state = {
		time: Date.now(),
		count: 10
	};

	// gets called when this route is navigated to
	componentDidMount() {
		// start a timer for the clock:
		this.timer = setInterval(this.updateTime, 1000);
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	// update the current time
	updateTime = () => {
		this.setState({ time: Date.now() });
	};

	increment = () => {
		this.setState({ count: this.state.count+1 });
	};

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count }) {
		return (
			<div class={style.profile}>
				<h1>Profile: {user}</h1>
				<p>This is the user profile for a user named { user }.</p>

				<div>Current time: {new Date(time).toLocaleString()}</div>

				<p>
					<Button raised ripple onClick={this.increment}>Click Me</Button>
					{" "}
					Clicked {count} times.
				</p>
			</div>
		);
	} */

	validatePassword = e => {
        let pwd = e.target.form.pwd;
        let pwd_verify = e.target.form.pwd_verify;

        // Validate complexity - more than a little basic
        if (pwd.value.length < 10) pwd.setCustomValidity("Must be at least 10 characters long");
        else pwd.setCustomValidity("");

        //Validate same
        if (pwd.value !== pwd_verify.value) pwd_verify.setCustomValidity("Passwords must match");
        else pwd_verify.setCustomValidity("");
    };

	componentDidMount = () => {
        return authorizedFetch(this.props.config.url.api + "user", {
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        }, true).then(
            (response) => {
				response.json()
                    .then((data) => {
                        if (response.ok) {
                            this.setState({
                                profile: data.data
							});
                        } else {
                            console.log("Well Shit");
                        }
                    })
                    .catch((error) => {
                        console.log("Something terrible has happened. Please try again.");
                        console.log(error);
                    });
            },
            () => {
                alert("Server is on holidays. Come back later");
            }
		).catch(
			(error) => {
				console.log(error);
			}
		);
    }

	render({config, store}, { profile }) {
		profile = this.state.profile;
		if(!profile) {
			return (
				<div>
					Loading profile now...
				</div>
			);
		} else {
			return (
				<div class={style.profile}>
					<h1>
						Profile: {profile}
					</h1>
					<div class={style.cardWrapper}>
						<Card>
							<div class={style.cardHeader}>
								<h2 class=" mdc-typography--title">Details</h2>
								<div class=" mdc-typography--caption"></div>
							</div>
							<div class={style.cardBody}>
								<div>
									<div>
										<h4>
											Name
										</h4>
										<span>
											{profile.fname} {profile.mnames} {profile.lname}
										</span>
									</div>
									<div>
										<h4>
											Email
										</h4>
										<span>
											{profile.email}
										</span>
									</div>
								</div>
							</div>
						</Card>
					</div>
					<div class={style.cardWrapper}>
						<Card>
							<div class={style.cardHeader}>
								<h2 class=" mdc-typography--title">Change Password</h2>
								<div class=" mdc-typography--caption"></div>
							</div>
							<div class={style.cardBody}>
								<div>
									<Form method="POST" action={config.url.api + "profile/password"} messageOnSuccess="Success! Your password has been changed." resetOnSuccess={true}>
										<TextField type="password" label="Password" name="pwd" required onInput={this.validatePassword} />
										<br/>
										<TextField type="password" label="Verify password" name="pwd_verify" required onInput={this.validatePassword} />
										<span hidden="true"><TextField name="user_id" type="text" value={store.getState().user_id}/></span>
										<SubmitButton value="Change Password" />
									</Form>
								</div>
							</div>
						</Card>
					</div>
					<div class={style.cardWrapper}>
						<Card>
							<div class={style.cardHeader}>
								<h2 class=" mdc-typography--title">Your Bookings</h2>
								<div class=" mdc-typography--caption"></div>
							</div>
							<div class={style.cardBody}>
								<div>
									{(() => {
										let formattedRes = [];
										for(let book of profile.bookingsCustomer) {
											let date1 = book.commences_at.substr(0, 10);
											let date2 = book.ends_at.substr(0, 10);
											formattedRes.push(
												<div>
													<span>=> {date1} ~ {date2}</span> <a href={config.url.gui + "booking/modify/" + book.id}>Edit Booking</a>
												</div>
											);
										}

										if(formattedRes.length === 0) {
											formattedRes.push(
												<div>
													<span>You haven't made any bookings yet</span>
												</div>
											);
										}

										return formattedRes;
									})()}
								</div>
							</div>
						</Card>
					</div>
					<div class={style.cardWrapper}>
						<Card>
							<div class={style.cardHeader}>
								<h2 class=" mdc-typography--title">Your Cars Booked</h2>
								<div class=" mdc-typography--caption"></div>
							</div>
							<div class={style.cardBody}>
								<div>
									{(() => {
										let formattedRes = [];
										for(let book of profile.bookingsProvider) {
											let date1 = book.commences_at.substr(0, 10);
											let date2 = book.ends_at.substr(0, 10);
											formattedRes.push(
												<div>
													<span>=> {date1} ~ {date2}</span> <a href={config.url.gui + "booking/modify/" + book.id}>Edit Booking</a>
												</div>
											);
										}

										if(formattedRes.length === 0) {
											formattedRes.push(
												<div>
													<span>You haven't had any bookings yet.. Why not try <a href={config.url.gui + "vehicle/create"}>making a listing</a>?</span>
												</div>
											);
										}

										return formattedRes;
									})()}
								</div>
							</div>
						</Card>
					</div>
				</div>
			);
		}
	}
}
