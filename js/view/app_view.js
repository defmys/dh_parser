'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import $ from 'jquery';
import 'bootstrap';

import { FileTree } from './js/view/file_tree/file_tree';
import {faFolderOpen} from "@fortawesome/free-regular-svg-icons";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons";


const dialog = remote.dialog;


class DH_Parser extends React.Component {
    constructor() {
        super();

        this.state = {
            path: '',
            fileTreeStyle: {}
        };

        this.openFolder = this.openFolder.bind(this);

        this.fileTree = null;
        this.createConfig = this.createConfig.bind(this);
    }

    openFolder() {
        const dir_path = dialog.showOpenDialog({properties: ['openDirectory']});
        if (dir_path !== undefined && dir_path.length > 0) {
            this.setState({
                path: dir_path[0]
            });
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
        if (this.fileTree) {
            this.fileTree.createConfig();
        }
    }

    renderMenuBar() {
        return <div id="menuBar" className="row border-secondary border-bottom">
            <div className="col p-1">
                <button className="btn btn-outline-secondary"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="打开目录"
                        onClick={this.openFolder}>
                    <FontAwesomeIcon icon={faFolderOpen}/>
                </button>

                <button className="btn btn-outline-secondary"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="新建配置"
                        onClick={this.createConfig}>
                    <FontAwesomeIcon icon={faFolderPlus}/>
                </button>
            </div>
        </div>
    }

    render() {
        return (
            <div className="container-fluid bg-light">
                {this.renderMenuBar()}
                <FileTree path={this.state.path} fileTreeStyle={this.state.fileTreeStyle} ref={(fileTree) => {this.fileTree = fileTree;}}/>
            </div>
        );
    }
}


const domContainer = document.querySelector('#main_container');
ReactDOM.render(<DH_Parser />, domContainer);
