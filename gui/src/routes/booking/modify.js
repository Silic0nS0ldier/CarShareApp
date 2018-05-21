import { h, Component } from 'preact';
import authorizedFetch from "../../lib/authorizedFetch";
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Icon from 'preact-material-components/Icon';
import Form from "../../components/Forms/Form";
import SubmitButton from "../../components/Forms/SubmitButton";
import TextField from "../../components/Forms/TextFormField";
import DateFormField from "../../components/Forms/DateFormField";
import TimeFormField from "../../components/Forms/TimeFormField";
import 'preact-material-components/LayoutGrid/style.css';
import global from '../globals';
import style from './style';

export default class BookingModify extends Component {
    componentDidMount = () => {
        return authorizedFetch(this.props.config.url.api + "booking/" + this.props.bookingid, {
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        }, true).then(
            (response) => {
                response.json()
                    .then((data) => {
                        if (response.ok) {
                            this.setState({
                                booking: data.data
                            });
                        } else {
                            console.log("Well Shit");
                        }
                    })
                    .catch((error) => {
                        console.log("Something terrible has happened. Please try again.");
                        console.log(error);
                        console.log("Logging session deets");
                        console.log(localStorage.getItem("access_token"));
                    });
            },
            () => {
                alert("Server is on holidays. Come back later");
            }
        );
    }

    render({ config }, { booking }) {
        if (!booking) {
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
                                                <span hidden="true"><TextField name="vin" type="text" value={booking.VIN} /></span>
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