"use strict";

import React from "react";
import ReactDOM from "react-dom";
import {ipcRenderer, remote} from "electron";


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
        return <div>{this.state.issueList.length}</div>;
    }
}


const domContainer = document.querySelector("#issue_container");
ReactDOM.render(<IssueView />, domContainer);
