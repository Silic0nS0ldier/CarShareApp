import "preact-material-components/Button/style.css";
import "preact-material-components/Card/style.css";
import { h, Component } from "preact";
import authorizedFetch from "../../lib/authorizedFetch";
import Card from "preact-material-components/Card";
import style from "./style";

export default class OtherProfile extends Component {
	componentDidMount = () => {
		return authorizedFetch(this.props.config.url.api + "user/" + this.props.userid, {
			cache: "no-store",
			headers: {
				"Accept": "application/json"
			}
		}, true)
			.then(response => {
				response.json()
					.then((data) => {
						if (response.ok) {
							this.setState({
								profile: data.data
							});
						} else {
							route("error");
							console.log("Response NOT ok");
						}
					})
					.catch(error => {
						route("error");
						console.log("Failed to fetch profile details.");
					});
			}).catch(error => {
				route("error");
				console.log("Failed to reach server, cannot fetch profile details.");
			});
	}

	render({ }, { profile }) {
		if (!profile) {
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

										if (profile.bookingsProvider.length !== 0) {
											for (let book of profile.bookingsProvider) {
												let rev = book.review;
												profile.reviews.push({ sub: rev.subject, comm: rev.comment, rec: rev.recommend });
											}

											for (let rev of profile.reviews) {
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

										if (profile.reviews.length == 0) {
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
