'use strict';

import fs from 'fs';
import React from 'react';
import {Treebeard} from 'react-treebeard';
import path from 'path'
import {ConfigDetail} from "./config_detail";
import {fileTreeTheme} from "./file_tree_theme";


export class FileTree extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dirList: {},
            curPath: '',
            configurable: false
        };
        this.onToggle = this.onToggle.bind(this);
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

        const hasConfig = this.openDir(node);
        this.setState({configurable: hasConfig});
    }

    openDir(node) {
        const configFile = path.resolve(node.path, 'config.json');
        if (fs.existsSync(configFile)) {
            this.setState({
                curPath: configFile
            });

            return true;
        }
        return false;
    }

    renderConfigDetail() {
        let ret = '';
        if (this.state.configurable) {
            ret = <ConfigDetail path={this.state.curPath}/>;
        }
        return <div className="col">{ret}</div>;
    }

    render() {
        return (
            <div className="row">
                <div className="col-3 p-0 pl-1 text-nowrap" style={this.props.fileTreeStyle}>
                    <Treebeard data={this.state.dirList} onToggle={this.onToggle} style={fileTreeTheme}/>
                </div>
                {this.renderConfigDetail()}
            </div>
        );
    }
}
