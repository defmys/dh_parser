import React from "react";
import {BaseConfig} from "./base_config";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export class ActorConfig extends BaseConfig {
    constructor(props) {
        super(props);

        this.handleAddSlot = this.handleAddSlot.bind(this);
        this.handleSlotIndexChange = this.handleSlotIndexChange.bind(this);
        this.handleSlotValueChange = this.handleSlotValueChange.bind(this);
        this.handleSlotDisplayNameChange = this.handleSlotDisplayNameChange.bind(this);
        this.handleRemoveSlot = this.handleRemoveSlot.bind(this);
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
                    BaseConfig.fillWithDefault(target, from, 'value', 0);
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
        let slots = this.state.slots;

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
        let slots = this.state.slots;
        if (slots[idx]) {
            slots[idx].index = parseInt(event.target.value);

            this.setState({slots: slots});
        }
    }

    handleSlotValueChange(event, idx) {
        const value = parseInt(event.target.value);
        let slots = this.state.slots;
        if (slots[idx]) {
            slots[idx].value = parseInt(event.target.value);

            this.setState({slots: slots});
        }
    }

    handleSlotDisplayNameChange(event, idx) {
        const value = event.target.value;
        let slots = this.state.slots;
        if (slots[idx]) {
            slots[idx].display_name = event.target.value;

            this.setState({slots: slots});
        }
    }

    handleRemoveSlot(idx) {
        let slots = this.state.slots;
        delete slots[idx];
        this.setState({slots: slots});
    }

    renderSlotItems() {
        let slotsBuffer = [];
        for (let index in this.state.slots) {
            if (this.state.slots.hasOwnProperty(index)) {
                const idxName = `index_${index.toString()}`;
                const valueName = `value_${index.toString()}`;
                const displayName = `display_${index.toString()}`;
                const slot = this.state.slots[index];
                slotsBuffer.push(
                    <table className="table" key={index}>
                        <thead>
                            <tr className="text-center">
                                <th scope="col-2">ID</th>
                                <th scope="col">Display Name</th>
                                <th scope="col">Material ID</th>
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
                                    <input className="col"
                                       name={displayName}
                                       value={slot.display_name}
                                       onChange={(event) => this.handleSlotDisplayNameChange(event, index)}
                                    />
                                </td>
                                <td>
                                    <input type="number"
                                       className="col"
                                       name={valueName}
                                       value={slot.value}
                                       onChange={(event) => this.handleSlotValueChange(event, index)}
                                    />
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
