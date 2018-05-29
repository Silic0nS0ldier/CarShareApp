import "preact-material-components/TextField/style.css";
import AbstractField from "../AbstractField";
import { h } from "preact";
import TextField from "preact-material-components/TextField";
import linkState from "linkstate";

/**
 * Provides a common set of methods and state values to permit the creation of form fields usable within the Form component.
 */
export default class DateFormField extends AbstractField {
    constructor(props, context) {
        super(props, context);
        // Complain about things that will cause quirks.
        if (props.name === undefined) {
            console.error("Name is required.");
        }
    }

    render(props) {
        return <TextField {...props} type="date" id={props.name} onChange={linkState(this, "value")} style="padding-top: 0;" />;
    }
}
