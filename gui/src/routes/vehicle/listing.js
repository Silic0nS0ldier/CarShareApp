import 'preact-material-components/LayoutGrid/style.css';
import { h, Component } from 'preact';
import authorizedFetch from "../../lib/authorizedFetch";
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Icon from 'preact-material-components/Icon';

import style from './style';

export default class VehicleListing extends Component {

    componentDidMount = () => {
        return authorizedFetch(this.props.config.url.api + "vehicle/" + this.props.vin, {
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        }, true).then(
            (response) => {
                response.json()
                    .then((data) => {
                        if (response.ok) {
                            data.odometer_last_update = (new Date(data.odometer_last_update)).toLocaleDateString();
                            this.setState({
                                vehicle: data
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
        );
    }

    render({ config, store }, { vehicle }) {
        if (!vehicle) {
            return (
                <div>
                    I'm waiting!
                </div>
            );
        } else {
            var ac = vehicle.ac;
            return (
                <div>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <h1>
                                    Car: {vehicle.year} {vehicle.brand} {vehicle.model}
                                </h1>
                                {/*Looks like Facebook looks for specific page details before showing UI. This won't work.<a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(config.url.gui + vehicle.VIN)}>Share on Facebook</a>
                                <br />*/}
                                <a target="_blank" href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent("Check out this listing on Car Share!") + "&url=" + encodeURIComponent(config.url.gui + vehicle.VIN)}>Share on Twitter</a>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="8">
                                <div class={style.divSpacer + " " + style.gallery}>
                                    <div class={style.innerGall}>
                                        <div>
                                            <img src={store.getState().imgURL + vehicle.imageFront[0].num + "." + vehicle.imageFront[0].integrity + "." + vehicle.imageFront[0].extension} />
                                        </div>
                                        <div>
                                            <img src={store.getState().imgURL + vehicle.imageLeft[0].num + "." + vehicle.imageLeft[0].integrity + "." + vehicle.imageLeft[0].extension} />
                                        </div>
                                        <div>
                                            <img src={store.getState().imgURL + vehicle.imageBack[0].num + "." + vehicle.imageBack[0].integrity + "." + vehicle.imageBack[0].extension} />
                                        </div>
                                        <div>
                                            <img src={store.getState().imgURL + vehicle.imageRight[0].num + "." + vehicle.imageRight[0].integrity + "." + vehicle.imageRight[0].extension} />
                                        </div>
                                    </div>
                                </div>
                                <div class={style.divSpacer + " " + style.listingInfo}>
                                    <div>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="12">
                                                <h2>
                                                    Car Specs
                                                </h2>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                    </div>
                                    <div>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell desktopCols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>drive_eta</Icon> Brand: {vehicle.brand}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell desktopCols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>drive_eta</Icon> Model: {vehicle.model}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell desktopCols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>directions_car</Icon> Type: {vehicle.type}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell desktopCols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>calendar_today</Icon> Year: {vehicle.year}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell desktopCols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>person</Icon> Minimum Seating: {vehicle.seat_min}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell desktopCols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>group</Icon> Maximum Seating: {vehicle.seat_max}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell desktopCols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>ac_unit</Icon> AC: {ac ? 'Yes' : 'No'}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell desktopCols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>call_to_action</Icon> VIN: {vehicle.VIN}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell desktopCols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>map</Icon> KMS: {vehicle.odometer}km ({vehicle.odometer_last_update})
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                    </div>
                                </div>
                                <div class={style.divSpacer + " " + style.desc}>
                                    <LayoutGrid.Inner>
                                        <LayoutGrid.Cell cols="12">
                                            <h2>
                                                Description
                                            </h2>
                                        </LayoutGrid.Cell>
                                    </LayoutGrid.Inner>
                                    <LayoutGrid.Inner>
                                        <LayoutGrid.Cell cols="12">
                                            <p>
                                                {vehicle.description}
                                            </p>
                                        </LayoutGrid.Cell>
                                    </LayoutGrid.Inner>
                                </div>
                            </LayoutGrid.Cell>
                            <LayoutGrid.Cell cols="4">
                                <div class={style.divSpacer + " " + style.owner}>
                                    Thing 1
                                </div>
                                <div class={style.divSpacer + " " + style.dates}>
                                    Thing 2
                                </div>
                                <div class={style.divSpacer + " " + style.reviews}>
                                    Thing 4
                                </div>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                </div>
            );
        }
    }
}