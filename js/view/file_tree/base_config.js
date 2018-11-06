import React from "react";
import fs from "fs";
import path from "path";
import PropTypes from "prop-types";

import {faTimesCircle} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export class BaseConfig extends React.Component {
    static fillWithDefault(fixedContent, content, key, defaultValue) {
        fixedContent[key] = content[key] === undefined ? defaultValue: content[key];
    }

    static get propTypes() {
        return {
            path: PropTypes.string,
            configType: PropTypes.string,
            content: PropTypes.any
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            type: props.configType,
            imgPath: "",
            color_tag: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.initContent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.initContent();
        }
    }

    initContent() {
        let fixedContent = this.prepareConfigContent(this.props.content);
        this.fillState(fixedContent);

        this.initThumbnailPath();
    }

    initThumbnailPath() {
        const dirPath = path.dirname(this.props.path);
        const dirName = dirPath.split(path.sep).pop();

        let imgPath = path.join(dirPath, dirName + ".png");
        if (!fs.existsSync(imgPath)) {
            imgPath = path.join(dirPath, dirName + ".jpg");
            if (!fs.existsSync(imgPath)) {
                imgPath = "";
            }
        }
        this.setState({imgPath: imgPath});
    }

    prepareConfigContent(content) {
        let fixedContent = {};

        BaseConfig.fillWithDefault(fixedContent, content, "id", 0);
        BaseConfig.fillWithDefault(fixedContent, content, "type", "Material");
        BaseConfig.fillWithDefault(fixedContent, content, "display_name", "");
        BaseConfig.fillWithDefault(fixedContent, content, "package", "");
        BaseConfig.fillWithDefault(fixedContent, content, "mount_point", "");
        BaseConfig.fillWithDefault(fixedContent, content, "ref_path", "");

        return fixedContent;
    }

    fillState(content) {
        for (let property in content) {
            if (content.hasOwnProperty(property)) {
                this.setState({
                    [property]: content[property]
                });
            }
        }

        this.setState({type: this.props.configType});
    }

    content() {
        let content = {};
        content.id = this.state.id;
        content.type = this.state.type;
        content.display_name = this.state.display_name;
        content.package = this.state.package;
        content.mount_point = this.state.mount_point;
        content.ref_path = this.state.ref_path;
        return content;
    }

    handleInputChange(event) {
        let value = event.target.value;
        if (event.target.name === "id") {
            value = parseInt(value);
        }

        this.setState({
            [event.target.name]: value
        });
    }

    renderID() {
        return <div className="row mt-1" key="id">
            <div className="col-4">ID</div>
            <div className="col-8"><input type="number" name="id" className="text-center" value={this.state.id || 0} style={{width: "100%"}} onChange={this.handleInputChange}/></div>
        </div>;
    }

    renderDisplayName() {
        return <div className="row mt-1" key="display_name">
            <div className="col-4">显示名称</div>
            <div className="col-8"><input name="display_name" className="text-center" value={this.state.display_name || ""} style={{width: "100%"}} onChange={this.handleInputChange}/></div>
        </div>;
    }

    renderPackage() {
        return <div className="row mt-1" key="package">
            <div className="col-4">包名</div>
            <div className="col-8"><input name="package" className="text-center" value={this.state.package || ""} style={{width: "100%"}} onChange={this.handleInputChange}/></div>
        </div>;
    }

    renderRefPath() {
        return <div className="row mt-1" key="ref_path">
            <div className="col-2">引用路径</div>
            <div className="col"><input name="ref_path" className="" value={this.state.ref_path || ""} style={{width: "100%"}} onChange={this.handleInputChange}/></div>
        </div>;
    }

    renderMountPoint() {
        return <div className="row mt-1" key="mount_point">
            <div className="col-2">挂载点</div>
            <div className="col"><input name="mount_point" className="" value={this.state.mount_point || ""} style={{width: "100%"}} onChange={this.handleInputChange}/></div>
        </div>;
    }

    renderBasePart1() {
        let buffer = [];


        buffer.push(this.renderID());
        buffer.push(this.renderDisplayName());
        buffer.push(this.renderPackage());

        return buffer;
    }

    renderBasePart2() {
        let buffer = [];

        buffer.push(this.renderMountPoint());
        buffer.push(this.renderRefPath());

        return buffer;
    }

    additionalRender() {
        return "";
    }

    render() {
        let buffer = [];

        let img = "";
        if (this.state.imgPath !== "") {
            img = <img className="border border-1" src={this.state.imgPath} height="130px" width="130px" data-toggle="tooltip" data-placement="bottom" title="缩略图"/>;
        } else {
            img = <div style={{opacity: 0.1}}><FontAwesomeIcon icon={faTimesCircle} className="fa-8x" data-toggle="tooltip" data-placement="bottom" title="未找到缩略图"/></div>;
        }

        buffer.push(<div className="row" key="configBaseRow1">
            <div className="col d-flex justify-content-center flex-column">
                {this.renderBasePart1()}
            </div>
            <div className="col text-center">
                {img}
            </div>
        </div>);

        buffer.push(<div className="row" key="configBaseRow2">
            <div className="col mt-2">
                {this.renderBasePart2()}
            </div>
        </div>);

        buffer.push(
            <div className="row" key="configAdditionalRow">
                <div className="col">
                    {this.additionalRender()}
                </div>
            </div>
        );

        return buffer;
    }
}
