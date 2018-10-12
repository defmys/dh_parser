import React from "react";
import {BaseConfig} from "./base_config";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export class ActorConfig extends BaseConfig {
    constructor(props) {
        super(props);

        this.handleAddSlot = this.handleAddSlot.bind(this);
        this.handleSlotIndexChange = this.handleSlotIndexChange.bind(this);
        this.handleSlotDisplayNameChange = this.handleSlotDisplayNameChange.bind(this);
        this.handleRemoveSlot = this.handleRemoveSlot.bind(this);
        this.handleMaterialChange = this.handleMaterialChange.bind(this);
        this.handleAddMaterial = this.handleAddMaterial.bind(this);
        this.handleRemoveMaterial = this.handleRemoveMaterial.bind(this);
    }

    prepareConfigContent(content) {
        let fixedContent = super.prepareConfigContent(content);

        fixedContent['slots'] = {};
        if (content['slots'] !== undefined) {
            for (let idx in content['slots']) {
                if (content['slots'].hasOwnProperty(idx)) {
                    fixedContent['slots'][idx] = content['slots'][idx];

                    let from = content['slots'][idx];
                    let target = fixedContent['slots'][idx];
                    BaseConfig.fillWithDefault(target, from, 'index', idx);
                    BaseConfig.fillWithDefault(target, from, 'display_name', '');
                    BaseConfig.fillWithDefault(target, from, 'materials', []);
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

        return content;
    }

    handleAddSlot() {
        let slots = {...this.state.slots};

        let index = 0;
        while (slots[index]) {
            index++;
        }

        slots[index] = {
            index: index,
            display_name: '',
            value: 0
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

    handleMaterialChange(event, idx, materialIdx) {
        let slots = {...this.state.slots};
        let slot = slots[parseInt(idx)];

        slot.materials[parseInt(materialIdx)] = parseInt(event.target.value);

        this.setState({slots: slots});
    }

    handleAddMaterial(idx) {
        let slots = {...this.state.slots};
        let slot = slots[parseInt(idx)];

        slot.materials.push(0);

        this.setState({slots: slots});
    }

    handleRemoveMaterial(idx, materialIdx) {
        let slots = {...this.state.slots};
        let slot = slots[parseInt(idx)];
        slot.materials.splice(parseInt(materialIdx), 1);
        this.setState({slots: slots});
    }

    renderMaterial(slotIndex) {
        let buffer = [];

        let slot = this.state.slots[slotIndex];
        const material = slot.materials;
        for (let idx in material) {
            if (material.hasOwnProperty(idx)) {
                const materialID = parseInt(material[idx]);
                const key = `material_${idx.toString()}`;
                buffer.push(<div className="row" key={key}>
                    <div className="col">
                        <input type="number" value={materialID} onChange={(event) => this.handleMaterialChange(event, slotIndex, idx)}/>
                    </div>
                    <div className="col-1">
                        <button className="btn btn-outline-danger ml-1 mr-1" onClick={() => this.handleRemoveMaterial(slotIndex, idx)}><FontAwesomeIcon icon={faMinus}/></button>
                    </div>
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
                const slot = this.state.slots[index];
                slotsBuffer.push(
                    <table className="table" key={index}>
                        <thead>
                            <tr className="text-center">
                                <th scope="col-2">ID</th>
                                <th scope="col">Display Name</th>
                                <th scope="col">Material ID <button className="btn btn-outline-primary ml-1 mr-1" onClick={() => this.handleAddMaterial(index)}><FontAwesomeIcon icon={faPlus}/></button></th>
                                <th scope="col-1">
                                    <button className="btn btn-outline-danger ml-1 mr-1" onClick={() => this.handleRemoveSlot(index)}><FontAwesomeIcon icon={faMinus}/></button>
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
                                       onChange={(event) => this.handleSlotIndexChange(event, index)}
                                    />
                                </td>
                                <td>
                                    <input name={displayName}
                                       value={slot.display_name}
                                       onChange={(event) => this.handleSlotDisplayNameChange(event, index)}
                                    />
                                </td>

                                <td>
                                    {this.renderMaterial(index)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                );
            }
        }

        return slotsBuffer;
    }

    renderSlots() {
        return <div className="row mt-4" key="slots">
            <div className="col m-1 border border-1 border-secondary rounded">
                <div className="row">
                    <div className="col">Slots:</div>
                </div>

                {this.renderSlotItems()}

                <div className="row m-1 mt-2">
                    <div className="col ml-1">
                        <button className="btn btn-outline-primary ml-1 mr-1" onClick={this.handleAddSlot}><FontAwesomeIcon icon={faPlus}/></button>
                    </div>
                    <div className="col"> </div>
                </div>
            </div>
        </div>;
    }

    additionalRender(buffer) {
        buffer.push(this.renderSlots());
    };
}
