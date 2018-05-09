import { h, Component } from "preact";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style";
import FormField from "preact-material-components/FormField";
import "preact-material-components/FormField/style";
import Typography from "preact-material-components/Typography";
import "preact-material-components/Typography/style";
import "preact-material-components/Button/style";
import style from "./style";

//import style from './style';

export default class Login extends Component {
    render = () => {
        return (
            <div class={style.login}>
                <form method="POST" action={this.props.config.url.api}>
                    <div><Typography headline4>Login</Typography></div>
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
                        <TextField type="password" label="Password" id="pwd" name="pwd" required />
                    </FormField>
                    <FormField>
                        <TextField type="password" label="Verify password" id="pwd_verify" name="pwd_verify" required  />
                    </FormField>
                    <br/><br/>
                    <label for="usr_img" class={style.file_input_container + " mdc-button mdc-button--outlined " + style.pad_right}>
                        User Photo
                        <input name="usr_img" id="usr_img" required type="file" label="Photo"/>
                    </label>
                    <label for="license_img" class={style.file_input_container + " mdc-button mdc-button--outlined"}>
                        License Photo
                        <input name="license_img" id="license_img" required type="file" label="Photo"/>
                    </label>
                    <br/><br/>
                    <input type="submit" class="mdc-button mdc-button--raised" style="width: 178.77px;" />
                </form>
            </div>
        );
    }
}
