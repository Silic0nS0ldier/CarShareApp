import "preact-material-components/Typography/style";
import { h, Component } from "preact";
import Form from "../../components/Forms/Form";
import style from "./style";
import SubmitButton from "../../components/Forms/SubmitButton";
import TextField from "../../components/Forms/TextFormField";
import Typography from "preact-material-components/Typography";

export default class Verify extends Component {
    render = ({ config, email, code }) => {
        return (
            <div class={style.verify}>
                <div><Typography headline4>Credit Inspection</Typography></div>
                <Form method="POST" action={config.url.api + "verify"} messageOnSuccess="Submission successful. We'll let you know the outcome via email.">
                    <span hidden><TextField type="text" name="code" value={code} /></span>
                    <span hidden><TextField type="text" name="email" value={decodeURIComponent(email)} /></span>
                    <TextField type="text" label="License Number" name="license_num" required />
                    <br />
                    <SubmitButton value="Submit" />
                </Form>
            </div>
        );
    }
}
