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
import { route } from "preact-router";

//import style from './style';

export default class Login extends Component {
    login = e => {
        // Prevent regular form submission
        e.preventDefault();

        // Grab form data
        const form = e.target;
        const formData = new FormData(form);

        // Lock form and clear alerts
        this.formLock(form);
        this.formAlertsClear();

        // Attempt to log user in
        fetch(form.action, {
            method: "POST",
            body: formData,
            cache: "no-cache"
        }).then(response => {
            // Inspect response type
            if (response.status === "200") {
                // Finish login
                response.json().then(payload => {
                    // Add user data to store
                    store.setState({
                        user: payload.user,
                        session_id: payload.session_id,
                        url: {
                            api: config.url.api + payload.session_id + "/",
                            img: config.url.img + payload.session_id + "/"
                        }
                    });
                    // Add session_id to localStorage to allow for session regeneration
                    localStorage.setItem("session_id", payload.session_id);
                    //  Redirect to home or pending redirect
                    if (this.props.redirect) route(this.props.redirect);
                    else route("/");
                }).catch(error => {
                    // Unlock form and show error message
                    this.formUnlock();
                    this.formAlerts("Your details are right, but we hit a glitch.<br/>Try again and if issues persist contact support.", true);
                });
            } else if (response.status === "400") {
                // Unlock form and show error message
                this.formUnlock();
                this.formAlerts("Email or password incorrect. Please try again.", true);
            } else {
                throw new Error("Unexpected response from server.");
            }
        }).catch(error => {
            // This usually happens when we can't connect to the server at all.
            this.formUnlock(form);
            this.formAlerts("An unexpected error occured while logging you in.<br/>Try again and if issues persist contact support.", true);
        });
    };

    formLock = form => {
        form.email.disabled = true;
        form.pwd.disabled = true;
        form.login_submit.disabled = true;

        document.getElementById("login_progress").hidden = false;
    };

    formUnlock = form => {
        form.email.disabled = false;
        form.pwd.disabled = false;
        form.login_submit.disabled = false;

        document.getElementById("login_progress").hidden = true;
    };

    formAlerts = (message, isError) => {
        let alerts = document.getElementById("login_alerts");
        if (isError) alerts.style.color = "#C51162";
        alerts.innerHTML = message;
        alerts.focus();
    };

    formAlertsClear = () => {
        let alerts = document.getElementById("login_alerts");
        alerts.style.color = "";
        alerts.innerHTML = "";
    };

    render = () => {
        return (
            <div class={style.login}>
                <form method="POST" action={this.props.config.url.api + "login"} onSubmit={this.login}>
                    <div><Typography headline4>Login</Typography></div>
                    <div><Typography subtitle1 id="login_alerts"></Typography></div>
                    <FormField>
                        <TextField type="email" label="Email" id="email" name="email" required />
                    </FormField>
                    <br />
                    <FormField class={style.pad_right}>
                        <TextField type="password" label="Password" id="pwd" name="pwd" required />
                    </FormField>
                    <br />
                    <input id="login_submit" value="Login" type="submit" class="mdc-button mdc-button--raised" style="width: 178.77px;" />
                    <br />
                    <div><Typography caption>*required fields</Typography></div>
                    <br />
                    <LinearProgress indeterminate={true} hidden={true} id="login_progress" />
                </form>
            </div>
        );
    }
}
