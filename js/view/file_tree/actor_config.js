import React from "react";
import {BaseConfig} from "./base_config";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export class ActorConfig extends BaseConfig {
    constructor(props) {
        super(props);

        this.handleAddSlot = this.handleAddSlot.bind(this);
    }

    prepareConfigContent(content) {
        let fixedContent = super.prepareConfigContent(content);

        BaseConfig.fillWithDefault(fixedContent, content, 'slots', []);

        return fixedContent;
    }

    content() {
        let content = super.content();
        content.slots = this.state.slots;
        return content;
    }

    handleAddSlot() {
        let slots = this.state.slots;
        slots.push({});
        this.setState({slots: slots});
    }

    renderSlotItems() {
        let slots = [];
        let counter = 0;
        for (let slot in this.state.slots) {
            slots.push(
                <div className="row" key={counter}>
                    <div className="col-2 text-center"><input type="number" /></div>
                    <div className="col"><input type="number" /></div>
                </div>
            );
            counter++;
        }

        return slots;
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
                        <button className="btn btn-outline-danger ml-1 mr-1"><FontAwesomeIcon icon={faMinus}/></button>
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
