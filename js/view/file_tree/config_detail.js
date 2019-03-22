import React from "react";
import fs from "fs";
import {ActorConfig} from "./actor_config";
import {MaterialConfig} from "./material_config";
import {NodeCache} from "../../model/nodeCache";
import PropTypes from "prop-types";
import {RoomConfig} from "./room_config";
import {InteriorFinishMaterial} from "./interior_m_config";
import {InteriorFinishMaterialGroup} from "./interior_m_g_config";


const types = {
    Actor: "Actor",
    Material: "Material",
    Room: "Room",
    ArchitectureMaterial: "ArchitectureMaterial",
    ArchitectureMaterialGroup: "ArchitectureMaterialGroup"
};

const typeName = {
    "Actor": "物件",
    "Material": "材质",
    "Room": "房间",
    "ArchitectureMaterial": "硬装材质",
    "ArchitectureMaterialGroup": "硬装材质分组",
};

const defaultType = types.Material;


export class ConfigDetail extends React.Component {
    static get propTypes() {
        return {
            path: PropTypes.string,
            root: PropTypes.string
        };
    }

    constructor(props) {
        super(props);

        this.configRef = React.createRef();

        this.state = {
            type: null,

            // 如果窗口右侧的内容被刷新，刷新之前要更新一次此处的content，否则BasicConfig中的内容有可能跟这里不一致。
            content: {}
        };

        this._cache = {};

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

        this._cache = {[content.type]: content};

        if (content.type) {
            this.setState({type: content.type, content: content});
        }
    }

    componentDidMount() {
        this.initContent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.path !== this.props.path) {
            this.saveToCache(prevProps.path);

            this.initContent();
        }
    }

    componentWillUnmount() {
        this.save();
    }

    handleTypeChange(type) {
        let content = {};

        if (this._cache[type] !== null && this._cache[type] !== undefined) {
            content = this._cache[type];
        }
        if (this.configRef.current) {
            this._cache[this.state.type] = this.configRef.current.content();
        }

        NodeCache.inst().save(this.props.path, content);
        this.setState({type: type, content: content});
    }

    saveToCache(configPath) {
        if (this.configRef && this.configRef.current && configPath !== undefined && configPath !== "") {
            let content = this.configRef.current.content();
            NodeCache.inst().save(configPath, content);
            this.setState({content: content});
        }
    }

    save() {
        this.saveToCache(this.props.path);
    }

    renderConfig() {
        let ret = "";
        if (this.state.type) {
            if (this.state.type === types.Actor) {
                ret = <ActorConfig path={this.props.path} root={this.props.root} configType={this.state.type} content={this.state.content} ref={this.configRef}/>;
            }
            else if (this.state.type === types.Room) {
                ret = <RoomConfig path={this.props.path} root={this.props.root} configType={this.state.type} content={this.state.content} ref={this.configRef}/>;
            }
            else if (this.state.type === types.ArchitectureMaterial) {
                ret = <InteriorFinishMaterial path={this.props.path} root={this.props.root} configType={this.state.type} content={this.state.content} ref={this.configRef}/>;
            }
            else if (this.state.type === types.ArchitectureMaterialGroup) {
                ret = <InteriorFinishMaterialGroup path={this.props.path} root={this.props.root} configType={this.state.type} content={this.state.content} ref={this.configRef}/>;
            }
            else {
                ret = <MaterialConfig path={this.props.path} root={this.props.root} configType={this.state.type} content={this.state.content} ref={this.configRef}/>;
            }
        }

        return <div className="col">{ret}</div>;
    }

    renderTypeDropdownList() {
        let buffer = [];

        for (let curType in types) {
            if (types.hasOwnProperty(curType) && typeName.hasOwnProperty(curType)) {
                buffer.push(<a className="dropdown-item" href="#" key={typeName[curType]} onClick={() => this.handleTypeChange(curType)}>{typeName[curType]}</a>);
            }
        }

        return buffer;
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
                    <div className="col-2 text-center d-flex justify-content-center flex-column">类型</div>
                    <div className="col-3">
                        <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="typeDropDown"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {typeName[curType]}
                        </button>
                        <div className="dropdown-menu text-center" aria-labelledby="typeDropDown">
                            {this.renderTypeDropdownList()}
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
