import 'preact-material-components/LayoutGrid/style.css';
import { h, Component } from "preact";
import Form from "../../components/Forms/Form";
import LayoutGrid from 'preact-material-components/LayoutGrid';
import style from "./style";
import SubmitButton from "../../components/Forms/SubmitButton";
import TextField from "../../components/Forms/TextFormField";


export default class VehicleModify extends Component {
    render({ config }) {
        return (
            <div>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols="12">
                            <h1>
                                Car Listing Title Editing
                            </h1>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
                <LayoutGrid>
                    <LayoutGrid.Cell cols="12">
                        <div>
                            <Form method="POST" action={config.url.api + "vehicle/modify"} loginRequired={true}>
                                <div class={style.formSection}>
                                    <TextField type="email" label="Email" name="email" required />
                                    <br/>
                                    <TextField type="password" label="Password" name="pwd" required />
                                </div>
                                <div class={style.formSection}>
                                    <TextField type="email" label="Email" name="email" required />
                                    <br/>
                                    <TextField type="password" label="Password" name="pwd" required />
                                </div>
                                <div class={style.formSection}>
                                    <TextField type="email" label="Email" name="email" required />
                                    <br/>
                                    <TextField type="password" label="Password" name="pwd" required />
                                </div>
                                <div class={style.formSection}>
                                    <TextField type="email" label="Email" name="email" required />
                                    <br/>
                                    <TextField type="password" label="Password" name="pwd" required />
                                </div>
                                <div class={style.formSection}>
                                    <TextField type="email" label="Email" name="email" required />
                                    <br/>
                                    <TextField type="password" label="Password" name="pwd" required />
                                </div>
                                <SubmitButton value="Save" />
                            </Form>
                        </div>
                    </LayoutGrid.Cell>
                </LayoutGrid>
            </div>
        );
    }
}