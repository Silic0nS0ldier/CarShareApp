import { h, Component } from "preact";

/**
 * Provides a common set of methods and state values to permit the creation of form fields usable within the Form component.
 */
export default class AbstractField extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: this.props.value,
            name: this.props.name
        }
    }

    getValue() {
        return this.state.value;
    }

    getName() {
        return this.props.name;
    }
}
