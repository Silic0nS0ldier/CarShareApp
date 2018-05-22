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

export default class BookingMessage extends Component {
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
        });
    }

    render({ config }, { booking }) {
        if (!booking) {
            console.log("Before");
            console.log(booking);
            return (
                <div>
                    Loading booking messages now...
                </div>
            );
        } else {
            console.log("After");
            console.log(booking);
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
                                    Booking Messages for: {booking.listing.brand} {booking.listing.model} - {booking.listing.type}
                                </h1>
                                <div>
                                    Owner: <a href={config.url.gui + "profile/" + booking.provider.id}>{booking.provider.fname} {booking.provider.lname}</a>
                                </div>
                                <div>
                                    Pickup: {booking.sdate} - {booking.stime}
                                </div>
                                <div>
                                    Drop Off: {booking.edate} - {booking.etime}
                                </div>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <div>
                                    {(() => {
                                        let output = [];
                                        if(booking.messages.length != 0) {
                                            for(let message of booking.messages) {
                                                output.push (
                                                    <div>
                                                        <div>
                                                            <h4>
                                                                {message.sender.fname} {message.sender.lname}
                                                            </h4>
                                                        </div>
                                                        <div>
                                                            {message.message}
                                                        </div>
                                                        <hr/>
                                                    </div>
                                                );
                                            }
                                        } else {
                                            output.push (
                                                <div>
                                                    There are no messages about this booking. You can start by sending one below.
                                                </div>
                                            );
                                        }
                                        return output;
                                    })()}
                                    <div>
                                        <Form method="POST" action={config.url.api + "booking/new"} loginRequired={true}>
                                            <LayoutGrid.Inner>
                                                <LayoutGrid.Cell cols="12">
                                                    <div>
                                                        <TextField label="Your Message" name="message" required />
                                                    </div>
                                                </LayoutGrid.Cell>
                                            </LayoutGrid.Inner>
                                            <LayoutGrid.Inner>
                                                <LayoutGrid.Cell cols="12">
                                                    <span hidden="true"><TextField name="user_id" type="text" /></span>
                                                    <br />
                                                    <br />
                                                    <SubmitButton value="Send Message" />
                                                </LayoutGrid.Cell>
                                            </LayoutGrid.Inner>
                                        </Form>
                                    </div>
                                </div>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                </div>
            );
        }
    }
}