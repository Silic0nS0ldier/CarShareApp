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

export default class BookingModify extends Component {
    componentDidMount = () => {
        return authorizedFetch(this.props.config.url.api + "booking/" + this.props.bookingid, {
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        }, true).then(response => {
            response.json()
                .then(data => {
                    if (response.ok) {
                        this.setState({
                            booking: data.data
                        });
                    } else {
                        route("/error");
                        console.log("Response NOT ok");
                    }
                })
                .catch(error => {
                    route("/error");
                    console.log("Failed to fetch booking details.");
                });
        }).catch(error => {
            route("/error");
            console.log("Failed to reach server, cannot fetch booking details.");
        });
    }

    success = () => {
        route("/profile");
    };

    render({ config }, { booking }) {
        if (!booking) {
            return (
                <div>
                    Loading booking now
                </div>
            );
        } else {
            booking.sdate = booking.commences_at.substr(0, 10);
            booking.edate = booking.ends_at.substr(0, 10);
            booking.stime = booking.commences_at.substr(11, 8);
            booking.etime = booking.ends_at.substr(11, 8);
            return (
                <div class={global.wrapper}>INCOMPLETE: API needs to be created
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <h1>
                                    Modify Booking for: {booking.listing.brand} {booking.listing.model} - {booking.listing.type}
                                </h1>
                                <div>
                                    Owner: {booking.provider.fname} {booking.provider.lname}
                                </div>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <div>
                                    <Form method="POST" action={config.url.api + "booking/modify"} loginRequired={true} onSuccessMessage="Booking modified, you'll be redirected to your profile shortly." onSuccess={this.success}>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="6">
                                                <div>
                                                    <DateFormField label="Start Date" name="sdate" value={booking.sdate} required />
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="6">
                                                <div>
                                                    <DateFormField label="End Date" name="edate" value={booking.edate} required />
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="6">
                                                <div>
                                                    <TimeFormField label="Start Time" name="stime" value={booking.stime} required />
                                                </div>
                                            </LayoutGrid.Cell>
                                            <LayoutGrid.Cell cols="6">
                                                <div>
                                                    <TimeFormField label="End Time" name="etime" value={booking.etime} required />
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="12">
                                                <span hidden="true"><TextField name="vin" type="text" value={booking.VIN} /></span>
                                                <center>
                                                    <br />
                                                    <br />
                                                    <SubmitButton value="MODIFY" />
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