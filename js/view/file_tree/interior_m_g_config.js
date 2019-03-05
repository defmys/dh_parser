import React from "react";

import {BaseConfig} from "./base_config";


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


export class InteriorFinishMaterialGroup extends BaseConfig {
    constructor(props) {
        super(props);

        this.handleActorTypeChange = this.handleActorTypeChange.bind(this);
        this.handleInteriorFinishTypeChange = this.handleInteriorFinishTypeChange.bind(this);
    }

    initialSate(props) {
        let state = super.initialSate(props);

        state["actor_type"] = 0;
        state["architecture_type"] = 0;

        return state;
    }

    prepareConfigContent(content) {
        let fixedContent = super.prepareConfigContent(content);

        BaseConfig.fillWithDefault(fixedContent, content, "actor_type", 0);
        BaseConfig.fillWithDefault(fixedContent, content, "architecture_type", 0);

        return fixedContent;
    }

    content() {
        let content = super.content();

        content.actor_type = this.state.actor_type;
        content.architecture_type = this.state.architecture_type;

        return content;
    }

    handleActorTypeChange(type_idx) {
        this.setState({"actor_type": type_idx});
    }

    handleInteriorFinishTypeChange(type_idx) {
        this.setState({"architecture_type": type_idx});
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
        return <div className="container mt-3 border border-1 border-secondary rounded text-center ">
            <div className="row p-1 font-weight-bold">
                <div className="col">类别一</div>
                <div className="col">类别二</div>
            </div>
            <div className="row p-1">
                {this.renderActorType()}
                {this.renderInteriorFinishType()}
            </div>
        </div>;
    }
}