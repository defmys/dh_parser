import React from "react";

import {BaseConfig} from "./base_config";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";


const ActorType = {
    0: "墙面",
    1: "地板",
    2: "天花板",
    3: "家具",
};


const InteriorFinishType = {
    0: "通用",
    1: "护墙板",
    2: "护墙板 + 壁纸",
    3: "壁纸",
};


const SlotIndex = {
    0: "天花板",
    1: "地面",
    2: "墙面混油木作1",
    3: "墙面混油木作2",
    4: "墙面混油木作3",
    5: "墙面混油木作线条",
    6: "墙面合金铜条",
    7: "踢脚线",
    8: "门套",
    9: "窗套",
};


export class InteriorFinishMaterialGroup extends BaseConfig {
    constructor(props) {
        super(props);

        this.handleActorTypeChange = this.handleActorTypeChange.bind(this);
        this.handleInteriorFinishTypeChange = this.handleInteriorFinishTypeChange.bind(this);
        this.handleMaterialIndexChange = this.handleMaterialIndexChange.bind(this);
        this.handleMaterialIDChange = this.handleMaterialIDChange.bind(this);
        this.handleAddSlot = this.handleAddSlot.bind(this);
        this.handleRemoveSlot = this.handleRemoveSlot.bind(this);
        this.handleHighLight = this.handleHighLight.bind(this);
        this.handleRemoveHighLight = this.handleRemoveHighLight.bind(this);
    }

    initialSate(props) {
        let state = super.initialSate(props);

        state["actor_type"] = 0;
        state["architecture_type"] = 0;
        state["materials"] = {};

        return state;
    }

    prepareConfigContent(content) {
        let fixedContent = super.prepareConfigContent(content);

        BaseConfig.fillWithDefault(fixedContent, content, "actor_type", 0);
        BaseConfig.fillWithDefault(fixedContent, content, "architecture_type", 0);

        fixedContent["materials"] = {};
        if (content["materials"] !== undefined) {
            for (let idx in content["materials"]) {
                if (content["materials"].hasOwnProperty(idx)) {
                    fixedContent["materials"][idx] = content["materials"][idx];
                }
            }
        }

        return fixedContent;
    }

    content() {
        let content = super.content();

        content.actor_type = this.state.actor_type;
        content.architecture_type = this.state.architecture_type;

        content.materials = [];
        for (let slotIdx in this.state.materials) {
            if (this.state.materials.hasOwnProperty(slotIdx)) {
                const slot = this.state.materials[slotIdx];
                content.materials.push(slot);
            }
        }

        return content;
    }

    handleActorTypeChange(type_idx) {
        this.setState({"actor_type": type_idx});
    }

    handleInteriorFinishTypeChange(type_idx) {
        this.setState({"architecture_type": type_idx});
    }

    handleMaterialIndexChange(idx, new_idx) {
        let slots = {...this.state.materials};
        if (slots[idx]) {
            slots[idx].index = new_idx;

            this.setState({materials: slots});
        }
    }

    handleMaterialIDChange(event, idx) {
        const value = parseInt(event.target.value);
        let slots = {...this.state.materials};
        if (slots[idx]) {
            slots[idx].material_id = value;

            this.setState({materials: slots});
        }
    }

    handleRemoveSlot(idx) {
        let slots = {...this.state.materials};
        delete slots[idx];
        this.setState({materials: slots});
    }

    handleHighLight(idText) {
        let element = document.getElementById(idText);
        element.classList.add("bg-warning");
    }

    handleRemoveHighLight(idText) {
        let element = document.getElementById(idText);
        element.classList.remove("bg-warning");
    }

    handleAddSlot() {
        let slots = {...this.state.materials};

        let index = 0;
        for (let idx in slots) {
            if (slots.hasOwnProperty(idx)) {
                if (parseInt(idx) >= index) {
                    index = parseInt(idx) + 1;
                }
            }
        }

        slots[index] = {
            index: 0,
            material_id: 0,
        };

        this.setState({materials: slots});
    }

