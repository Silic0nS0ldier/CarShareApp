import "preact-material-components/Button/style.css"
import { h, Component } from "preact";

/**
 * Provides a common set of methods and state values to permit the creation of form fields usable within the Form component.
 */
export default class SubmitButton extends Component {
    render(props) {
        return <input {...props} class="mdc-button mdc-button--raised" type="submit" />
    }
}
