'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';

import { FileTree } from './js/view/file_tree';


const dialog = remote.dialog;


class DH_Parser extends React.Component {
    constructor() {
        super();

        this.state = {
            path: 'path'
        };
    }

    componentDidMount() {
        const dir_path = dialog.showOpenDialog({properties: ['openDirectory']});
        if (dir_path !== undefined && dir_path.length > 0) {
            this.setState({
                path: dir_path
            });
        }
    }

    handlePath(event, arg) {
        this.setState({path: arg});
    }

    render() {
        return (
            <div>
                <span>{this.state.path}</span><br />
                <FileTree />
            </div>
        );
    }
}


const domContainer = document.querySelector('#main_container');
ReactDOM.render(<DH_Parser />, domContainer);
