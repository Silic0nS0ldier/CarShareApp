import 'preact-material-components/LayoutGrid/style.css';
import { h, Component } from 'preact';
import authorizedFetch from "../../lib/authorizedFetch";
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import style from './style';
import { route } from "preact-router";

export default class VehicleListing extends Component {

    componentDidMount = () => {
        return authorizedFetch(this.props.config.url.api + "vehicle/" + this.props.vin, {
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        }, true)
            .then(response => {
                response.json()
                    .then((data) => {
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

    render({ config, store }, { vehicle }) {
        console.log("triggered"); console.log(vehicle);
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
                                    <div>
                                        <h2>
                                            Owner: {vehicle.owner.fname} {vehicle.owner.lname}
                                        </h2>
                                        <div>
                                            {vehicle.owner.email}
                                        </div>
                                        <div>
                                            <a href={this.props.config.url.gui + "profile/" + vehicle.owner.id}>View Profile</a>
                                        </div>
                                    </div>
                                </div>
                                <div class={style.divSpacer + " " + style.dates}>
                                    <div>
                                        <h2>
                                            Bookings:
                                        </h2>
                                        <div>
                                            <span>The follow dates are already booked.</span>
                                            {(() => {
                                                let formattedRes = [];
                                                vehicle.books = [];
                                                for (let book of vehicle.bookings) {
                                                    let date1 = null;
                                                    let date2 = null;
                                                    date1 = book.commences_at.substr(0, 10);
                                                    date2 = book.ends_at.substr(0, 10);
                                                    vehicle.books.push({ sdate: date1, edate: date2 });
                                                }

                                                for (let book of vehicle.books) {
                                                    formattedRes.push(
                                                        <div>{book.sdate} - {book.edate}</div>
                                                    );
                                                }

                                                return formattedRes;
                                            })()}
                                            <a href={config.url.gui + "booking/new/" + vehicle.VIN}>Book Now</a>
                                        </div>
                                    </div>
                                </div>
                                <div class={style.divSpacer + " " + style.reviews}>
                                    <div>
                                        <h2>
                                            Reviews:
                                        </h2>
                                        <div class="reviewsCont">
                                            {(() => {
                                                let formattedRes = [];
                                                vehicle.reviews = [];

                                                if (vehicle.bookings.length !== 0) {
                                                    for (let book of vehicle.bookings) {
                                                        let rev = book.review;
                                                        vehicle.reviews.push({ sub: rev.subject, comm: rev.comment, rec: rev.recommend });
                                                    }

                                                    for (let rev of vehicle.reviews) {
                                                        formattedRes.push(
                                                            <div class="revSep">
                                                                <p>
                                                                    <em>
                                                                        {rev.sub}
                                                                    </em>
                                                                </p>
                                                                <p>
                                                                    {rev.comm}
                                                                </p>
                                                                <p>
                                                                    Recommendedation: {rev.rec}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                }

                                                if (vehicle.reviews.length == 0) {
                                                    formattedRes.push(
                                                        <div class="revSep">
                                                            <p>
                                                                <em>
                                                                    There is currently no reviews for this listing
                                                                </em>
                                                            </p>
                                                        </div>
                                                    );
                                                }

                                                return formattedRes;
                                            })()}
                                        </div>
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