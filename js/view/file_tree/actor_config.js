import React from "react";
import {BaseConfig} from "./base_config";


export class ActorConfig extends BaseConfig {
    prepareConfigContent(content) {
        let fixedContent = super.prepareConfigContent(content);

        BaseConfig.fillWithDefault(fixedContent, content, 'slots', []);

        return fixedContent;
    }

    content(rawData) {
        let content = super.content(rawData);
        content.slots = rawData.slots;
        return content;
    }

    renderSlots(state) {
        return <div className="row" key="slots">
            <div className="col">Slots</div>
        </div>;
    }

    render(state, inputHandler, typeChangeHandler) {
        let buffer = super.render(state, inputHandler, typeChangeHandler);
        buffer.push(this.renderSlots(state));
        return buffer;
    }
}