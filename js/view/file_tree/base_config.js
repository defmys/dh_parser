import React from "react";
import fs from "fs";
import path from "path"
import {faTimesCircle} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ColorTag} from "../../model/tag";


export class BaseConfig extends React.Component {
    static fillWithDefault(fixedContent, content, key, defaultValue) {
        fixedContent[key] = content[key] === undefined ? defaultValue: content[key];
    }

    constructor(props) {
        super(props);

        this.state = {
            type: props.configType,
            imgPath: '',
            color_tag: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleColorTagChange = this.handleColorTagChange.bind(this);
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

        let imgPath = path.join(dirPath, dirName + '.png');
        if (!fs.existsSync(imgPath)) {
            imgPath = path.join(dirPath, dirName + '.jpg');
            if (!fs.existsSync(imgPath)) {
                imgPath = ''
            }
        }
        this.setState({imgPath: imgPath});
    }

    prepareConfigContent(content) {
        let fixedContent = {};

        BaseConfig.fillWithDefault(fixedContent, content, 'id', 0);
        BaseConfig.fillWithDefault(fixedContent, content, 'type', 'Material');
        BaseConfig.fillWithDefault(fixedContent, content, 'display_name', '');
        BaseConfig.fillWithDefault(fixedContent, content, 'package', '');
        BaseConfig.fillWithDefault(fixedContent, content, 'mount_point', '');
        BaseConfig.fillWithDefault(fixedContent, content, 'ref_path', '');
        BaseConfig.fillWithDefault(fixedContent, content, 'color_tag', []);

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
        content.color_tag = this.state.color_tag;
        return content;
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

    handleColorTagChange(idx) {
        let color_tag = Object.assign([], this.state.color_tag);
        if (color_tag.includes(idx)) {
            color_tag.splice(color_tag.indexOf(idx), 1);
        } else {
            color_tag.push(idx);
        }
        this.setState({color_tag: color_tag});
    }

    renderID() {
        return <div className="row mt-1" key="id">
                    <div className="col-4">ID</div>
                    <div className="col-6"><input type="number" name="id" className="text-center" value={this.state.id || 0} onChange={this.handleInputChange}/></div>
                </div>;
    }

    renderDisplayName() {
        return <div className="row mt-1" key="display_name">
                    <div className="col-4">Display Name</div>
                    <div className="col-6"><input name="display_name" className="text-center" value={this.state.display_name || ''} onChange={this.handleInputChange}/></div>
                </div>;
    }

    renderPackage() {
        return <div className="row mt-1" key="package">
                    <div className="col-4">package</div>
                    <div className="col-6"><input name="package" className="text-center" value={this.state.package || ''} onChange={this.handleInputChange}/></div>
                </div>;
    }

    renderRefPath() {
        return <div className="row mt-1" key="ref_path">
            <div className="col-4">Reference Path</div>
            <div className="col-6"><input name="ref_path" className="text-center" value={this.state.ref_path || ''} onChange={this.handleInputChange}/></div>
        </div>
    }

    renderMountPoint() {
        return <div className="row mt-1" key="mount_point">
            <div className="col-4">Mount Point</div>
            <div className="col-6"><input name="mount_point" className="text-center" value={this.state.mount_point || ''} onChange={this.handleInputChange}/></div>
        </div>
    }

    renderColorTag() {
        const dropDown = [];
        const tags = ColorTag.inst().tags;

        for (let tag_idx in tags) {
            if (tags.hasOwnProperty(tag_idx)) {
                dropDown.push(<div className="colorTagCheckboxDiv input-group-text mr-1 mt-1" style={{cursor: 'pointer', width: '90px'}} key={tag_idx}  onClick={() => this.handleColorTagChange(parseInt(tag_idx))}>
                    <input type="checkbox" aria-label={tags[tag_idx]} style={{cursor: 'pointer'}}
                           onChange={() => this.handleColorTagChange(parseInt(tag_idx))}
                           checked={this.state.color_tag.includes(parseInt(tag_idx))}/>
                    {tags[tag_idx]}
                </div>);
            }
        }

        return <div className="row mt-2 mb-2" key="color_tag">
            <div className="col-2">Color Tag</div>
            <div className="col">
                <div className="input-group">
                    {dropDown}
                </div>
            </div>
        </div>
    }

    renderBase() {
        let buffer = [];

        buffer.push(this.renderID());
        buffer.push(this.renderDisplayName());
        buffer.push(this.renderPackage());
        buffer.push(this.renderMountPoint());
        buffer.push(this.renderRefPath());

        return buffer;
    }

    additionalRender() {
        return ''
    }

    render() {
        let buffer = [];

        let img = '';
        if (this.state.imgPath !== '') {
            img = <img className="border border-1" src={this.state.imgPath} height="130px" width="130px" data-toggle="tooltip" data-placement="bottom" title="缩略图"/>
        } else {
            img = <div style={{opacity: 0.1}}><FontAwesomeIcon icon={faTimesCircle} className="fa-8x" data-toggle="tooltip" data-placement="bottom" title="未找到缩略图"/></div>
        }

        buffer.push(<div className="row" key="configBaseRow">
            <div className="col">
                {this.renderBase()}
            </div>
            <div className="col text-center">
                {img}
            </div>
        </div>);

        buffer.push(<div className="row mt-2 border border-1 border-secondary rounded" key="tagRow">
            <div className="col">
                {this.renderColorTag()}
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
