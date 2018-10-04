'use strict';

import fs from 'fs';
import React from 'react';
import {Treebeard} from 'react-treebeard';
import path from 'path'


export class FileTree extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            style: FileTree.getStyle(),
            data: {}
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
            this.setState({data: newData});
        }
    }

    loadDirInfo(dirPath, name) {
        let data = {
            name: name
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
    }

    render() {
        return (
            <div style={this.state.style}>
                <Treebeard data={this.state.data} onToggle={this.onToggle} />
            </div>
        );
    }
}
