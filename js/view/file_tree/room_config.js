import React from "react";
import {BaseConfig} from "./base_config";
import {ColorTagRenderer} from "./color_tag";
import {RoomStyle, RoomType} from "../../model/tag";
import path from "path";
import fs from "fs";

export class RoomConfig extends BaseConfig {
    constructor(props) {
        super(props);

        this.handleIsDatChange = this.handleIsDatChange.bind(this);
        this.handleDisplaySizeChange = this.handleDisplaySizeChange.bind(this);
        this.handleColorTagChange = this.handleColorTagChange.bind(this);
        this.handleRoomTypeChange = this.handleRoomTypeChange.bind(this);
        this.handleRoomStyleChange = this.handleRoomStyleChange.bind(this);
    }

    initialSate(props) {
        let state = super.initialSate(props);
        state["is_dat"] = false;
        state["display_size"] = "";
        state["color_tag"] = [];
        state["room_type"] = 1;
        state["room_style"] = 1;
        state["level_name"] = "";
        state["download_path"] = "";
        return state;
    }

    initContent() {
        super.initContent();
        this.initDownloadURL();
    }

    initDownloadURL() {
        const dirPath = path.dirname(this.props.path);
        const relativePath = path.relative(this.props.root, this.props.path);
        const relativePathNames = path.dirname(relativePath).split(path.sep);
        const dirName = dirPath.split(path.sep).pop();

        let fileName = "";
        let fileList = fs.readdirSync(dirPath);
        if (fileList && fileList.length > 0) {
            fileList.forEach((file) => {
                const filePath = path.resolve(dirPath, file);
                let stat = fs.statSync(filePath);
                if (!stat.isDirectory()) {
                    const extname = path.posix.extname(filePath);
                    const basename = path.posix.basename(file, extname);
                    if ((extname.toLowerCase() === ".dat") && basename === dirName) {
                        fileName = file;
                    }
                }
            });
        }

        this.setState({
            download_path: path.posix.join(...relativePathNames, fileName).toString()
        });
    }

    prepareConfigContent (content) {
        let fixedContent = super.prepareConfigContent(content);

        BaseConfig.fillWithDefault(fixedContent, content, "is_dat", false);
        BaseConfig.fillWithDefault(fixedContent, content, "display_size", "");
        BaseConfig.fillWithDefault(fixedContent, content, "color_tag", []);
        BaseConfig.fillWithDefault(fixedContent, content, "room_type", 1);
        BaseConfig.fillWithDefault(fixedContent, content, "room_style", 1);
        BaseConfig.fillWithDefault(fixedContent, content, "level_name", "");
        BaseConfig.fillWithDefault(fixedContent, content, "download_path", "");

        return fixedContent;
    }

    content() {
        let content = super.content();

        content.is_dat = this.state.is_dat;
        content.display_size = this.state.display_size;
        content.color_tag = this.state.color_tag;
        content.room_type = this.state.room_type;
        content.room_style = this.state.room_style;
        content.level_name = this.state.level_name;
        content.download_path = this.state.download_path;

        return content;
    }

    handleIsDatChange() {
        this.setState({"is_dat": !this.state.is_dat});
    }

    handleDisplaySizeChange(event) {
        this.setState({"display_size": event.target.value});
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

    handleRoomTypeChange(idx) {
        this.setState({"room_type": idx});
    }

    handleRoomStyleChange(idx) {
        this.setState({"room_style": idx});
    }

    renderRoomType() {
        const tags = RoomType.inst().tags;

        let room_type = this.state.room_type;
        if (tags[room_type] === undefined) {
            room_type = 1;
        }

        let buffer = [];
        for (let tagIdx in tags) {
            if (tags.hasOwnProperty(tagIdx)) {
                buffer.push(<a className="dropdown-item" href="#" key={tagIdx} onClick={() => this.handleRoomTypeChange(parseInt(tagIdx))}>{tags[tagIdx]}</a>);
            }
        }

        return <div className="col">
            <div className="row p-2 text-center font-weight-bold" style={{fontSize: "12pt"}}>
                <div className="col">空间类型</div>
            </div>
            <div className="row justify-content-center">
                <div className="col-8">
                    <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="roomTypeDropDown"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {tags[room_type.toString()]}
                    </button>
                    <div className="dropdown-menu text-center" aria-labelledby="roomTypeDropDown">
                        {buffer}
                    </div>
                </div>
            </div>
        </div>;
    }

    renderRoomStyle() {
        const tags = RoomStyle.inst().tags;

        let room_style = this.state.room_style;
        if (tags[room_style] === undefined) {
            room_style = 1;
        }

        let buffer = [];
        for (let tagIdx in tags) {
            if (tags.hasOwnProperty(tagIdx)) {
                buffer.push(<a className="dropdown-item" href="#" key={tagIdx} onClick={() => this.handleRoomStyleChange(parseInt(tagIdx))}>{tags[tagIdx]}</a>);
            }
        }

        return <div className="col">
            <div className="row p-2 text-center font-weight-bold" style={{fontSize: "12pt"}}>
                <div className="col">空间风格</div>
            </div>
            <div className="row justify-content-center">
                <div className="col-8">
                    <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="roomStyleDropDown"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {tags[room_style.toString()]}
                    </button>
                    <div className="dropdown-menu text-center" aria-labelledby="roomStyleDropDown">
                        {buffer}
                    </div>
                </div>
            </div>
        </div>;
    }

    renderBasePart1() {
        let buffer = super.renderBasePart1();
        buffer.push(<div className="row mt-1" key="display_size">
            <div className="col-4">房间尺寸</div>
            <div className="col-8"><input name="displaySize" className="text-center" value={this.state.display_size} style={{width: "100%"}} onChange={this.handleDisplaySizeChange}/></div>
        </div>);
        return buffer;
    }

    renderBasePart2() {
        let buffer = super.renderBasePart2();
        buffer.push(<div className="row mt-1" key="level_name">
            <div className="col-2">Level Name</div>
            <div className="col"><input name="level_name" value={this.state.level_name} style={{width: "100%"}} onChange={this.handleInputChange}/></div>
        </div>);
        buffer.push(
            <div className="row mt-1" key="is_dat">
                <div className="col-2">是否为存档文件</div>
                <div className="col"><input name="is_dat" type="checkbox" className="" checked={this.state.is_dat} onChange={this.handleIsDatChange}/></div>
            </div>
        );
        return buffer;
    }

    additionalRender() {
        let buffer = [];

        buffer.push(<div className="row mt-4 border border-1 border-secondary rounded" key="color_tag">
            <div className="col">
                <ColorTagRenderer color_tag={this.state.color_tag} handler={this.handleColorTagChange}/>
            </div>
        </div>);

        buffer.push(<div className="row mt-4 p-2 border border-1 border-secondary rounded" key="room_tags">
            {this.renderRoomType()}
            {this.renderRoomStyle()}
        </div>);

        return buffer;
    }
}
