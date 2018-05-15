import style from "./style.css";
import "preact-material-components/Button/style.css";
import { h } from "preact";
import AbstractField from "../AbstractField";

/**
 * Provides a common set of methods and state values to permit the creation of form fields usable within the Form component.
 */
export default class FileFormField extends AbstractField {
    constructor(props, context) {
        super(props, context);
        if (props.name === undefined) {
            console.error("Name is required.");
        }

        this.state.style = style.file_form_field;
        this.state.value = [];
    }

    componentDidMount = () => {
        // Ensure input style is updated with reasonable speed
        this.disabler = setInterval(() => {
            let parent = this.state.input.parentElement;
            while (parent.tagName !== "FIELDSET") {
                parent = parent.parentElement;
            }
            if (parent.disabled) {
                this.setState({ style: style.disabled });
            } else if (this.state.style === style.disabled) {
                this.pingStyles();
            }
        }, 1500);
    };

    componentWillUnmount = () => {
        clearInterval(this.disabler);
    }

    pingStyles = () => {
        if (this.state.input.checkValidity()) {
            this.setState({
                style: ""
            });
        }
    };

    pingInvalidStyles = (e) => {
        this.setState({
            style: style.invalid
        });
    };

    grabData = (e) => {
        // Clear existing files
        this.state.value = [];
        // Add files
        for (let i = 0; i < e.target.files.length; i++) {
            // New file reader must be used each time to ensure as it isn't a quene
            let reader = new FileReader();
            reader.onload = e => {
                // Store data
                this.state.value.push(e.target.result);
                this.setState({});
            };
            reader.readAsDataURL(e.target.files[i]);
        }
        // Update styles
        this.pingStyles();
    };

    render(props) {
        return (
            <div>
                <label for={props.name} class={this.state.style + " " + style.file_form_field + " mdc-button mdc-button--outlined"}>
                    <div>
                    {props.label}
                    {(() => {
                        if (props.required) return "*";
                    })()}
                    </div>
                    <input {...props} id={props.name} type="file" ref={(ref) => this.state.input = ref} oninvalid={this.pingInvalidStyles} onChange={this.grabData} onFocus={this.pingStyles} />
                </label>
                <br/>
                <i>{this.state.value.length} files selected</i>
            </div>
        )
    }
}
