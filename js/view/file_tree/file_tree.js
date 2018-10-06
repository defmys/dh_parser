'use strict';

import fs from 'fs';
import React from 'react';
import {Treebeard} from 'react-treebeard';
import path from 'path'
import {ConfigDetail} from "./config_detail";


export class FileTree extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            style: FileTree.getStyle(),
            dirList: {},
            configDetail: {},
            curPath: ''
        };
        this.onToggle = this.onToggle.bind(this);
    }

    static getStyle() {
        const height = window.innerHeight.toString() + 'px';
        return {
            maxHeight: height,
            minHeight: height,
            overflow: 'auto'
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
        this.setState({style: FileTree.getStyle()});
    }

    componentDidUpdate(prevProps) {
        if (prevProps.path !== this.props.path && this.props.path && this.props.path !== '') {
            let newData = this.loadDirInfo(this.props.path, 'root');
            newData.toggled = true;
            this.setState({dirList: newData});
        }
    }

    loadDirInfo(dirPath, name) {
        let data = {
            name: name,
            path: dirPath
        };
        let children = [];

        let nextList = fs.readdirSync(dirPath);
        if (nextList && nextList.length > 0) {
            nextList.forEach((next) => {
                const curPath = path.resolve(dirPath, next);
                let stat = fs.statSync(curPath);
                if (stat.isDirectory()) {
                    children.push(this.loadDirInfo(curPath, next));
                }
            });
        }
        data.children = children;

        return data;
    }

    onToggle(node, toggled){
        if(this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if(node.children) {
            node.toggled = toggled;
        }
        this.setState({ cursor: node });

        this.openDir(node);
    }

    openDir(node) {
        const configFile = path.resolve(node.path, 'config.json');
        if (fs.existsSync(configFile)) {
            let textContent = fs.readFileSync(configFile, 'utf8');
            try {
                let content = JSON.parse(textContent);
                this.setState({
                    configDetail: this.prepareConfigContent(content),
                    curPath: configFile
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

    fillWithDefault(fixedContent, content, key, defaultValue) {
        fixedContent[key] = content[key] === undefined ? defaultValue: content[key];
    }

    prepareConfigContent(content) {
        let fixedContent = {};
        this.fillWithDefault(fixedContent, content, 'id', 0);
        this.fillWithDefault(fixedContent, content, 'type', 'Material');
        this.fillWithDefault(fixedContent, content, 'display_name', '');
        this.fillWithDefault(fixedContent, content, 'package', '');

        return fixedContent;
    }

    render() {
        return (
            <div className="row">
                <div className="col-3 p-0 pl-1 text-nowrap" style={this.state.style}>
                    <Treebeard data={this.state.dirList} onToggle={this.onToggle} />
                </div>
                <div className="col bg-success">
                    <ConfigDetail data={this.state.configDetail} path={this.state.curPath}/>
                </div>
            </div>
        );
    }
}
