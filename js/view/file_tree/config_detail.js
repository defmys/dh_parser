import React from "react";

export class ConfigDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.fillState();

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    fillState() {
        for (let property in this.props.data) {
            if (this.props.data.hasOwnProperty(property)) {
                this.setState({
                    [property]: this.props.data[property]
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.fillState();
        }
    }

    handleInputChange(event) {
        console.log('change');
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div class="text-nowrap">
                <div className="row">
                    <div className="col-2">ID</div>
                    <div className="col"><input type="number" name="id" value={this.state.id || 0} onChange={this.handleInputChange}/></div>
                </div>

                <div className="row">
                    <div className="col-2">Type</div>
                    <div className="col"><input name="type" value={this.state.type || "Material"} onChange={this.handleInputChange}/></div>
                </div>

                <div className="row">
                    <div className="col-2">Display Name</div>
                    <div className="col"><input name="display_name" value={this.state.display_name || ''} onChange={this.handleInputChange}/></div>
                </div>

                <div className="row">
                    <div className="col-2">package</div>
                    <div className="col"><input name="package" value={this.state.package || ''} onChange={this.handleInputChange}/></div>
                </div>
            </div>
        )
    }
}