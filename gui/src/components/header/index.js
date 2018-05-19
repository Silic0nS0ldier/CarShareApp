import "preact-material-components/Button/style.css"
import "preact-material-components/Drawer/style.css";
import "preact-material-components/List/style.css";
import "preact-material-components/Toolbar/style.css";
import { h, Component } from "preact";
import { route } from "preact-router";
import Button from "preact-material-components/Button"
import Drawer from "preact-material-components/Drawer";
import List from "preact-material-components/List";
import Toolbar from "preact-material-components/Toolbar";
import 'preact-material-components/Theme/style.css';
// import style from "./style";

export default class Header extends Component {
	constructor(props, context) {
		super(props, context);
		props.store.subscribe(data => {
			if (data.user_id) {
				this.setState({
					loggedIn: true
				});
			} else {
				this.setState({
					loggedIn: false
				});
			}
		});
		this.state.loggedIn = props.store.getState().user_id ? true : false;
	}

	closeDrawer() {
		this.drawer.MDComponent.open = false;
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);

	drawerRef = drawer => (this.drawer = drawer);

	linkTo = path => () => {
		route(path);
		this.closeDrawer();
	};

	logout = () => {
		// These will trigger other events.
		localStorage.removeItem("access_token");
		this.props.store.setState({
			user_id: null,
			userImgURL: null,
			imgURL: null
		});
		route("/login");
	};

	goHome = this.linkTo("/");
	goToMyProfile = this.linkTo("/profile");
	goToVehicleListings = this.linkTo("/vehicles");

	render({ config, store }, { loggedIn }) {
		return (
			<div>
				<Toolbar className="toolbar">
					<Toolbar.Row>
						<Toolbar.Section align-start>
							<Toolbar.Icon menu onClick={this.openDrawer}>
								menu
							</Toolbar.Icon>
							<Toolbar.Title>Car Share</Toolbar.Title>
						</Toolbar.Section>
						{
							(() => {
								if (loggedIn) {
									return (
										<Toolbar.Section align-end>
											<Button raised secondary ripple style="align-self: center;right: 10px;" onClick={this.logout}>Logout</Button>
											<img src={store.getState().userImgURL} width="48" height="48" style="border-radius: 50%;"/>
										</Toolbar.Section>
									)
								}
							})()
						}
					</Toolbar.Row>
				</Toolbar>
				<Drawer.TemporaryDrawer ref={this.drawerRef}>
					<Drawer.DrawerContent>
						<Drawer.DrawerItem onClick={this.goHome}>
							<List.ItemGraphic>home</List.ItemGraphic>
							Home
						</Drawer.DrawerItem>
						<Drawer.DrawerItem onClick={this.goToMyProfile}>
							<List.ItemGraphic>account_circle</List.ItemGraphic>
							Profile
						</Drawer.DrawerItem>
						<Drawer.DrawerItem onClick={this.goToVehicleListings}>
							<List.ItemGraphic>view_list</List.ItemGraphic>
							Vehicles
						</Drawer.DrawerItem>
					</Drawer.DrawerContent>
				</Drawer.TemporaryDrawer>
			</div>
		);
	}
}
