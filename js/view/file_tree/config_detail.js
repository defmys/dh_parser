import React from "react";
import fs from "fs";
import {ActorConfig} from "./actor_config";
import {MaterialConfig} from "./material_config";
import {NodeCache} from "../../model/nodeCache";
import PropTypes from "prop-types";


const types = {
    Actor: "Actor",
    Material: "Material"
};

const typeName = {
    "Actor": "模型",
    "Material": "材质"
};

const defaultType = types.Material;


export class ConfigDetail extends React.Component {
    static get propTypes() {
        return {
            path: PropTypes.string
        };
    }

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
                };
            }
        } else {
            let textContent = fs.readFileSync(this.props.path, "utf8");
            try {
                content = JSON.parse(textContent);
            } catch (e) {
                content = {
                    type: defaultType
                };
            }

            NodeCache.inst().save(this.props.path, content);
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

    handleTypeChange(type) {
        if (this.configRef.current) {
            let content = this.configRef.current.content();
            this.setState({type: type, content: content});
        }
    }

    saveToCache(configPath) {
        if (this.configRef.current && configPath !== undefined && configPath !== "") {
            NodeCache.inst().save(configPath, this.configRef.current.content());
        }
    }

    save() {
        this.saveToCache(this.props.path);
    }

    renderConfig() {
        let ret = "";
        if (this.state.type) {
            if (this.state.type === types.Actor) {
                ret = <ActorConfig path={this.props.path} configType={this.state.type} content={this.state.content} ref={this.configRef}/>;
            }
            else {
                ret = <MaterialConfig path={this.props.path} configType={this.state.type} content={this.state.content} ref={this.configRef}/>;
            }
        }

        return <div className="col">{ret}</div>;
    }

    render() {
        let curType = "";
        if (this.state.type) {
            curType = this.state.type;
        } else {
            curType = defaultType;
        }

        return (
            <div className="text-nowrap mt-3 mb-3">
                <div className="row">
                    <div className="col-2 text-center">类型</div>
                    <div className="col-3">
                        <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="typeDropDown"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {typeName[curType]}
                        </button>
                        <div className="dropdown-menu text-center" aria-labelledby="typeDropDown">
                            <a className="dropdown-item" href="#" onClick={() => this.handleTypeChange(types.Actor)}>模型</a>
                            <a className="dropdown-item" href="#" onClick={() => this.handleTypeChange(types.Material)}>材质</a>
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
        );
    }
}
