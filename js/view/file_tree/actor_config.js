import React from "react";
import {BaseConfig} from "./base_config";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MajorTag, MaterialTag, SubTag, TagHierarchy} from "../../model/tag";


export class ActorConfig extends BaseConfig {
    constructor(props) {
        super(props);

        this.handleAddSlot = this.handleAddSlot.bind(this);
        this.handleSlotIndexChange = this.handleSlotIndexChange.bind(this);
        this.handleSlotDisplayNameChange = this.handleSlotDisplayNameChange.bind(this);
        this.handleRemoveSlot = this.handleRemoveSlot.bind(this);
        this.handleHighLight = this.handleHighLight.bind(this);
        this.handleRemoveHighLight = this.handleRemoveHighLight.bind(this);
        this.handleMajorTagChange = this.handleMajorTagChange.bind(this);
        this.handleSubTagChange = this.handleSubTagChange.bind(this);
        this.handleDisplaySizeChange = this.handleDisplaySizeChange.bind(this);
        this.handleIsBlueprintChange = this.handleIsBlueprintChange.bind(this);
    }

    initialSate(props) {
        let state = super.initialSate(props);
        state["major_tag"] = "1";
        state["sub_tag"] = "1";
        state["display_size"] = "";
        state["is_blueprint"] = false;
        return state;
    }

    prepareConfigContent(content) {
        let fixedContent = super.prepareConfigContent(content);
        BaseConfig.fillWithDefault(fixedContent, content, "major_tag", "1");
        BaseConfig.fillWithDefault(fixedContent, content, "sub_tag", "1");
        BaseConfig.fillWithDefault(fixedContent, content, "display_size", "");
        BaseConfig.fillWithDefault(fixedContent, content, "is_blueprint", false);

        fixedContent["slots"] = {};
        if (content["slots"] !== undefined) {
            for (let idx in content["slots"]) {
                if (content["slots"].hasOwnProperty(idx)) {
                    fixedContent["slots"][idx] = content["slots"][idx];

                    let from = content["slots"][idx];
                    let target = fixedContent["slots"][idx];
                    BaseConfig.fillWithDefault(target, from, "index", idx);
                    BaseConfig.fillWithDefault(target, from, "display_name", "");
                    BaseConfig.fillWithDefault(target, from, "material_tags", []);
                }
            }
        }

        return fixedContent;
    }

    content() {
        let content = super.content();
        let slots = [];

        for (let idx in this.state.slots) {
            if (this.state.slots.hasOwnProperty(idx)) {
                slots.push(this.state.slots[idx]);
            }
        }
        content.slots = slots;

        content.major_tag = parseInt(this.state.major_tag);
        content.sub_tag = parseInt(this.state.sub_tag);
        content.display_size = this.state.display_size;
        content.is_blueprint = this.state.is_blueprint;

        return content;
    }

    handleAddSlot() {
        let slots = {...this.state.slots};

        let index = 0;
        while (slots[index]) {
            index++;
        }

        slots[index] = {
            index: 0,
            display_name: "",
            material_tags: []
        };

        this.setState({slots: slots});
    }

    handleSlotIndexChange(event, idx) {
        const value = parseInt(event.target.value);
        let slots = {...this.state.slots};
        if (slots[idx]) {
            slots[idx].index = value;

            this.setState({slots: slots});
        }
    }

    handleSlotDisplayNameChange(event, idx) {
        const value = event.target.value;
        let slots = {...this.state.slots};
        if (slots[idx]) {
            slots[idx].display_name = value;

            this.setState({slots: slots});
        }
    }

    handleRemoveSlot(idx) {
        let slots = {...this.state.slots};
        delete slots[idx];
        this.setState({slots: slots});
    }

    handleHighLight(idText) {
        let element = document.getElementById(idText);
        element.classList.add("bg-warning");
    }

    handleRemoveHighLight(idText) {
        let element = document.getElementById(idText);
        element.classList.remove("bg-warning");
    }

    handleMaterialTagChange(slotIndex, materialIdx) {
        let slots = {...this.state.slots};
        let slot = slots[slotIndex];

        const tag_idx = parseInt(materialIdx);
        if (slot.material_tags.includes(tag_idx)) {
            slot.material_tags.splice(slot.material_tags.indexOf(tag_idx), 1);
        } else {
            slot.material_tags.push(tag_idx);
        }

        this.setState({slots: slots});
    }

    handleMajorTagChange(tagIdx) {
        this.setState({"major_tag": tagIdx});

        const hierarchy = TagHierarchy.inst().tags[tagIdx];
        for (let tag_idx in hierarchy) {
            if (hierarchy.hasOwnProperty(tag_idx)) {
                this.setState({"sub_tag": tag_idx});
                break;
            }
        }
    }

    handleSubTagChange(tagIdx) {
        this.setState({"sub_tag": tagIdx});
    }

    handleDisplaySizeChange(event) {
        this.setState({"display_size": event.target.value});
    }

    handleIsBlueprintChange() {
        this.setState({"is_blueprint": !this.state.is_blueprint});
    }

    renderDisplaySize() {
        return <div className="row mt-1" key="display_size">
            <div className="col-4">模型尺寸</div>
            <div className="col-8"><input name="displaySize" className="text-center" value={this.state.display_size} style={{width: "100%"}} onChange={this.handleDisplaySizeChange}/></div>
        </div>;
    }

