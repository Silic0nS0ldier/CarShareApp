import 'preact-material-components/LayoutGrid/style.css';
import { h, Component } from 'preact';
import Form from "../../components/Forms/Form";
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import style from './style';
import TextField from "../../components/Forms/TextFormField";
import global from "../globals";

export default class VehicleListings extends Component {

    populatePage = (response) => {
        response.json()
            .then(payload => {
                this.setState({
                    vehicles: payload.data,
                    errorLoading: false
                });
            })
            .catch(error => {
                this.setState({
                    errorLoading: true
                });
            });
    };

    render({ config, store }, { vehicles, errorLoading }) {
        return (
            <div>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols="12">
                            <h1>
                                Search for a vehicle
                            </h1>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols="12">
                            <div class={style.searchBar}>
                                <Form action={config.url.api + "vehicle/search"} onSuccess={this.populatePage} loginRequired={true}>
                                    <TextField type="text" label={<Icon>search</Icon>} name="term" style="width: calc(100vw - 78px);" />
                                </Form>
                            </div>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        {(() => {
                            if (!vehicles) {
                                if (!errorLoading) {
                                    return (
                                        <LayoutGrid.Cell cols="12">
                                            <div class={style.results}>
                                                Awaiting your query!
                                            </div>
                                        </LayoutGrid.Cell>
                                    );
                                } else {
                                    return (
                                        <LayoutGrid.Cell cols="12">
                                            <div class={style.results}>
                                                We encountered an error processing your query. 😕
                                            </div>
                                        </LayoutGrid.Cell>
                                    );
                                }
                                return "Awaiting your query!";
                            } else if (vehicles.length === 0) {
                                return (
                                    <LayoutGrid.Cell cols="12">
                                        <div class={style.results}>
                                            Your query returned no results.
                                        </div>
                                    </LayoutGrid.Cell>
                                );
                            } else {
                                let formattedListings = [];
                                
                                for (let vehicle of vehicles) {
                                    formattedListings.push(
                                        <LayoutGrid.Cell cols="12">
                                            <LayoutGrid.Inner>
                                                <LayoutGrid.Cell cols="4">
                                                    <img width="250" src={store.getState().imgURL + vehicle.imageFront[0].num + "." + vehicle.imageFront[0].integrity + "." + vehicle.imageFront[0].extension}/>
                                                </LayoutGrid.Cell>
                                                <LayoutGrid.Cell cols="8">
                                                    <div>
                                                        <a href={config.url.gui + "vehicle/" + vehicle.VIN}><h3>{vehicle.year} {vehicle.brand} {vehicle.model}</h3></a>
                                                    </div>
                                                    <div class={style.listingsSpecs}>
                                                        <div>
                                                            <span>
                                                                <Icon>calendar_today</Icon> {vehicle.year}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                <Icon>drive_eta</Icon> {vehicle.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p>{vehicle.summary}</p>
                                                    </div>
                                                </LayoutGrid.Cell>
                                            </LayoutGrid.Inner>
                                        </LayoutGrid.Cell>
                                    );
                                }
                                return formattedListings;
                            }
                        })()}
                    </LayoutGrid.Inner>
                </LayoutGrid>

            </div>
        );
    }
}