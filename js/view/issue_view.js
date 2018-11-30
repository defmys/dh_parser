"use strict";

import React from "react";
import ReactDOM from "react-dom";
import {faTimesCircle} from "@fortawesome/free-regular-svg-icons";
import {ipcRenderer, remote} from "electron";

import "bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class IssueView extends React.Component {
    constructor() {
        super();

        this.state = {
            issueList: remote.getCurrentWindow().initIssueList
        };

        this.handleLoadIssueList = this.handleLoadIssueList.bind(this);
    }

    componentDidMount() {
        ipcRenderer.on("loadIssueList", this.handleLoadIssueList);
    }

    componentWillUnmount() {
        ipcRenderer.removeListener("loadIssueList", this.handleLoadIssueList);
    }

    handleLoadIssueList(event, issueList) {
        this.setState({issueList: issueList});
    }

    render() {
        let buffer = [];
        for (let idx in this.state.issueList) {
            if (this.state.issueList.hasOwnProperty(idx)) {
                const issue = this.state.issueList[idx];

                buffer.push(<tr key={idx}>
                    <td>{issue.path}</td>
                    <td>{issue.errorMsg}</td>
                </tr>);
            }
        }

        return <table className="table table-sm table-striped table-bordered" style={{fontSize: "9pt"}}>
            <thead>
                <tr className="table-warning text-center">
                    <th>路径</th>
                    <th><FontAwesomeIcon icon={faTimesCircle} className="fa-sm text-danger font-weight-bold" /> 错误</th>
                </tr>
            </thead>
            <tbody>
                {buffer}
            </tbody>
        </table>;
    }
}


const domContainer = document.querySelector("#issue_container");
ReactDOM.render(<IssueView />, domContainer);
