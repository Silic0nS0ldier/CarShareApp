import { h, Component } from "preact";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style";
import FormField from "preact-material-components/FormField";
import "preact-material-components/FormField/style";
import Typography from "preact-material-components/Typography";
import "preact-material-components/Typography/style";
import "preact-material-components/Button/style";
import LinearProgress from "preact-material-components/LinearProgress";
import "preact-material-components/LinearProgress/style";
import style from "./style";

//import style from './style';

export default class Register extends Component {
    register = e => {
        // Prevent regular form submission
        e.preventDefault();

        // Grab form data
        const form = e.target;
        const formData = new FormData(form);

        // Lock form and clear alerts
        this.formLock(form);
        this.formAlertsClear();

        // Attemt to log user in
        fetch(form.action, {
            method: "POST",
            body: formData
        }).then(response => {
            // Inspect response type
            if (response.status === "200") {
                // Tell user to check email
                this.formAlerts("We've sent you an email. Please use the enclosed link to complete registration.");
            } else if (response.status === "400") {
                // Unlock form and show errors
                this.formUnlock();
                response.json().then(payload => {
                    // Inject feedback into page.
                    this.formAlerts(payload.formAlerts, true);
                }).catch(error => {
                    // We get here and its either a data corruption, server error, or something even stranger.
                    this.formAlerts("We found something wrong with the details you provided, but due to a technical hiccup aren't what.<br/>Please check your details and try again.", true);
                });
            } else {
                throw new Error("Unexpected response from server.");
            }
        }).catch(reason => {
            // This usually happens when we can't connect to the server at all.
            this.formUnlock(form);
            this.formAlerts("An unexpected error occured while processing your registration.<br/>Try again and if issues persist contact support.", true);
        });
        
    };

    formLock = form => {
        // Disable form...
        const uploadDisableStyles = "border-color: rgba(0, 0, 0, 0.37); color: rgba(0, 0, 0, 0.37); pointer-events: none;";
        form.fname.disabled = true;
        form.mname.disabled = true;
        form.lname.disabled = true;
        form.email.disabled = true;
        form.pwd.disabled = true;
        form.pwd_verify.disabled = true;
        form.usr_img.disabled = true;
        form.usr_img.parentNode
            .setAttribute("style", uploadDisableStyles);
        form.license_img.disabled = true;
        form.license_img.parentNode
            .setAttribute("style", uploadDisableStyles);
        form.register_submit.disabled = true;
        
        // ...and show loading indicator
        document.getElementById("register_progress").hidden = false;
    };

    formUnlock = form => {
        // Unlock form
        form.fname.disabled = false;
        form.mname.disabled = false;
        form.lname.disabled = false;
        form.email.disabled = false;
        form.pwd.disabled = false;
        form.pwd_verify.disabled = false;
        form.usr_img.disabled = false;
        form.usr_img.parentNode
            .setAttribute("style", "");
        form.license_img.disabled = false;
        form.license_img.parentNode
            .setAttribute("style", "");
        form.register_submit.disabled = false;

        // Hide progress bar
        document.getElementById("register_progress").hidden = true;
    };

    formAlerts = (message, isError) => {
        let alerts = document.getElementById("register_alerts");
        if (isError) alerts.style.color = "#C51162";
        alerts.innerHTML = message;
        alerts.focus();
    };

    formAlertsClear = () => {
        let alerts = document.getElementById("register_alerts");
        alerts.style.color = "";
        alerts.innerHTML = "";
    };

    extraCheck = {
        password: e => {
            let pwd = e.target.form.pwd;
            let pwd_verify = e.target.form.pwd_verify;
            
            // Validate complexity - more than a little basic
            if (pwd.value.length < 10) pwd.setCustomValidity("Must be at least 10 characters long");
            else pwd.setCustomValidity("");

            // Validate verification
            if (pwd.value !== pwd_verify.value) pwd_verify.setCustomValidity("Passwords must match");
            else pwd_verify.setCustomValidity("");
        },
        image: e => {
            if (e.target.value === "") {
                e.target.parentNode.setAttribute("style", "border-color: #C51162; color: #C51162;");
            } else {
                e.target.parentNode.setAttribute("style", "");
            }
        }
    };

    render = () => {
        return (
            <div class={style.register}>
                <form method="POST" action={this.props.config.url.api + "register"} onSubmit={this.register}>
                    <div><Typography headline4>Register</Typography></div>
                    <div><Typography subtitle1 id="register_alerts"></Typography></div>
                    <FormField class={style.pad_right}>
                        <TextField type="text" label="First name" id="fname" name="fname" required />
                    </FormField>
                    <FormField class={style.pad_right}>
                        <TextField type="text" label="Middle name" id="mname" name="mname" />
                    </FormField>
                    <FormField>
                        <TextField type="text" label="Last name" id="lname" name="lname" required />
                    </FormField>
                    <br/>
                    <FormField>
                        <TextField type="email" label="Email" id="email" name="email" required />
                    </FormField>
                    <br/>
                    <FormField class={style.pad_right}>
                        <TextField type="password" label="Password" id="pwd" name="pwd" required onChange={this.extraCheck.password} />
                    </FormField>
                    <FormField>
                        <TextField type="password" label="Verify password" id="pwd_verify" name="pwd_verify" required onChange={this.extraCheck.password} onFocus={this.extraCheck.password} />
                    </FormField>
                    <br/><br/>
                    <div>
                        <label for="usr_img" class={style.file_input_container + " mdc-button mdc-button--outlined " + style.pad_right}>
                            User Photo*
                            <input name="usr_img" id="usr_img" required type="file" oninvalid={this.extraCheck.image} onChange={this.extraCheck.image} onFocus={this.extraCheck.image}/>
                        </label>
                        <label for="license_img" class={style.file_input_container + " mdc-button mdc-button--outlined"}>
                            License Photo*
                            <input name="license_img" id="license_img" required type="file" oninvalid={this.extraCheck.image} onChange={this.extraCheck.image} onFocus={this.extraCheck.image}/>
                        </label>
                    </div>
                    <br/>
                    <input id="register_submit" value="Register" type="submit" class="mdc-button mdc-button--raised" style="width: 178.77px;"/>
                    <br/>
                    <div><Typography caption>*required fields</Typography></div>
                    <br/>
                    <LinearProgress indeterminate={true} hidden={true} id="register_progress" />
                </form>
            </div>
        );
    }
}
