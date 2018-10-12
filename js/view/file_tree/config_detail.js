import React from "react";
import fs from 'fs';
import {ActorConfig} from "./actor_config";
import {MaterialConfig} from "./material_config";


const defaultType = 'Material';


export class ConfigDetail extends React.Component {
    constructor(props) {
        super(props);

        this.configRef = React.createRef();

        this.state = {
            type: null,
            content: {}
        };

        this.handleTypeChange = this.handleTypeChange.bind(this);
    }

    initContent() {
        let content = {};
        let textContent = fs.readFileSync(this.props.path, 'utf8');
        try {
            content = JSON.parse(textContent);
        } catch (e) {
            content = {
                type: defaultType
            };
        }

        if (content.type) {
            this.setState({type: content.type, content: content});
        }
    }

    componentDidMount() {
        this.initContent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.initContent();
        }
    }

    handleTypeChange(event) {
        this.setState({type: event.target.text});
    }

    save() {
        if (this.configRef.current) {
            this.configRef.current.save();
        }
    }

    renderConfig() {
        let ret = '';
        if (this.state.type) {
            if (this.state.type === "Actor") {
                ret = <ActorConfig path={this.props.path} configType={this.state.type} content={this.state.content} ref={this.configRef}/>
            }
            else {
                ret = <MaterialConfig path={this.props.path} configType={this.state.type} content={this.state.content} ref={this.configRef}/>
            }
        }

        return <div className="col">{ret}</div>
    }

    render() {
        return (
            <div className="text-nowrap">
                <div className="row">
                    <div className="col">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="typeDropDown"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.type || defaultType}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="typeDropDown">
                            <a className="dropdown-item" href="#" onClick={this.handleTypeChange}>Actor</a>
                            <a className="dropdown-item" href="#" onClick={this.handleTypeChange}>Material</a>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {this.renderConfig()}
                </div>
            </div>
        )
    }
}
