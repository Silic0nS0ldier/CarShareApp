import 'preact-material-components/LayoutGrid/style.css';
import { h, Component } from 'preact';
import { route } from "preact-router";
import authorizedFetch from "../../lib/authorizedFetch";
import DateFormField from "../../components/Forms/DateFormField";
import Form from "../../components/Forms/Form";
import global from '../globals';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import SubmitButton from "../../components/Forms/SubmitButton";
import TextField from "../../components/Forms/TextFormField";
import TimeFormField from "../../components/Forms/TimeFormField";

export default class BookingNew extends Component {
    componentDidMount = () => {
        return authorizedFetch(this.props.config.url.api + "vehicle/" + this.props.vin, {
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        }, true)
            .then(response => {
                response.json()
                    .then(data => {
                        if (response.ok) {
                            data.odometer_last_update = (new Date(data.odometer_last_update)).toLocaleDateString();
                            this.setState({
                                vehicle: data
                            });
                        } else {
                            route("error");
                            console.log("Response NOT ok");
                        }
                    })
                    .catch((error) => {
                        route("error");
                        console.log("Failed to fetch listing details.");
                    });
            }).catch(error => {
                route("error");
                console.log("Failed to reach server, cannot fetch listing details.");
            });
    }

    render({ config }, { vehicle }) {
        if (!vehicle) {
            return (
                <div>
                    Loading booking now
                </div>
            );
        } else {
            return (
                <div class={global.wrapper}>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <h1>
                                    New Booking for: {vehicle.brand} {vehicle.model} - {vehicle.type}
                                </h1>
                                <div>
                                    <span>Owner: {vehicle.owner.fname} {vehicle.owner.lname}</span>
                                </div>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <div>
                                    <Form method="POST" action={config.url.api + "booking/new"} loginRequired={true}>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="6">
                                                <div>
                                                    <DateFormField label="Start Date" name="sdate" required />
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="6">
                                                <div>
                                                    <DateFormField label="End Date" name="edate" required />
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="6">
                                                <div>
                                                    <TimeFormField label="Start Time" name="stime" required />
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="6">
                                                <div>
                                                    <TimeFormField label="End Time" name="etime" required />
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="12">
                                                <span hidden="true"><TextField name="vin" type="text" value={vehicle.VIN} /></span>
                                                <center>
                                                    <br />
                                                    <br />
                                                    <SubmitButton value="Book Now" />
                                                </center>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                    </Form>
                                </div>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                </div>
            );
        }
    }
}