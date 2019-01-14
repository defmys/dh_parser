"use strict";

import fs from "fs";
import React from "react";
import {Treebeard, decorators } from "react-treebeard";
import path from "path";
import {ConfigDetail} from "./config_detail";
import {fileTreeTheme} from "./file_tree_theme";
import {NodeCache} from "../../model/nodeCache";



export class FileTree extends React.Component {
    constructor(props) {
        super(props);

        this.configDetailRef = React.createRef();

        this.state = {
            cursor: null,
            dirList: {},
            curPath: ""
        };
        this.onToggle = this.onToggle.bind(this);
        this.createConfig = this.createConfig.bind(this);
        this.nodeHeaderStyle = this.nodeHeaderStyle.bind(this);
        this.containerDecorator = this.containerDecorator.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props && this.props.refresh !== prevProps.refresh) {
            let newData = this.loadDirInfo(this.props.path, "root");
            newData.toggled = true;
            this.setState({dirList: newData});
        }
    }

    loadDirInfo(dirPath, name) {
        let data = {
            name: name,
            path: dirPath,
            toggled: true,
            active: false
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

        // 重新构建所有的node之后需要更新state.cursor，否则旧node不会释放，并且会覆盖在新node之上
        if (this.state.cursor && this.state.cursor.path === data.path) {
            data.active = true;
            this.setState({cursor: data});
        }

        return data;
    }

    onToggle(node, toggled){
        if (this.props.path === undefined || this.props.path === "") {
            return;
        }

        if(this.state.cursor) {
            let curCursor = this.state.cursor;
            curCursor.active = false;
        }
        node.active = true;
        if(node.children) {
            node.toggled = toggled;
        }
        this.setState({ cursor: node });

        const configPath = path.resolve(node.path, "config.json");
        this.openDir(configPath);
    }

    openDir(configPath) {
        this.setState({
            curPath: configPath
        });
    }

    createConfig() {
        if (!fs.existsSync(this.state.curPath)) {
            fs.writeFileSync(this.state.curPath, "");
            this.openDir(this.state.curPath);
        }
    }

    removeConfig() {
        NodeCache.inst().remove(this.state.curPath);
        if (fs.existsSync(this.state.curPath)) {
            fs.unlinkSync(this.state.curPath);
            this.openDir(this.state.curPath);
        }
    }

    renderConfigDetail() {
        let ret = "";
        if (fs.existsSync(this.state.curPath)) {
            ret = <ConfigDetail path={this.state.curPath} root={this.props.path} ref={this.configDetailRef}/>;
        } else if (this.state.cursor) {
            ret = <button className="btn btn-primary" onClick={this.createConfig}>创建配置文件</button>;
        }
        const style = {
            maxHeight: this.props.fileTreeStyle.maxHeight,
            overflowY: "auto"
        };
        return <div className="col" style={style}>{ret}</div>;
    }

    nodeHeaderStyle(props) {
        return (
            <div style={props.style.base}>
                <div id={props.node.path}>
                    {props.node.name}
                </div>
            </div>
        );
    }

    containerDecorator(props) {
        const activeColor = props.node.active ? "#003d7d" : props.style.base.backgroundColor;
        return (
            <div className="treeNodeDiv" onClick={props.onClick} style={{backgroundColor: activeColor}}>
                <props.decorators.Toggle {...props} style={props.style.toggle} />
                <props.decorators.Header {...props} style={props.style.header} />
            </div>
        );
    }

    render() {
        const style = {
            ...this.props.fileTreeStyle,
            overflow: "auto",
            backgroundColor: "#21252B",
            minWidth: "250px"
        };
        return (
            <div className="row">
                <div className="col-3 p-0 pl-1 text-nowrap" style={style}>
                    <Treebeard data={this.state.dirList} onToggle={this.onToggle} style={fileTreeTheme} decorators={{...decorators, Header: this.nodeHeaderStyle, Container: this.containerDecorator}}/>
                </div>
                {this.renderConfigDetail()}
            </div>
        );
    }
}
