"use strict";

import React from "react";
import ReactDOM from "react-dom";
import {ipcRenderer, remote} from "electron";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderOpen, faSave} from "@fortawesome/free-regular-svg-icons";
import {faFileExport, faMinus, faCog, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import { FileTree } from "./js/view/file_tree/file_tree";
import {exportScript} from "./js/utils/exporter";
import {NodeCache} from "./js/model/nodeCache";

import "bootstrap";


const dialog = remote.dialog;


class DH_Parser extends React.Component {
    constructor() {
        super();

        this.state = {
            path: "",
            fileTreeStyle: {}
        };

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

    openFolder() {
        this.saveAllConfig(false);

        const dir_path = dialog.showOpenDialog(remote.getCurrentWindow(), {properties: ["openDirectory"]});
        if (dir_path !== undefined && dir_path.length > 0) {
            this.setState({
                path: dir_path[0]
            });
        }
    }

    refreshFolder() {
        if (this.state.path && this.state.path !== "") {
            this.saveAllConfig(false);

            this.setState({
                path: this.state.path
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

            NodeCache.inst().saveToDisk();

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
            overflow: "auto",
            backgroundColor: "#21252B"
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
        </div>;
    }

    render() {
        return (
            <div className="container-fluid bg-light">
                {this.renderMenuBar()}
                <FileTree path={this.state.path} fileTreeStyle={this.state.fileTreeStyle} ref={this.fileTree}/>
            </div>
        );
    }
}


const domContainer = document.querySelector("#main_container");
ReactDOM.render(<DH_Parser />, domContainer);
