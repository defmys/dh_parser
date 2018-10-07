import React from "react";

export class BaseConfig {
    static fillWithDefault(fixedContent, content, key, defaultValue) {
        fixedContent[key] = content[key] === undefined ? defaultValue: content[key];
    }

    prepareConfigContent(content) {
        let fixedContent = {};

        BaseConfig.fillWithDefault(fixedContent, content, 'id', 0);
        BaseConfig.fillWithDefault(fixedContent, content, 'type', 'Material');
        BaseConfig.fillWithDefault(fixedContent, content, 'display_name', '');
        BaseConfig.fillWithDefault(fixedContent, content, 'package', '');

        return fixedContent;
    }

    content(rawData) {
        let content = {};
        content.id = rawData.id;
        content.type = rawData.type;
        content.display_name = rawData.display_name;
        content.package = rawData.package;
        return content;
    }

    renderID(state, inputHandler) {
        return <div className="row" key="id">
                    <div className="col-2">ID</div>
                    <div className="col"><input type="number" name="id" value={state.id || 0} onChange={inputHandler}/></div>
                </div>;
    }

    renderType(state, typeChangeHandler) {
        return <div className="row" key="type">
                    <div className="col-2">Type</div>
                    <div className="col">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="typeDropDown"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {state.type || "Material"}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="typeDropDown">
                            <a className="dropdown-item" href="#" onClick={typeChangeHandler}>Actor</a>
                            <a className="dropdown-item" href="#" onClick={typeChangeHandler}>Material</a>
                        </div>
                    </div>
                </div>;
    }

    renderDisplayName(state, inputHandler) {
        return <div className="row" key="display_name">
                    <div className="col-2">Display Name</div>
                    <div className="col"><input name="display_name" value={state.display_name || ''} onChange={inputHandler}/></div>
                </div>;
    }

    renderPackage(state, inputHandler) {
        return <div className="row" key="package">
                    <div className="col-2">package</div>
                    <div className="col"><input name="package" value={state.package || ''} onChange={inputHandler}/></div>
                </div>;
    }

    render(state, inputHandler, typeChangeHandler) {
        let buffer = [];
        buffer.push(this.renderID(state, inputHandler));
        buffer.push(this.renderType(state, typeChangeHandler));
        buffer.push(this.renderDisplayName(state, inputHandler));
        buffer.push(this.renderPackage(state, inputHandler));
        return buffer;
    }
}
