import {BaseConfig} from "./base_config";
import React from "react";
import {ColorTag} from "../../model/tag";

export class MaterialConfig extends BaseConfig {

    constructor(props) {
        super(props);

        this.handleColorTagChange = this.handleColorTagChange.bind(this);
    }

    prepareConfigContent (content) {
        let fixedContent = super.prepareConfigContent(content);

        BaseConfig.fillWithDefault(fixedContent, content, "color_tag", []);

        return fixedContent;
    }

    content() {
        let content = super.content();

        content.color_tag = this.state.color_tag;

        return content;
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

    renderColorTag() {
        const dropDown = [];
        const tags = ColorTag.inst().tags;
        const basicStyle={cursor: "pointer", width: "90px"};

        for (let tag_idx in tags) {
            if (tags.hasOwnProperty(tag_idx)) {
                const style = {...basicStyle, ...ColorTag.getCheckboxStyle(tag_idx)};
                dropDown.push(<div className="colorTagCheckboxDiv input-group-text mr-1 mt-1" key={tag_idx} style={style} onClick={() => this.handleColorTagChange(parseInt(tag_idx))}>
                    <input type="checkbox" aria-label={tags[tag_idx]} style={{cursor: "pointer"}}
                        onChange={() => {}}
                        checked={this.state.color_tag.includes(parseInt(tag_idx))}/>
                    {tags[tag_idx]}
                </div>);
            }
        }

        return <div className="row mt-2 mb-2" key="color_tag">
            <div className="col-2">色系</div>
            <div className="col">
                <div className="input-group">
                    {dropDown}
                </div>
            </div>
        </div>;
    }

    additionalRender() {
        let buffer = [];

        buffer.push(<div className="row mt-4 border border-1 border-secondary rounded" key="tagRow">
            <div className="col">
                {this.renderColorTag()}
            </div>
        </div>);

        return buffer;
    }
}