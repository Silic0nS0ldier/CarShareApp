import Card from "preact-material-components/Card";
import Button from "preact-material-components/Button";
import { h, Component } from "preact";
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

	render({user}) {
		return (
			<div class={style.profile}>
				<h1>
					Profile: {user}
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
										{user}
									</span>
								</div>
								<div>
									<h4>
										Email
									</h4>
									<span>

									</span>
								</div>
							</div>
						</div>
						<Card.Actions>
							<Card.ActionButton>OKAY</Card.ActionButton>
						</Card.Actions>
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
								<div>
									<h4>
										New Password
									</h4>
									<span>
										{user}
									</span>
								</div>
								<div>
									<h4>
										New Password Confirmed
									</h4>
									<span>

									</span>
								</div>
							</div>
						</div>
						<Card.Actions>
							<Card.ActionButton>Submit</Card.ActionButton>
						</Card.Actions>
					</Card>
				</div>
			</div>
		);
	}
}
