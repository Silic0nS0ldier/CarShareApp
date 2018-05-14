import "preact-material-components/TextField/style.css";
import AbstractField from "../AbstractField";
import { h } from "preact";
import TextField from "preact-material-components/TextField";
import linkState from "linkstate";

/**
 * Provides a common set of methods and state values to permit the creation of form fields usable within the Form component.
 */
export default class TextFormField extends AbstractField {
    constructor(props, context) {
        super(props, context);
        // Complain about things that will cause quirks.
        if (["email", "number", "password", "search", "tel", "text", "url"].indexOf(props.type) === -1) {
            console.error(`"${props.type}" is not a type supported by TextField. Expect quirks.`);
        }
        if (props.name === undefined) {
            console.error("Name is required.");
        }
    }

    render(props) {
        return <TextField {...props} onChange={linkState(this, "value")} />;
    }
}
