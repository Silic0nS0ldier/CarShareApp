import "preact-material-components/Typography/style";
import { h, Component } from "preact";
import { route } from "preact-router";
import style from "./style";
import SubmitButton from "../../components/Forms/SubmitButton";
import TextField from "../../components/Forms/TextFormField";
import Typography from "preact-material-components/Typography";
import Form from "../../components/Forms/Form";

export default class Login extends Component {
    login = response => {
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
            this.setState({
                successMessage: "Your details are right, but we hit a glitch.<br/>Try again and if issues persist contact support."
            });
        });
    };

    render = ({ config }, { successMessage }) => {
        return (
            <div class={style.login}>
                <div><Typography headline4>Login</Typography></div>
                <div>
                    {successMessage}
                </div>
                <Form method="POST" action={config.url.api + "login"}>
                    <TextField type="email" label="Email" name="email" required />
                    <br/>
                    <TextField type="password" label="Password" name="pwd" required />
                    <br/>
                    <SubmitButton value="Login" />
                </Form>
            </div>
        );
    }
}