    renderActorType() {
        let actor_type = this.state.actor_type;
        let buffer = [];

        for (let tag_idx in ActorType) {
            if (ActorType.hasOwnProperty(tag_idx)) {
                buffer.push(<a className="dropdown-item" href="#" key={tag_idx} onClick={() => this.handleActorTypeChange(parseInt(tag_idx))}>{ActorType[tag_idx]}</a>);
            }
        }

        return <div className="col ml-5 mr-5">
            <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="actorTypeDropDown"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {ActorType[actor_type]}
            </button>
            <div className="dropdown-menu text-center" aria-labelledby="actorTypeDropDown">
                {buffer}
            </div>
        </div>;
    }

    renderInteriorFinishType() {
        let architecture_type = this.state.architecture_type;
        let buffer = [];

        for (let tag_idx in InteriorFinishType) {
            if (InteriorFinishType.hasOwnProperty(tag_idx)) {
                buffer.push(<a className="dropdown-item" href="#" key={tag_idx}
                    onClick={() => this.handleInteriorFinishTypeChange(parseInt(tag_idx))}>{InteriorFinishType[tag_idx]}</a>
                );
            }
        }

        return <div className="col ml-5 mr-5">
            <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="interiorFinishTypeDropDown"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {InteriorFinishType[architecture_type]}
            </button>
            <div className="dropdown-menu text-center" aria-labelledby="interiorFinishTypeDropDown">
                {buffer}
            </div>
        </div>;
    }

    renderGroupType() {
        return <div key="groupType" className="container mt-3 border border-1 border-secondary rounded text-center ">
            <div className="row p-1 font-weight-bold">
                <div className="col">硬装类型</div>
                <div className="col">硬装属性</div>
            </div>
            <div className="row p-1">
                {this.renderActorType()}
                {this.renderInteriorFinishType()}
            </div>
        </div>;
    }

    renderSlots() {
        let buffer = [];

        for (let slotIdx in this.state.materials) {
            if (this.state.materials.hasOwnProperty(slotIdx)) {
                let slot = this.state.materials[slotIdx];
                const keyName = `slot_${slotIdx.toString()}`;

                let slot_buffer = [];
                for (let slot_idx in SlotIndex) {
                    if (SlotIndex.hasOwnProperty(slot_idx)) {
                        const slot_key_name = `slot_${slotIdx.toString()}_${slot_idx.toString()}`;
                        slot_buffer.push(<a className="dropdown-item" href="#" key={slot_key_name}
                            onClick={() => this.handleMaterialIndexChange(parseInt(slotIdx), parseInt(slot_idx))}>{SlotIndex[slot_idx]}
                        </a>);
                    }
                }

                buffer.push(<tr id={keyName} key={keyName}>
                    <td>
                        <button className="btn btn-block btn-secondary dropdown-toggle text-center" type="button" id="slotIdxDropDown"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {SlotIndex[slot.index]}
                        </button>
                        <div className="dropdown-menu text-center" aria-labelledby="slotIdxDropDown">
                            {slot_buffer}
                        </div>
                    </td>
                    <td><input type="number" value={slot.material_id} onChange={(event) => {this.handleMaterialIDChange(event, slotIdx);}} /></td>
                    <td>
                        <button className="btn btn-outline-danger ml-1 mr-1"
                            onClick={() => this.handleRemoveSlot(slotIdx)}
                            onMouseEnter={() => this.handleHighLight(keyName)}
                            onMouseLeave={() => this.handleRemoveHighLight(keyName)}>
                            <FontAwesomeIcon icon={faMinus}/>
                        </button>
                    </td>
                </tr>);
            }
        }

        return <div className="card border-secondary" key="groupSlots">
            <table className="table text-center table-striped">
                <thead>
                    <tr>
                        <th>Slot Index</th>
                        <th>硬装材质ID</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {buffer}
                </tbody>
            </table>
            <div className="row mt-2 mb-2">
                <div className="col-1"> </div>
                <div className="col">
                    <button className="btn btn-block btn-outline-primary" onClick={this.handleAddSlot}><FontAwesomeIcon icon={faPlus}/></button>
                </div>
                <div className="col-1"> </div>
            </div>
        </div>;
    }

    renderBasePart1() {
        let buffer = [];

        buffer.push(this.renderID());
        buffer.push(this.renderDisplayName());

        return buffer;
    }

    renderBasePart2() {
        return "";
    }

    additionalRender() {
        let buffer = [];

        buffer.push(this.renderGroupType());

        buffer.push(<h5 className="pt-5" key="slots_title">方案</h5>);
        buffer.push(this.renderSlots());

        return buffer;
    }
}