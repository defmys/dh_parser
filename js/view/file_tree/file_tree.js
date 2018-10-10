'use strict';

import fs from 'fs';
import React from 'react';
import {Treebeard, decorators } from 'react-treebeard';
import path from 'path'
import {ConfigDetail} from "./config_detail";
import {fileTreeTheme} from "./file_tree_theme";



export class FileTree extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cursor: null,
            dirList: {},
            curPath: ''
        };
        this.onToggle = this.onToggle.bind(this);
        this.createConfig = this.createConfig.bind(this);
        this.nodeHeaderStyle = this.nodeHeaderStyle.bind(this);
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

        const configPath = path.resolve(node.path, 'config.json');
        this.openDir(configPath);
    }

    openDir(configPath) {
        this.setState({
            curPath: configPath
        });
    }

    createConfig() {
        if (!fs.existsSync(this.state.curPath)) {
            fs.writeFileSync(this.state.curPath, '');
            this.openDir(this.state.curPath);
        }
    }

    removeConfig() {
        if (fs.existsSync(this.state.curPath)) {
            fs.unlinkSync(this.state.curPath);
            this.openDir(this.state.curPath);
        }
    }

    renderConfigDetail() {
        let ret = '';
        if (fs.existsSync(this.state.curPath)) {
            ret = <ConfigDetail path={this.state.curPath}/>;
        } else if (this.state.cursor) {
            ret = <button className="btn btn-primary" onClick={this.createConfig}>创建配置文件</button>;
        }
        return <div className="col">{ret}</div>;
    }

    nodeHeaderStyle(props) {
        const activeColor = this.state.cursor && this.state.cursor.path === props.node.path ? '#428BCA' : '#9DA5AB';
        return (
            <div style={props.style.base}>
                <div id={props.node.path} style={{'color': activeColor}}>
                    <span style={{'cursor': 'pointer'}}>{props.node.name}</span>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="row">
                <div className="col-3 p-0 pl-1 text-nowrap" style={this.props.fileTreeStyle}>
                    <Treebeard data={this.state.dirList} onToggle={this.onToggle} style={fileTreeTheme} decorators={{...decorators, Header: this.nodeHeaderStyle}}/>
                </div>
                {this.renderConfigDetail()}
            </div>
        );
    }
}
