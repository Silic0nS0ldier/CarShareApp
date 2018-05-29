import {h, Component} from 'preact';
import authorizedFetch from "../../lib/authorizedFetch";
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Icon from 'preact-material-components/Icon';
import Form from "../../components/Forms/Form";
import SubmitButton from "../../components/Forms/SubmitButton";
import TextField from "../../components/Forms/TextFormField";
import DateFormField from "../../components/Forms/DateFormField";
import TimeFormField from "../../components/Forms/TimeFormField";
import FileField from "../../components/Forms/FileFormField";
import 'preact-material-components/LayoutGrid/style.css';
import global from '../globals';
import style from './style';

export default class VehicleNew extends Component {
    /* componentDidMount = () => {
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
    } */

    render({config}) {
        /* let vehicle = false;
        if(!vehicle) {
            vehicle = true;
            return (
                <div>
                    Loading vehicle creation... 
                </div>
            );
        } else { */
            return (
                <div class={global.wrapper}>
                    <LayoutGrid>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <h1>Create New Vehicle Listing</h1>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols="12">
                                <div>
                                    <Form method="POST"
                                    resetOnSuccess={true}>
                                        <TextField type="text" label="Description" name="desc" required />
                                        <br/>
                                        <TextField type="number" label="Odometer Reading" name="odom" required/>
                                        <br/>
                                        <TextField type="text" label="Brand" name="brand" required />
                                        <br/>
                                        <TextField type="text" label="Model" name="model" required />
                                        <br/>
                                        <TextField type="text" label="type" name="type" required />
                                        <br/>
                                        <TextField type="text" label="Year" name="year" required />
                                        <br/>
                                        <TextField type="number" label="Max seating" name="max_seating" required />
                                        <br/>
                                        <br/>
                                        <FileField label="Font Image" name="fimg" required />
                                        <br/>
                                        <FileField label="Left Image" name="limg" required />
                                        <br/>
                                        <FileField label="Right Image" name="rimg" required />
                                        <br/>
                                        <FileField label="Back Image" name="bimg" required />
                                        <br/>
                                        <SubmitButton value="List Vehicle" />
                                    </Form>
                                </div>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                </div>
            );
       // }
    }
}