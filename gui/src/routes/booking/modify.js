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

<<<<<<< HEAD
    render({config}, {booking}) {
        if(!booking) {
=======
    render({ config }, { booking }) {
        if (!booking) {
>>>>>>> bbdfc4b4d7e10c37a03830f3843479d7fcb05147
            return (
                <div>
                    Loading booking now
                </div>
            );
        } else {
            booking.sdate = booking.commences_at.substr(0,10);
            booking.edate = booking.ends_at.substr(0, 10);
            booking.stime = booking.commences_at.substr(11, 8);
            booking.etime = booking.ends_at.substr(11, 8);
            return (
                <div class={global.wrapper}>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <h1>
                                    Modify Booking for: {booking.listing.brand} {booking.listing.model} - {booking.listing.type}
                                </h1>
                                <div>
<<<<<<< HEAD
                                    <span>Owner: {booking.provider.fname} {booking.provider.lname}</span>
=======
                                    Owner: {booking.provider.fname} {booking.provider.lname}
>>>>>>> bbdfc4b4d7e10c37a03830f3843479d7fcb05147
                                </div>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <div>
<<<<<<< HEAD
                                <Form method="POST" action={config.url.api + "booking/new"} loginRequired={true}>
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
                                            <span hidden="true"><TextField name="vin" type="text" value={booking.VIN}/></span>
                                            <center>
                                                <br/>
                                                <br/>
                                                <SubmitButton value="Book Now" />
                                            </center>
                                        </LayoutGrid.Cell>
                                    </LayoutGrid.Inner>
                                </Form>
=======
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
>>>>>>> bbdfc4b4d7e10c37a03830f3843479d7fcb05147
                                </div>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                </div>
            );
        }
    }
}