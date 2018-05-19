import 'preact-material-components/LayoutGrid/style.css';
import { h, Component } from 'preact';
import authorizedFetch from "../../lib/authorizedFetch";
import LayoutGrid from 'preact-material-components/LayoutGrid';

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
                            data = JSON.parse(JSON.stringify(data));
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
                alert("Server is holidays. Come back later");
            }
        );
    }




    render({ config }, { vehicle }) {
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
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="8">
                                <div class={style.divSpacer + " " + style.gallery}>
                                    IMG GALL
                                </div>
                                <div class={style.divSpacer + " " + style.listingInfo}>
                                    <div class={style.centreText}>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    Brand: {vehicle.brand}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    Model: {vehicle.make}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    Year: {vehicle.year}
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    Type: {vehicle.type}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    AC: {ac ? 'yes' : 'no'}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    Minimum Seating: {vehicle.seat_min}
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    Maximum Seating: {vehicle.seat_max}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    VIN: {vehicle.VIN}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    KMS: {vehicle.odometer}
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    Odometer last updated: {vehicle.odometer_last_update}
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                    </div>
                                </div>
                                <div class={style.divSpacer + " " + style.desc}>
                                    {vehicle.description}
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