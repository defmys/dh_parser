import {BaseConfig} from "./base_config";
import React from "react";
import {
    ColorTag,
    MajorTag,
    MaterialHierarchy,
    MaterialKeyword, MaterialSurface,
    MaterialTag,
    SubTag,
    TagHierarchy
} from "../../model/tag";
import {faPlusCircle, faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export class MaterialConfig extends BaseConfig {

    constructor(props) {
        super(props);

        this.handleColorTagChange = this.handleColorTagChange.bind(this);
        this.handleSubTagChange = this.handleSubTagChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleSurfaceChange = this.handleSurfaceChange.bind(this);
        this.handleAddTextureRef = this.handleAddTextureRef.bind(this);
        this.handleTextureRefChange = this.handleTextureRefChange.bind(this);
        this.handleRemoveTextureRef = this.handleRemoveTextureRef.bind(this);
        this.handleChooseAllSubTag = this.handleChooseAllSubTag.bind(this);
        this.handleRemoveAllSubTag = this.handleRemoveAllSubTag.bind(this);
    }

    initialSate(props) {
        let state = super.initialSate(props);
        state["color_tag"] = [];
        state["sub_tag"] = [];
        state["category"] = [];
        state["keyword"] = [];
        state["surface"] = [];
        state["texture_ref_path"] = [];
        return state;
    }

    prepareConfigContent (content) {
        let fixedContent = super.prepareConfigContent(content);

        BaseConfig.fillWithDefault(fixedContent, content, "color_tag", []);
        BaseConfig.fillWithDefault(fixedContent, content, "sub_tag", []);
        BaseConfig.fillWithDefault(fixedContent, content, "category", 1);
        BaseConfig.fillWithDefault(fixedContent, content, "keyword", []);
        BaseConfig.fillWithDefault(fixedContent, content, "surface", []);
        BaseConfig.fillWithDefault(fixedContent, content, "texture_ref_path", []);

        return fixedContent;
    }

    content() {
        let content = super.content();

        content.color_tag = this.state.color_tag;
        content.sub_tag = this.state.sub_tag;
        content.category = this.state.category;
        content.keyword = this.state.keyword;
        content.surface = this.state.surface;

        let ref_path = [];
        this.state.texture_ref_path.forEach((element) => {
            ref_path.push(element.trim());
        });
        content.texture_ref_path = ref_path;

        return content;
    }

    handleAddTextureRef() {
        let refPath = Object.assign([], this.state.texture_ref_path);
        refPath.push("");
        this.setState({"texture_ref_path": refPath});
    }

    handleTextureRefChange(event, idx) {
        let refPath = Object.assign([], this.state.texture_ref_path);
        if (refPath.hasOwnProperty(idx)) {
            refPath[idx] = event.target.value;
        }
        this.setState({"texture_ref_path": refPath});
    }

    handleRemoveTextureRef(idx) {
        let refPath = Object.assign([], this.state.texture_ref_path);
        if (refPath.hasOwnProperty(idx)) {
            refPath.splice(idx, 1);
        }
        this.setState({"texture_ref_path": refPath});
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

    handleChooseAllSubTag(subHierarchy) {
        let sub_tag = Object.assign([], this.state.sub_tag);
        for (let idx in subHierarchy) {
            if (subHierarchy.hasOwnProperty(idx)) {
                const tag_idx = parseInt(idx);
                if (!sub_tag.includes(tag_idx)) {
                    sub_tag.push(tag_idx);
                }
            }
        }
        this.setState({sub_tag: sub_tag});
    }

    handleRemoveAllSubTag(subHierarchy) {
        let sub_tag = Object.assign([], this.state.sub_tag);
        for (let idx in subHierarchy) {
            if (subHierarchy.hasOwnProperty(idx)) {
                const tag_idx = parseInt(idx);
                if (sub_tag.includes(tag_idx)) {
                    sub_tag.splice(sub_tag.indexOf(tag_idx), 1);
                }
            }
        }
        this.setState({sub_tag: sub_tag});
    }

    handleCategoryChange(idx) {
        this.setState({"category": idx, "keyword": [], "surface": []});
    }

    handleKeywordChange(idx) {
        let keyword = Object.assign([], this.state.keyword);
        if (keyword.includes(idx)) {
            keyword.splice(keyword.indexOf(idx), 1);
        } else {
            keyword.push(idx);
        }
        this.setState({keyword: keyword});
    }

    handleSurfaceChange(idx) {
        let surface = Object.assign([], this.state.surface);
        if (surface.includes(idx)) {
            surface.splice(surface.indexOf(idx), 1);
        } else {
            surface.push(idx);
        }
        this.setState({surface: surface});
    }

    renderTextureRefPathTextEle() {
        let buffer = [];
        const style = {width: "100%", height: "100%"};
        for (let idx in this.state.texture_ref_path) {
            if (this.state.texture_ref_path.hasOwnProperty(idx)) {
                const text = this.state.texture_ref_path[idx];
                const divID = `textureRefPath${idx}`;
                buffer.push(<div id={divID} className="row rounded pt-1 pb-1 mr-1" key={idx}>
                    <div className="col">
                        <input type="text" value={text} style={style} onChange={(event) => this.handleTextureRefChange(event, idx)} />
                    </div>
                    <div className="col-1 mr-1">
                        <button className="btn btn-outline-warning"
                            onClick={() => this.handleRemoveTextureRef(idx)}
                            onMouseEnter={() => {document.getElementById(divID).classList.add("bg-warning");}}
                            onMouseLeave={() => {document.getElementById(divID).classList.remove("bg-warning");}}
                        >
                            <FontAwesomeIcon icon={faMinusCircle}/>
                        </button>
                    </div>
                </div>);
            }
        }
        return buffer;
    }

    renderTextureRefPath() {
        return <div className="row mt-4 pt-2 pb-2 border border-1 border-secondary rounded" key="textureRefPath">
            <div className="col-2">贴图引用路径</div>
            <div className="col">
                {this.renderTextureRefPathTextEle()}
                <div className="row mr-1">
                    <button className="col btn btn-block btn-outline-primary" onClick={this.handleAddTextureRef}><FontAwesomeIcon icon={faPlusCircle}/></button>
                </div>
            </div>
        </div>;
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

    renderTexture(categoryInput) {
        const category = categoryInput.toString();
        const keywordHierarchy = MaterialHierarchy.inst().tags;
        const materialTags = MaterialKeyword.inst().tags;
        const baseClass = "input-group-text ml-1 mr-1 ";

        let buffer = [];

        const keyword_list = keywordHierarchy[category]["texture"];
        if (keyword_list) {
            keyword_list.forEach((keywordIdx) => {
                if (materialTags.hasOwnProperty(keywordIdx.toString())) {
                    const name = materialTags[keywordIdx.toString()];
                    const checked = this.state.keyword.includes(keywordIdx);

                    let divClass = baseClass;
                    if (checked) {
                        divClass = baseClass + "bg-secondary text-light font-weight-bold";
                    }

                    buffer.push(
                        <div className={divClass} key={keywordIdx} style={{cursor: "pointer", width: "150px"}}
                            onClick={() => this.handleKeywordChange(keywordIdx)}>
                            <input type="checkbox" aria-label={name} style={{cursor: "pointer"}}
                                onChange={() => {}}
                                checked={checked}/>
                            <span className="ml-2">{name}</span>
                        </div>
                    );
                }
            });
        }

        return <div className="input-group">{buffer}</div>;
    }

    renderSurface(categoryInput) {
        const category = categoryInput.toString();
        const keywordHierarchy = MaterialHierarchy.inst().tags;
        const materialSurface = MaterialSurface.inst().tags;
        const baseClass = "input-group-text ml-1 mr-1 ";

        let buffer = [];

        const surface_list = keywordHierarchy[category]["surface"];
        if (surface_list) {
            surface_list.forEach((surfaceIdx) => {
                if (materialSurface.hasOwnProperty(surfaceIdx.toString())) {
                    const name = materialSurface[surfaceIdx.toString()];
                    const checked = this.state.surface.includes(surfaceIdx);

                    let divClass = baseClass;
                    if (checked) {
                        divClass = baseClass + "bg-secondary text-light font-weight-bold";
                    }

                    buffer.push(
                        <div className={divClass} key={surfaceIdx} style={{cursor: "pointer", width: "150px"}}
                            onClick={() => this.handleSurfaceChange(surfaceIdx)}>
                            <input type="checkbox" aria-label={name} style={{cursor: "pointer"}}
                                onChange={() => {}}
                                checked={checked}/>
                            <span className="ml-2">{name}</span>
                        </div>
                    );
                }
            });
        }

        return <div className="input-group">{buffer}</div>;
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
            <table className="col table table-bordered text-center" style={{borderRadius: "10px"}}>
                <thead>
                    <tr>
                        <th scope="col" style={{width: "200px"}}>材质类别</th>
                        <th scope="col">纹路/图案</th>
                        <th scope="col">表面特征</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>
                            <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="categoryDropDown"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {tags[category.toString()]}
                            </button>
                            <div className="dropdown-menu text-center" aria-labelledby="categoryDropDown" style={{maxHeight: "500px", overflowX: "hidden"}}>
                                {buffer}
                            </div>
                        </td>
                        <td>{this.renderTexture(category)}</td>
                        <td>{this.renderSurface(category)}</td>
                    </tr>
                </tbody>
            </table>
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

        const buttonStyle = {padding: "0px 4px 2px 4px", fontSize: "9pt"};

        let buffer = [];

        for (let majorTagIdx in hierarchy) {
            if (hierarchy.hasOwnProperty(majorTagIdx) && majorTags.hasOwnProperty(majorTagIdx)) {
                const majorTagName = majorTags[majorTagIdx];
                const subHierarchy = hierarchy[majorTagIdx];
                buffer.push(<div className="col mt-3" key={majorTagIdx}>
                    <div className="row" key={majorTagIdx}>
                        <div className="col">
                            <div className="row mb-1">
                                <div className="col-1">
                                    {majorTagName}
                                </div>
                                <div className="col" style={{fontSize: "9pt", paddingLeft: "0"}}>
                                    <button className="btn btn-outline-secondary" style={buttonStyle}
                                        onClick={() => {this.handleChooseAllSubTag(subHierarchy);}}>
                                        全选
                                    </button>
                                    <button className="btn btn-outline-secondary ml-1" style={buttonStyle}
                                        onClick={() => {this.handleRemoveAllSubTag(subHierarchy);}}>
                                        取消
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="input-group">{this.renderSubTags(subHierarchy)}</div>
                                </div>
                            </div>
                        </div>
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

    renderBasePart2() {
        let buffer = super.renderBasePart2();
        buffer.push(this.renderTextureRefPath());
        return buffer;
    }
}