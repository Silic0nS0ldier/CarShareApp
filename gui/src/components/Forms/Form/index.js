import "preact-material-components/LinearProgress/style.css";
import "preact-material-components/Typography/style.css";
import { h, Component, cloneElement } from "preact";
import { route } from "preact-router";
import LinearProgress from "preact-material-components/LinearProgress";
import style from "./style.css";
import Typography from "preact-material-components/Typography";


export default class Form extends Component {
    constructor(props, context) {
        super(props, context);

        // Init state
        this.state.hideProgress = true;
        this.state.fields = [];

        // Grab references to children (recursively to enable advanced styling)
        const refChildren = children => {
            for (let i = 0; i < children.length; i++) {
                if (children[i].children.length > 0)
                    refChildren(children[i].children);
                else {
                    if (typeof children[i].nodeName !== "string") {
                        if (["TextFormField"].indexOf(children[i].nodeName.name) !== -1) {
                            // Handle field component
                            children[i] = cloneElement(children[i], {
                                ref: (ref) => this.state.fields.push(ref)
                            });
                        }
                    }
                }
            }
        }
        refChildren(this.props.children);

        // Standardise undefined values
        if (!this.props.action) this.props.action = "";
        if (!this.props.method) this.props.method = "GET";
    }

    submitStart = (e) => {
        e.preventDefault();

        // Switch for submission mode
        this.modeSubmit();

        // Submit form
        (() => {
            if (!this.props.method || this.props.method === "GET" || this.props.method === "HEAD") {
                // GET and HEAD requests require different handling.
                return fetch(((url) => {
                    let values = this.getValues();
                    return url + "?" + Object.keys(values)
                        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(values[k]))
                        .join("&");
                })(this.props.action), {
                        method: this.props.method,
                        cache: "no-cache"
                    });
            } else {
                // Everything else
                return fetch(this.props.action, {
                    method: this.props.method,
                    cache: "no-cache",
                    body: JSON.stringify(this.getValues()),
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                });
            }
        })().then(this.submitSuccess, this.submitFailure);
    }

    submitSuccess = (response) => {
        // Unlock
        this.modeInput();

        if (response.ok) {
            // Handle success
            if (this.props.onSuccess) this.props.onSuccess(response);

            // Unlock form
            this.modeInput();

            // Redirect?
            if (this.props.redirectOnSuccess) {
                route(this.props.redirectOnSuccess);
                return;
            }

            // Message?
            if (this.props.messageOnSuccess) {
                this.setState({
                    messageClass: "",
                    messageContent: this.props.messageOnSuccess
                });
            } else {
                // No? Well, still need to reset (just in case there was an error message before)
                this.setState({
                    messageClass: "",
                    messageContent: ""
                });
            }

            // Reset?
            if (this.props.resetOnSuccess) {
                this.state.form.reset();
            }

        } else if (response.status === 404) {
            this.setState({
                messageClass: style.formWarning,
                messageContent: "An error occured while submitting the form. (404)"
            });
        } else {
            // General error or supplied
            if (this.props.errorFormatter) {
                this.props.errorFormatter(response)
                    .then(({ messageContent, isError }) => {
                        if (isError) {
                            this.setState({
                                messageClass: style.formWarning,
                                messageContent: messageContent
                            });
                        } else {
                            this.setState({
                                messageClass: "",
                                messageContent: messageContent
                            });
                        }
                    })
            } else {
                this.setState({
                    messageClass: style.formWarning,
                    messageContent: "An error occured while submitting the form."
                });
            }
        }
    }

    submitFailure = (error) => {
        // Unlock
        this.modeInput();

        // Show feedback
        this.setState({
            messageClass: style.formWarning,
            messageContent: "An error occured while submitting the form."
        });
    }

    getValues = () => {
        let values = {};
        for (let field of this.state.fields) {
            values[field.getName()] = field.getValue();
        }
        return values;
    }

    modeSubmit = () => {
        this.state.fieldset.setAttribute("disabled", "disabled");
        this.setState({
            hideProgress: false
        });
    }

    modeInput = () => {
        this.state.fieldset.removeAttribute("disabled");
        this.setState({
            hideProgress: true
        });
    }

    render({ children }, { messageClass, messageContent, hideProgress }) {
        return (
            <form ref={(ref) => this.state.form = ref} onSubmit={this.submitStart}>
                {(() => {
                    if (messageContent) {
                        return (
                            <div class={style.formMessage + " " + messageClass}>
                                <Typography subtitle1>{messageContent}</Typography>
                            </div>
                        );
                    }
                })}
                <fieldset class={style.fieldset} ref={(ref) => this.state.fieldset = ref}>
                    {children}
                </fieldset>
                <LinearProgress indeterminate={true} hidden={hideProgress} />
            </form>
        );
    }
}
