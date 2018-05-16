import "preact-material-components/Drawer/style.css";
import "preact-material-components/List/style.css";
import "preact-material-components/Toolbar/style.css";
import { h, Component } from "preact";
import { route } from "preact-router";
import Drawer from "preact-material-components/Drawer";
import List from "preact-material-components/List";
import Toolbar from "preact-material-components/Toolbar";
// import style from "./style";

export default class Header extends Component {
	closeDrawer() {
		this.drawer.MDComponent.open = false;
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);

	drawerRef = drawer => (this.drawer = drawer);

	linkTo = path => () => {
		route(path);
		this.closeDrawer();
	};

	goHome = this.linkTo("/");
	goToMyProfile = this.linkTo("/profile");
	goToVehicleListings = this.linkTo("/vehicles");

	render({ config, store }) {
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
								if (store.getState().user) {
									return (
										<Toolbar.Section align-end>
											<Toolbar.Icon>settings</Toolbar.Icon>
											<img src={config.url.img + store.getState().user.image} width="48" height="48" style="border-radius: 50%;"/>
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
