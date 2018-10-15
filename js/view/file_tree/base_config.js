import React from "react";
import fs from "fs";
import path from "path"
import {faTimesCircle} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export class BaseConfig extends React.Component {
    static fillWithDefault(fixedContent, content, key, defaultValue) {
        fixedContent[key] = content[key] === undefined ? defaultValue: content[key];
    }

    constructor(props) {
        super(props);

        this.state = {
            type: props.configType,
            imgPath: ''
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
        BaseConfig.fillWithDefault(fixedContent, content, 'mount_point');

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

    save() {
        fs.writeFileSync(this.props.path, JSON.stringify(this.content(), null, 2));
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

    renderMountPoint() {
        return <div className="row mt-1" key="mount_point">
            <div className="col-4">Mount Point</div>
            <div className="col-6"><input name="mount_point" className="text-center" value={this.state.mount_point || ''} onChange={this.handleInputChange}/></div>
        </div>
    }

    renderBase() {
        let buffer = [];

        buffer.push(this.renderID());
        buffer.push(this.renderDisplayName());
        buffer.push(this.renderPackage());
        buffer.push(this.renderMountPoint());

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
