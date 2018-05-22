import 'preact-material-components/LayoutGrid/style.css';
import { h, Component } from 'preact';
import { route } from "preact-router";
import authorizedFetch from "../../../lib/authorizedFetch";
import DateFormField from "../../../components/Forms/DateFormField";
import Form from "../../../components/Forms/Form";
import global from '../../globals';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import SubmitButton from "../../../components/Forms/SubmitButton";
import TextField from "../../../components/Forms/TextFormField";
import TimeFormField from "../../../components/Forms/TimeFormField";

export default class BookingReview extends Component {
    componentDidMount = () => {
        return authorizedFetch(this.props.config.url.api + "booking/" + this.props.bookingid, {
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        }, true)
            .then(response => {
                response.json()
                    .then(data => {
                        if (response.ok) {
                            this.setState({
                                booking: data.data
                            });
                        } else {
                            route("error");
                            console.log("Response NOT ok");
                        }
                    })
                    .catch(error => {
                        route("error");
                        console.log("Failed to fetch booking details.");
                    });
            }).catch(error => {
                route("error");
                console.log("Failed to reach server, cannot fetch booking details.");
            });;
    }

    render({ config, store }, { booking }) {
        if (!booking) {
            return (
                <div>
                    Loading review creation...
                </div>
            );
        } else {
            booking.sdate = booking.commences_at.substr(0, 10);
            booking.edate = booking.ends_at.substr(0, 10);
            booking.stime = booking.commences_at.substr(11, 8);
            booking.etime = booking.ends_at.substr(11, 8);
            return (
                <div class={global.wrapper}>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <h1>
                                    Review for booking: {booking.listing.year} {booking.listing.brand} {booking.listing.model}
                                </h1>
                                <p>Booked for dates: {booking.sdate} ~ {booking.edate}</p>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <div>
                                    <Form method="POST" action={config.url.api + "booking/review"} loginRequired={true}>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="12">
                                                <div>
                                                    <TextField label="Subject" type="text" name="subject" required />
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="12">
                                                <div>
                                                    <TextField label="Comment" type="text" name="comment" required />
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="12">
                                                <div>
                                                    <TextField label="Rating (between 1 and 3)" type="text" name="rating" required />
                                                </div>
                                            </LayoutGrid.Cell>
                                        </LayoutGrid.Inner>
                                        <LayoutGrid.Inner>
                                            <LayoutGrid.Cell cols="12">
                                                <span hidden="true"><TextField name="bookingID" type="text" value={booking.id} /></span>
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