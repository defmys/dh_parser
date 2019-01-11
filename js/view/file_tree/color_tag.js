import React from "react";
import PropTypes from "prop-types";
import {ColorTag} from "../../model/tag";


export class ColorTagRenderer extends React.Component {
    static get propTypes() {
        return {
            color_tag: PropTypes.array,
            handler: PropTypes.any
        };
    }

    render() {
        const dropDown = [];
        const tags = ColorTag.inst().tags;
        const basicStyle={cursor: "pointer", width: "90px"};

        for (let tag_idx in tags) {
            if (tags.hasOwnProperty(tag_idx)) {
                const style = {...basicStyle, ...ColorTag.getCheckboxStyle(tag_idx)};
                dropDown.push(<div className="colorTagCheckboxDiv btn btn-secondary input-group-text mr-1 mt-1" key={tag_idx} style={style} onClick={() => this.props.handler(parseInt(tag_idx))}>
                    <input type="checkbox" aria-label={tags[tag_idx]} style={{cursor: "pointer"}}
                        onChange={() => {}}
                        checked={this.props.color_tag.includes(parseInt(tag_idx))}/>
                    {tags[tag_idx]}
                </div>);
            }
        }

        return <div className="row mt-2 mb-2">
            <div className="col-2 d-flex justify-content-center flex-column text-center">色系</div>
            <div className="col">
                <div className="input-group">
                    {dropDown}
                </div>
            </div>
        </div>;
    }
}
