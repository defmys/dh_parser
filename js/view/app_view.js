'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import $ from 'jquery';
import 'bootstrap';

import { FileTree } from './js/view/file_tree/file_tree';
import {faFolderOpen, faSave} from "@fortawesome/free-regular-svg-icons";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";


const dialog = remote.dialog;


class DH_Parser extends React.Component {
    constructor() {
        super();

        this.state = {
            path: '',
            fileTreeStyle: {}
        };

        this.openFolder = this.openFolder.bind(this);

        this.fileTree = React.createRef();
        this.createConfig = this.createConfig.bind(this);
        this.removeConfig = this.removeConfig.bind(this);
        this.saveCurrentConfig = this.saveCurrentConfig.bind(this);
    }

    openFolder() {
        const dir_path = dialog.showOpenDialog({properties: ['openDirectory']});
        if (dir_path !== undefined && dir_path.length > 0) {
            this.setState({
                path: dir_path[0]
            });
        }
    }

    saveCurrentConfig() {
        const fileTree = this.fileTree.current;
        if (fileTree) {
            const configDetail = fileTree.configDetailRef.current;
            if (configDetail) {
                configDetail.save();
            }
        }
    }

    componentDidMount() {
        this.openFolder();

        window.addEventListener("resize", this.updateDimensions.bind(this));
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
        const menuHeight = document.getElementById('menuBar').clientHeight;
        const height = (window.innerHeight - menuHeight - 1).toString() + 'px';
        const newFileTreeStyle = {
            maxHeight: height,
            minHeight: height,
            overflow: 'auto',
            backgroundColor: '#21252B'
        };

        this.setState({fileTreeStyle: newFileTreeStyle});
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
                        title="保存当前配置"
                        onClick={this.saveCurrentConfig}>
                    <FontAwesomeIcon icon={faSave}/>
                </button>

                &nbsp;&nbsp;

                <button className={btnClass}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="新建配置"
                        onClick={this.createConfig}>
                    <FontAwesomeIcon icon={faPlus}/>
                </button>

                <button className={btnClass}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="删除配置"
                        onClick={this.removeConfig}>
                    <FontAwesomeIcon icon={faMinus}/>
                </button>
            </div>
        </div>
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


const domContainer = document.querySelector('#main_container');
ReactDOM.render(<DH_Parser />, domContainer);
