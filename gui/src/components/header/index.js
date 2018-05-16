import Toolbar from "preact-material-components/Toolbar";
import Switch from "preact-material-components/Switch";
import List from "preact-material-components/List";
import Drawer from "preact-material-components/Drawer";
import Dialog from "preact-material-components/Dialog";
import { route } from "preact-router";
import { h, Component } from "preact";
import "preact-material-components/Toolbar/style.css";
import "preact-material-components/Switch/style.css";
import "preact-material-components/List/style.css";
import "preact-material-components/Drawer/style.css";
import "preact-material-components/Dialog/style.css";
// import style from "./style";

export default class Header extends Component {
	closeDrawer() {
		this.drawer.MDComponent.open = false;
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);

	openSettings = () => this.dialog.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);

	linkTo = path => () => {
		route(path);
		this.closeDrawer();
	};

	goHome = this.linkTo("/");
	goToMyProfile = this.linkTo("/profile");
	goToVehicleListings = this.linkTo("/vehicles");

	render() {
		return (
			<div>
				<Toolbar className="toolbar">
					<Toolbar.Row>
						<Toolbar.Section align-start>
							<Toolbar.Icon menu onClick={this.openDrawer}>
								menu
							</Toolbar.Icon>
							<Toolbar.Title>CareShare</Toolbar.Title>
						</Toolbar.Section>
						<Toolbar.Section align-end onClick={this.openSettings}>
							<Toolbar.Icon>settings</Toolbar.Icon>
						</Toolbar.Section>
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
