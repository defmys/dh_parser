import {BaseConfig} from "./base_config";
import React from "react";
import {ColorTag, MajorTag, MaterialTag, SubTag, TagHierarchy} from "../../model/tag";

export class MaterialConfig extends BaseConfig {

    constructor(props) {
        super(props);

        this.handleColorTagChange = this.handleColorTagChange.bind(this);
        this.handleSubTagChange = this.handleSubTagChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }

    initialSate(props) {
        let state = super.initialSate(props);
        state["color_tag"] = [];
        state["sub_tag"] = [];
        state["category"] = [];
        return state;
    }

    prepareConfigContent (content) {
        let fixedContent = super.prepareConfigContent(content);

        BaseConfig.fillWithDefault(fixedContent, content, "color_tag", []);
        BaseConfig.fillWithDefault(fixedContent, content, "sub_tag", []);
        BaseConfig.fillWithDefault(fixedContent, content, "category", 1);

        return fixedContent;
    }

    content() {
        let content = super.content();

        content.color_tag = this.state.color_tag;
        content.sub_tag = this.state.sub_tag;
        content.category = this.state.category;

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

    handleSubTagChange(idx) {
        let sub_tag = Object.assign([], this.state.sub_tag);
        if (sub_tag.includes(idx)) {
            sub_tag.splice(sub_tag.indexOf(idx), 1);
        } else {
            sub_tag.push(idx);
        }
        this.setState({sub_tag: sub_tag});
    }

    handleCategoryChange(idx) {
        this.setState({"category": idx});
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

    renderCategory() {
        const tags = MaterialTag.inst().tags;

        let category = this.state.category;
        if (tags[category] === undefined) {
            category = 1;
        }

        let buffer = [];
        for (let tagIdx in tags) {
            if (tags.hasOwnProperty(tagIdx)) {
                buffer.push(<a className="dropdown-item" href="#" key={tagIdx} onClick={() => this.handleCategoryChange(parseInt(tagIdx))}>{tags[tagIdx]}</a>);
            }
        }

        return <div className="row mt-4 pt-4 pb-4 border border-1 border-secondary rounded" key="category">
            <div className="col-2">材质类别</div>
            <div className="col-4">
                <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="categoryDropDown"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {tags[category.toString()]}
                </button>
                <div className="dropdown-menu text-center" aria-labelledby="categoryDropDown" style={{maxHeight: "500px", overflowX: "hidden"}}>
                    {buffer}
                </div>
            </div>
        </div>;
    }

    renderSubTags(subHierarchy) {
        const subTags = SubTag.inst().tags;

        let buffer = [];

        for (let subTagIdx in subHierarchy) {
            if (subHierarchy.hasOwnProperty(subTagIdx) && subTags.hasOwnProperty(subTagIdx)) {
                const subTagName = subTags[subTagIdx];
                const checked = this.state.sub_tag.includes(parseInt(subTagIdx));
                let divClass = "input-group-text ml-1 mr-1 ";

                if (checked) {
                    divClass += "bg-secondary text-light font-weight-bold";
                }

                buffer.push(<div className={divClass} key={subTagIdx} style={{cursor: "pointer", width: "150px"}} onClick={() => this.handleSubTagChange(parseInt(subTagIdx))}>
                    <input type="checkbox" aria-label={subTagName} style={{cursor: "pointer"}}
                        onChange={() => {}}
                        checked={checked}/>
                    <span className="ml-2">{subTagName}</span>
                </div>);
            }
        }

        return buffer;
    }

    renderUsage() {
        const hierarchy = TagHierarchy.inst().tags;
        const majorTags = MajorTag.inst().tags;

        let buffer = [];

        for (let majorTagIdx in hierarchy) {
            if (hierarchy.hasOwnProperty(majorTagIdx) && majorTags.hasOwnProperty(majorTagIdx)) {
                const majorTagName = majorTags[majorTagIdx];
                const subHierarchy = hierarchy[majorTagIdx];
                buffer.push(<div className="col mt-3" key={majorTagIdx}>
                    <div className="row" key={majorTagIdx}>
                        <div>{majorTagName}</div>
                        <div className="input-group">{this.renderSubTags(subHierarchy)}</div>
                    </div>
                </div>);
            }
        }

        return <div className="row mt-4 pt-4 pb-4 border border-1 border-secondary rounded" key="configBaseTags">
            <div className="col">
                使用部位
                <hr />

                <div>
                    {buffer}
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
        buffer.push(this.renderCategory());
        buffer.push(this.renderUsage());

        return buffer;
    }
}