"use strict";

import React from "react";
import ReactDOM from "react-dom";
import {ipcRenderer, remote} from "electron";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderOpen, faSave, faTimesCircle} from "@fortawesome/free-regular-svg-icons";
import {faFileExport, faMinus, faCog, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import { FileTree } from "./js/view/file_tree/file_tree";
import {exportScript} from "./js/utils/exporter";
import {Validator} from "./js/utils/validator";
import {NodeCache} from "./js/model/nodeCache";

import "bootstrap";


const dialog = remote.dialog;


class DH_Parser extends React.Component {
    constructor() {
        super();

        this.state = {
            path: "",
            fileTreeStyle: {},
            issueCount: 0,
            maxActorID: 0,
            maxMaterialID: 0,
            refresh: 0
        };

        this.validator = new Validator();

        this.openFolder = this.openFolder.bind(this);
        this.refreshFolder = this.refreshFolder.bind(this);

        this.handleHotKeySave = this.handleHotKeySave.bind(this);

        this.fileTree = React.createRef();
        this.createConfig = this.createConfig.bind(this);
        this.removeConfig = this.removeConfig.bind(this);
        this.saveAllConfig = this.saveAllConfig.bind(this);
        this.exportScript = this.exportScript.bind(this);

        ipcRenderer.on("saveAll", () => {this.saveAllConfig(true);});
    }

    validate() {
        this.validator.validate(this.state.path);
        this.setState({
            issueCount: this.validator.issueCount(),
            maxActorID: this.validator.maxID.actor,
            maxMaterialID: this.validator.maxID.material,
        });
        ipcRenderer.send("refreshIssueList", this.validator.issueList);
    }

    openFolder() {
        this.saveAllConfig(false);

        const dir_path = dialog.showOpenDialog(remote.getCurrentWindow(), {properties: ["openDirectory"]});
        if (dir_path !== undefined && dir_path.length > 0) {
            this.setState(
                {path: dir_path[0], refresh: this.state.refresh + 1},
                () => { this.validate(); }
            );
        }
    }

    refreshFolder() {
        if (this.state.path && this.state.path !== "") {
            this.saveAllConfig(false);

            this.setState({
                path: this.state.path,
                refresh: this.state.refresh + 1
            });
        }
    }

    saveAllConfig(showMsg) {
        const fileTree = this.fileTree.current;
        if (fileTree) {
            const configDetail = fileTree.configDetailRef.current;
            if (configDetail) {
                configDetail.save();
            }

            if (this.state.path) {
                NodeCache.inst().saveToDisk();
                this.validate();
            }

            if (showMsg) {
                dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        type: "info",
                        message: "保存成功"
                    });
            }
        }
    }

    componentDidMount() {
        this.openFolder();

        window.addEventListener("resize", this.updateDimensions.bind(this));
        this.updateDimensions();

        window.addEventListener("keyup", this.handleHotKeySave, true);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
        window.removeEventListener("keyup", this.handleHotKeySave, true);
    }

    updateDimensions() {
        const menuHeight = document.getElementById("menuBar").clientHeight;
        const height = (window.innerHeight - menuHeight - 1).toString() + "px";
        const newFileTreeStyle = {
            maxHeight: height,
            minHeight: height,
        };

        this.setState({fileTreeStyle: newFileTreeStyle});
    }

    exportScript() {
        if (this.state.path !== "") {
            exportScript(this.state.path);

            dialog.showMessageBox(remote.getCurrentWindow(),
                {
                    type: "info",
                    message: "导出完毕"
                });
        }
    }

    handleHotKeySave(event) {
        if (event.key === "s" && event.ctrlKey === true) {
            this.saveAllConfig(true);
        }
    }

    createConfig() {
        if (this.fileTree.current) {
            this.fileTree.current.createConfig();
        }
    }

    removeConfig() {
        if (this.fileTree.current) {
            this.fileTree.current.removeConfig();
        }
    }

    renderIssueCount() {
        let ret = null;

        if (this.state.issueCount > 0) {
            ret = <div className="col-3" key="statusIssue">
                <div id="issueDiv" className="row mt-2" style={{color: "red", fontSize: "15pt", cursor: "pointer"}}
                    onClick={() => {ipcRenderer.send("showIssueWindow", this.validator.issueList);}}>
                    <div className="col p-0 pr-1 text-right"><FontAwesomeIcon icon={faTimesCircle} /></div>
                    <div className="col p-0 pl-1 text-left">{this.state.issueCount}</div>
                </div>
            </div>;
        }

        return ret;
    }

    renderMaxID() {
        return <div className="col-6 mt-1 text-left" key="statusMaxID" style={{fontSize: "9pt"}}>
            <div className="row">
                <div className="col">模型最大ID: {this.state.maxActorID}</div>
            </div>
            <div className="row">
                <div className="col">材质最大ID: {this.state.maxMaterialID}</div>
            </div>
        </div>;
    }

    renderStatus() {
        let buffer = [];

        buffer.push(<div className="col" key="statusPlaceholder"> </div>);
        buffer.push(this.renderMaxID());
        buffer.push(this.renderIssueCount());

        return <div className="row">{buffer}</div>;
    }

    renderMenuBar() {
        const btnClass = "btn btn-outline-secondary mr-1";
        return <div id="menuBar" className="row border-secondary border-bottom">
            <div className="col p-1">
                <button className={btnClass}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="打开目录"
                    onClick={this.openFolder}>
                    <FontAwesomeIcon icon={faFolderOpen}/>
                </button>

                <button className={btnClass}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="刷新目录"
                    onClick={this.refreshFolder}>
                    <FontAwesomeIcon icon={faSyncAlt}/>
                </button>

                &nbsp;&nbsp;

                <button className={btnClass}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="保存配置"
                    onClick={() => {this.saveAllConfig(true);}}>
                    <FontAwesomeIcon icon={faSave}/>
                </button>

                &nbsp;&nbsp;

                <button className={btnClass}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="新建配置"
                    onClick={this.createConfig}>
                    <FontAwesomeIcon icon={faCog}/>
                </button>

                <button className={btnClass}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="删除配置"
                    onClick={this.removeConfig}>
                    <FontAwesomeIcon icon={faMinus}/>
                </button>

                &nbsp;&nbsp;

                <button className={btnClass}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="导出"
                    onClick={this.exportScript}>
                    <FontAwesomeIcon icon={faFileExport}/>
                </button>
            </div>
            <div className="col-md-3">
                {this.renderStatus()}
            </div>
        </div>;
    }

    render() {
        return (
            <div className="container-fluid bg-light" style={{fontFamily: "微软雅黑", fontSize: "11pt"}}>
                {this.renderMenuBar()}
                <FileTree path={this.state.path} refresh={this.state.refresh} fileTreeStyle={this.state.fileTreeStyle} ref={this.fileTree}/>
            </div>
        );
    }
}


const domContainer = document.querySelector("#main_container");
ReactDOM.render(<DH_Parser />, domContainer);
