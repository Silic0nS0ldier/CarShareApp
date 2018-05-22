import "preact-material-components/Typography/style";
import { h, Component } from "preact";
import { route } from "preact-router";
import Form from "../../components/Forms/Form";
import jwtDecode from "jwt-decode";
import style from "./style";
import SubmitButton from "../../components/Forms/SubmitButton";
import TextField from "../../components/Forms/TextFormField";
import Typography from "preact-material-components/Typography";

export default class Login extends Component {
    login = response => {
        // Finish login
        response.json().then(payload => {
            // Decode token
            const token = jwtDecode(payload.access_token);

            // Add user data to store
            this.props.store.setState({
                user_id: token.user_id,
                userImgURL: this.props.config.url.img + payload.access_token + "/" + token.img,
                imgURL: this.props.config.url.img + payload.access_token + "/"
            });
            // Add access_token to localStorage to allow for session regeneration
            localStorage.setItem("access_token", payload.access_token);
            //  Redirect to home or pending redirect
            if (this.props.redirect) route(this.props.redirect);
            else route("/");
        }).catch(error => {
            console.log(error);
            this.setState({
                lateFailMessage: "Your details are right, but we hit a glitch. Try again and if issues persist contact support."
            });
        });
    };

    render = ({ config, redirect }, { lateFailMessage }) => {
        return (
            <div class={style.login}>
                <div><Typography headline4>Login</Typography></div>
                {(() => {
                    if (redirect) {
                        return (
                            <div>
                                To continue you need to login. Once done, we'll get you back to where you were.
                            </div>
                        )
                    }
                })()}
                <div>
                    {lateFailMessage}
                </div>
                <Form method="POST" action={config.url.api + "login"} onSuccess={this.login}>
                    <TextField type="email" label="Email" name="email" required />
                    <br/>
                    <TextField type="password" label="Password" name="pwd" required />
                    <br/>
                    <SubmitButton value="Login" />
                </Form>
                Don't have an account yet? <br/>
                Pop over <a href={config.url.gui + "register"}> registration</a> and make one today.
            </div>
        );
    }
}