    renderMaterial(slotIndex) {
        let buffer = [];

        let slot = this.state.slots[slotIndex];
        const tags = MaterialTag.inst().tags;
        const material_tags = slot.material_tags;
        for (let tag_idx in tags) {
            if (tags.hasOwnProperty(tag_idx)) {
                const checked = material_tags.includes(parseInt(tag_idx));

                const baseClass = "MaterialTagCheckboxDiv input-group-text btn btn-secondary mb-1 mr-1 ";
                let divClass = baseClass;
                if (checked) {
                    divClass = baseClass + "bg-secondary text-light font-weight-bold";
                }

                buffer.push(<div className={divClass} style={{cursor: "pointer", width: "110px"}} key={tag_idx}  onClick={() => this.handleMaterialTagChange(slotIndex, parseInt(tag_idx))}>
                    <input type="checkbox" aria-label={tags[tag_idx]} style={{cursor: "pointer"}}
                        onChange={() => {}}
                        checked={checked}/>
                    <span className="ml-1">{tags[tag_idx]}</span>
                </div>);
            }
        }

        return buffer;
    }

    renderSlotItems() {
        let slotsBuffer = [];
        for (let index in this.state.slots) {
            if (this.state.slots.hasOwnProperty(index)) {
                const idxName = `index_${index.toString()}`;
                const displayName = `display_${index.toString()}`;
                const tableID = `slotTable_${index.toString()}`;
                const slot = this.state.slots[index];
                slotsBuffer.push(
                    <table className="table text-center" id={tableID} key={index} style={{borderRadius: "10px"}}>
                        <thead>
                            <tr>
                                <th scope="col-1">Index</th>
                                <th scope="col-2">显示名称</th>
                                <th scope="col">材质类别</th>
                                <th scope="col-1">
                                    <button className="btn btn-outline-danger ml-1 mr-1"
                                        onClick={() => this.handleRemoveSlot(index)}
                                        onMouseEnter={() => this.handleHighLight(tableID)}
                                        onMouseLeave={() => this.handleRemoveHighLight(tableID)}>
                                        <FontAwesomeIcon icon={faMinus}/>
                                    </button>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>
                                    <input type="number"
                                        className="text-center"
                                        name={idxName}
                                        value={slot.index}
                                        style={{width: "100px"}}
                                        onChange={(event) => this.handleSlotIndexChange(event, index)}
                                    />
                                </td>
                                <td>
                                    <input name={displayName}
                                        className="text-center"
                                        value={slot.display_name}
                                        onChange={(event) => this.handleSlotDisplayNameChange(event, index)}
                                    />
                                </td>

                                <td>
                                    <div className="input-group">
                                        {this.renderMaterial(index)}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                );
            }
        }

        return slotsBuffer;
    }

    renderMajorTag() {
        const tags = MajorTag.inst().tags;

        let majorTag = this.state["major_tag"];
        if (tags[majorTag] === undefined) {
            majorTag = "1";
        }

        let buffer = [];
        for (let tag_idx in tags) {
            if (tags.hasOwnProperty(tag_idx)) {
                buffer.push(<a className="dropdown-item" href="#" key={tag_idx} onClick={() => this.handleMajorTagChange(tag_idx)}>{tags[tag_idx]}</a>);
            }
        }

        return <div className="col">
            <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="majorTagDropDown"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {tags[majorTag]}
            </button>
            <div className="dropdown-menu text-center" aria-labelledby="majorTagDropDown">
                {buffer}
            </div>
        </div>;
    }

    renderSubTag() {
        const tags = SubTag.inst().tags;
        const hierarchy = TagHierarchy.inst().tags[this.state.major_tag];

        let subTag = this.state["sub_tag"];
        if (tags[subTag] === undefined) {
            subTag = "1";
        }

        let buffer = [];
        for (let tag_idx in hierarchy) {
            if (hierarchy.hasOwnProperty(tag_idx)) {
                buffer.push(<a className="dropdown-item" href="#" key={tag_idx} onClick={() => this.handleSubTagChange(tag_idx)}>{tags[tag_idx]}</a>);
            }
        }

        return <div className="col">
            <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="subTagDropDown"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {tags[subTag]}
            </button>
            <div className="dropdown-menu text-center" aria-labelledby="subTagDropDown" style={{maxHeight: "500px", overflowX: "hidden"}}>
                {buffer}
            </div>
        </div>;
    }

    renderCategory() {
        return <div className="row mt-4 pb-3 pb-3 border border-1 border-secondary rounded" key="configBaseTags">
            <div className="col mt-4">
                分类
                <hr className="mt-0" />
                <div className="row text-center">
                    <div className="col"> </div>
                    {this.renderMajorTag()}
                    {this.renderSubTag()}
                    <div className="col"> </div>
                </div>
            </div>
        </div>;
    }

    renderSlots() {
        return <div className="row mt-4 border border-1 border-secondary rounded" key="slots">
            <div className="col m-1">
                <div className="row">
                    <div className="col mt-4">可替换元素</div>
                </div>

                {this.renderSlotItems()}

                <div className="row mt-2 mb-2">
                    <div className="col-1"> </div>
                    <div className="col">
                        <button className="btn btn-block btn-outline-primary" onClick={this.handleAddSlot}><FontAwesomeIcon icon={faPlus}/></button>
                    </div>
                    <div className="col-1"> </div>
                </div>
            </div>
        </div>;
    }

    additionalRender() {
        let buffer = [];

        buffer.push(this.renderCategory());
        buffer.push(this.renderSlots());

        return buffer;
    }

    renderBasePart1() {
        let buffer = super.renderBasePart1();
        buffer.push(this.renderDisplaySize());
        return buffer;
    }

    renderBasePart2() {
        let buffer = super.renderBasePart2();

        buffer.push(<div className="row mt-1" key="is_blueprint">
            <div className="col-2">Blueprint</div>
            <div className="col"><input name="is_blueprint" type="checkbox" className="" checked={this.state.is_blueprint} onChange={this.handleIsBlueprintChange}/></div>
        </div>);

        return buffer;
    }
}
