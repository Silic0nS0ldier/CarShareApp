import Typography from "preact-material-components/Typography";
import style from "./style";
import { route } from "preact-router";
import { h, Component } from "preact";
import "preact-material-components/Typography/style";

export default class Verify extends Component {
    start = (_this) => {
        let { config, store, email, otp } = _this.props;

        // Ensure user isn't logged in
        if (localStorage.getItem("session_id")) {
            let e = document.getElementById("verifyProgress");
            e.innerHTML = "You must be logged out to verify an account email.";
            e.style.color = "#C51162";
        } else {
            // Send request to API
            fetch(config.url.api + "verify", {
                method: "POST",
                body: JSON.stringify({
                    email: decodeURIComponent(email),
                    otp
                }),
                cache: "no-cache"
            }).then(response => {
                console.log("success");
                document.getElementById("verifyProgress");
                if (response.status === "200") {
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
                        route(config.url.gui);
                    }).catch(error => {
                        // Something strange happened, but the server has indicated success.
                        route(config.url.gui);
                    });
                } else if (response.status === "400") {
                    let e = document.getElementById("verifyProgress");
                    e.innerHTML = "This email verification link has expired."
                        + "<br/>"
                        + "We know its annoying, but links like this all eventually expire to protect your account."
                        + "<br/><br/>"
                        + "Its not the end of the road though, we've sent a new verification email to " + decodeURIComponent(email);
                    e.style.color = "#C51162";
                } else {
                    throw new Error("Unexpected response from server.");
                }
            }).catch(error => {
                let e = document.getElementById("verifyProgress");
                e.textContent = "Something went wrong.";
                e.style.color = "#C51162";
            });
        }

    };

    render = ({ email }) => {
        return (
            <div class={style.verify}>
                <div><Typography headline4>Email verification</Typography></div>
                <br />
                <div onload={this.start(this)} id="verifyProgress">
                    Verifying your email ({decodeURIComponent(email)}) now...
                </div>
            </div>

        );
    }
}
