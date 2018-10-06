import React from "react";
import fs from 'fs';

export class ConfigDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
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

    componentDidMount() {
        this.fillState();
    }

    handleInputChange(event) {
        let value = event.target.value;
        if (event.target.name === 'id') {
            value = parseInt(value);
        }

        this.setState({
            [event.target.name]: value
        });
    }

    handleTypeChange(event) {
        this.setState({
            type: event.target.text
        })
    }

    handleSave() {
        fs.writeFileSync(this.props.path, JSON.stringify(this.state, null, 2));
    }

    render() {
        return (
            <div className="text-nowrap">
                <div className="row">
                    <div className="col-2">ID</div>
                    <div className="col"><input type="number" name="id" value={this.state.id || 0} onChange={this.handleInputChange}/></div>
                </div>

                <div className="row">
                    <div className="col-2">Type</div>
                    <div className="col">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="typeDropDown"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.type || "Material"}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="typeDropDown">
                            <a className="dropdown-item" href="#" onClick={this.handleTypeChange}>Actor</a>
                            <a className="dropdown-item" href="#" onClick={this.handleTypeChange}>Material</a>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-2">Display Name</div>
                    <div className="col"><input name="display_name" value={this.state.display_name || ''} onChange={this.handleInputChange}/></div>
                </div>

                <div className="row">
                    <div className="col-2">package</div>
                    <div className="col"><input name="package" value={this.state.package || ''} onChange={this.handleInputChange}/></div>
                </div>

                <div className="row">
                    <button className="btn btn-primary" onClick={this.handleSave}>Save</button>
                </div>
            </div>
        )
    }
}