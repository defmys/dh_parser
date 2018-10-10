import React from "react";
import fs from 'fs';
import {createConfig} from "./config_factory";

export class ConfigDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.concreteConfig = null;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
    }

    fillState(content) {
        for (let property in content) {
            if (content.hasOwnProperty(property)) {
                this.setState({
                    [property]: content[property]
                });
            }
        }
    }

    initContent() {
        let content = {};
        let textContent = fs.readFileSync(this.props.path, 'utf8');
        try {
            content = JSON.parse(textContent);
        } catch (e) {
            content = {};
        }

        this.concreteConfig = createConfig(content);
        let fixedContent = this.concreteConfig.prepareConfigContent(content);

        this.fillState(fixedContent);
    }

    componentDidMount() {
        this.initContent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.initContent();
        }
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
        let curConfig = this.state;
        curConfig.type = event.target.text;
        this.concreteConfig = createConfig(curConfig);
        let fixedContent = this.concreteConfig.prepareConfigContent(curConfig);
        this.fillState(fixedContent);
    }

    handleSave() {
        fs.writeFileSync(this.props.path, JSON.stringify(this.concreteConfig.content(this.state), null, 2));
    }

    render() {
        let fields = '';
        if (this.concreteConfig) {
            fields = this.concreteConfig.render(this.state, this.handleInputChange, this.handleTypeChange);
        }
        return (
            <div className="text-nowrap">
                {fields}

                <div className="row">
                    <button className="btn btn-primary" onClick={this.handleSave}>Save</button>
                </div>
            </div>
        )
    }
}