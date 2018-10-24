import React from "react";
import fs from 'fs';
import {ActorConfig} from "./actor_config";
import {MaterialConfig} from "./material_config";
import {NodeCache} from "../../model/nodeCache";


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

        if (NodeCache.inst().hasCache(this.props.path)) {
            content = NodeCache.inst().load(this.props.path);

            if (!content.type) {
                content = {
                    type: defaultType
                }
            }
        } else {
            let textContent = fs.readFileSync(this.props.path, 'utf8');
            try {
                content = JSON.parse(textContent);
            } catch (e) {
                content = {
                    type: defaultType
                };
            }

            NodeCache.inst().save(this.props.path, content)
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
            this.saveToCache(prevProps.path);

            this.initContent();
        }
    }

    handleTypeChange(event) {
        this.setState({type: event.target.text});
    }

    saveToCache(configPath) {
        if (this.configRef.current && configPath !== undefined && configPath !== '') {
            NodeCache.inst().save(configPath, this.configRef.current.content());
        }
    }

    save() {
        this.saveToCache(this.props.path);
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
            <div className="text-nowrap mt-2">
                <div className="row mt-2">
                    <div className="col-2 text-center">Type</div>
                    <div className="col-3">
                        <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="typeDropDown"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.type || defaultType}
                        </button>
                        <div className="dropdown-menu text-center" aria-labelledby="typeDropDown">
                            <a className="dropdown-item" href="#" onClick={this.handleTypeChange}>Actor</a>
                            <a className="dropdown-item" href="#" onClick={this.handleTypeChange}>Material</a>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col">
                        {this.renderConfig()}
                    </div>
                </div>
            </div>
        )
    }
}
