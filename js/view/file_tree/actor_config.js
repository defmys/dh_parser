import React from "react";
import {BaseConfig} from "./base_config";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export class ActorConfig extends BaseConfig {
    constructor(props) {
        super(props);

        this.handleAddSlot = this.handleAddSlot.bind(this);
        this.handleSlotIndexChange = this.handleSlotIndexChange.bind(this);
        this.handleSlotValueChange = this.handleSlotValueChange.bind(this);
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

        console.log(fixedContent);
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

    handleRemoveSlot(idx) {
        let slots = this.state.slots;
        delete slots[idx];
        this.setState({slots: slots});
    }

    renderSlotItems() {
        let slotsBuffer = [];
        for (let index in this.state.slots) {
            const idxName = `index_${index.toString()}`;
            const valueName = `value_${index.toString()}`;
            const slot = this.state.slots[index];
            slotsBuffer.push(
                <div className="row" key={index}>
                    <input type="number"
                           className="col-2 text-center"
                           name={idxName}
                           value={slot.index}
                           onChange={(event) => this.handleSlotIndexChange(event, index)}
                    />
                    <input type="number"
                           className="col"
                           name={valueName}
                           value={slot.value}
                           onChange={(event) => this.handleSlotValueChange(event, index)}
                    />

                    <div className="col-1">
                        <button className="btn btn-outline-danger ml-1 mr-1" onClick={() => this.handleRemoveSlot(index)}><FontAwesomeIcon icon={faMinus}/></button>
                    </div>
                </div>
            );
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
                    <div className="col text-center">
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
