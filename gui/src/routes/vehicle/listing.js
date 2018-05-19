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
                alert("Server is on holidays. Come back later");
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
                                    <div class={style.innerGall}>
                                        <div>
                                            <img src="http://localhost:8888/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1MjY3MzUxNjQxMzAsImV4cCI6MTUyNzk0NDc2NDEzMCwiaW1nIjoiMC5zaGE1MTItUzgzVFhNM2VkN3BicUNQY2ltNkU5QW9XS0NSSGZmbjQ1OUJuTkhnekpDZWFpOVFzbGNqZXpLN1phd3ExRmhWYkxNSXdyRkprQnVGMWNEYXZzbmR5NkE9PS5wbmcifQ.5qGvGst-P52jj_nu3Q84knuELMh2oMmuPQSsGgqmTGc/0.sha512-S83TXM3ed7pbqCPcim6E9AoWKCRHffn459BnNHgzJCeai9QslcjezK7Zawq1FhVbLMIwrFJkBuF1cDavsndy6A==.png"/>
                                        </div>
                                        <div>
                                            <img src="http://localhost:8888/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1MjY3MzUxNjQxMzAsImV4cCI6MTUyNzk0NDc2NDEzMCwiaW1nIjoiMC5zaGE1MTItUzgzVFhNM2VkN3BicUNQY2ltNkU5QW9XS0NSSGZmbjQ1OUJuTkhnekpDZWFpOVFzbGNqZXpLN1phd3ExRmhWYkxNSXdyRkprQnVGMWNEYXZzbmR5NkE9PS5wbmcifQ.5qGvGst-P52jj_nu3Q84knuELMh2oMmuPQSsGgqmTGc/0.sha512-S83TXM3ed7pbqCPcim6E9AoWKCRHffn459BnNHgzJCeai9QslcjezK7Zawq1FhVbLMIwrFJkBuF1cDavsndy6A==.png" />
                                        </div>
                                        <div>
                                            <img src="http://localhost:8888/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1MjY3MzUxNjQxMzAsImV4cCI6MTUyNzk0NDc2NDEzMCwiaW1nIjoiMC5zaGE1MTItUzgzVFhNM2VkN3BicUNQY2ltNkU5QW9XS0NSSGZmbjQ1OUJuTkhnekpDZWFpOVFzbGNqZXpLN1phd3ExRmhWYkxNSXdyRkprQnVGMWNEYXZzbmR5NkE9PS5wbmcifQ.5qGvGst-P52jj_nu3Q84knuELMh2oMmuPQSsGgqmTGc/0.sha512-S83TXM3ed7pbqCPcim6E9AoWKCRHffn459BnNHgzJCeai9QslcjezK7Zawq1FhVbLMIwrFJkBuF1cDavsndy6A==.png" />
                                        </div>
                                        <div>    
                                            <img src="http://localhost:8888/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1MjY3MzUxNjQxMzAsImV4cCI6MTUyNzk0NDc2NDEzMCwiaW1nIjoiMC5zaGE1MTItUzgzVFhNM2VkN3BicUNQY2ltNkU5QW9XS0NSSGZmbjQ1OUJuTkhnekpDZWFpOVFzbGNqZXpLN1phd3ExRmhWYkxNSXdyRkprQnVGMWNEYXZzbmR5NkE9PS5wbmcifQ.5qGvGst-P52jj_nu3Q84knuELMh2oMmuPQSsGgqmTGc/0.sha512-S83TXM3ed7pbqCPcim6E9AoWKCRHffn459BnNHgzJCeai9QslcjezK7Zawq1FhVbLMIwrFJkBuF1cDavsndy6A==.png" />
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
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>drive_eta</Icon> Brand: {vehicle.brand}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                <Icon>drive_eta</Icon> Model: {vehicle.model}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>calendar_today</Icon> Year: {vehicle.year}
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>directions_car</Icon> Type: {vehicle.type}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>ac_unit</Icon> AC: {ac ? 'yes' : 'no'}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>person</Icon> Minimum Seating: {vehicle.seat_min}
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>group</Icon> Maximum Seating: {vehicle.seat_max}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>call_to_action</Icon> VIN: {vehicle.VIN}
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>map</Icon> KMS: {vehicle.odometer}
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="4">
                                                <div class={style.divSpacerMini}>
                                                    <Icon>calendar_today</Icon> Odometer last updated: {vehicle.odometer_last_update}
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