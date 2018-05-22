import Card from "preact-material-components/Card";
import Button from "preact-material-components/Button";
import authorizedFetch from "../../lib/authorizedFetch";
import { h, Component } from "preact";
import "preact-material-components/Button/style.css";
import "preact-material-components/Card/style.css";

import style from "./style";

export default class OtherProfile extends Component {
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

	componentDidMount = () => {
        return authorizedFetch(this.props.config.url.api + "user/" + this.props.userid, {
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
							console.log(data.data);
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

	render({profile}) {
		profile = this.state.profile;
		if(!profile) {
			return (
				<div>
					Loading a user's profile...
				</div>
			);
		} else {
			return (
				<div class={style.profile}>
					<h1>
						Profile: {profile.fname} {profile.lname}
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
											{profile.fname} {profile.lname}
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
								<h2 class=" mdc-typography--title">Review History</h2>
								<div class=" mdc-typography--caption"></div>
							</div>
							<div class={style.cardBody}>
								<div class="reviewsCont">
									{(() => {
										let formattedRes = [];
										profile.reviews = [];

										if(profile.bookingsProvider[0].review != null) {
											for(let book of profile.bookingsProvider) {
												let rev = book.review;
												profile.reviews.push({sub: rev.subject, comm: rev.comment, rec: rev.recommend});
											}
										
											for(let rev of profile.reviews) {
												formattedRes.push(
													<div class="revSep">
														<p>
															<em>
																{rev.sub}
															</em>
														</p>
														<p>
															{rev.comm}
														</p>
														<p>
															Recommendedation: {rev.rec}
														</p>
													</div>
												);
											}
										}

										if(profile.reviews.length == 0) {
											formattedRes.push(
												<div class="revSep">
													<p>
														<em>
															There is currently no reviews for this listing
														</em>
													</p>
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
