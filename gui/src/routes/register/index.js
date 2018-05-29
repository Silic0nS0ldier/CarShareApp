import "preact-material-components/Typography/style";
import { h, Component } from "preact";
import FileField from "../../components/Forms/FileFormField";
import Form from "../../components/Forms/Form";
import style from "./style";
import SubmitButton from "../../components/Forms/SubmitButton";
import TextField from "../../components/Forms/TextFormField";
import Typography from "preact-material-components/Typography";

export default class Register extends Component {
    // Validate password
    validatePassword = e => {
        let pwd = e.target.form.pwd;
        let pwd_verify = e.target.form.pwd_verify;

        // Validate complexity - more than a little basic
        if (pwd.value.length < 10) pwd.setCustomValidity("Must be at least 10 characters long");
        else pwd.setCustomValidity("");

        //Validate same
        if (pwd.value !== pwd_verify.value) pwd_verify.setCustomValidity("Passwords must match");
        else pwd_verify.setCustomValidity("");
    };

    render = ({ config }, { successMessage }) => {
        return (
            <div class={style.register}>
                <div><Typography headline4>Register</Typography></div>
                <Form method="POST" action={config.url.api + "register"}
                    messageOnSuccess="We've sent you an email. Please use the enclosed link to continue to the final phase of registration."
                    resetOnSuccess={true}>
                    <TextField type="text" label="First name" name="fname" required />
                    <TextField type="text" label="Middle name" name="mname" />
                    <TextField type="text" label="Last name" name="lname" required />
                    <br />
                    <TextField type="email" label="Email" name="email" required />
                    <br />
                    <TextField type="password" label="Password" name="pwd" required onInput={this.validatePassword} />
                    <TextField type="password" label="Verify password" name="pwd_verify" required onInput={this.validatePassword} />
                    <br />
                    <FileField label="User Photo" name="usr_img" required />
                    <br />
                    <SubmitButton value="Register" />
                </Form>
                Already have an account?
                <br />
                Head over to <a href={config.url.gui + "login"}>login</a> to continue
            </div>
        );
    }
}
