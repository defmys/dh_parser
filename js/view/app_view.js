'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';

import $ from 'jquery';
import 'bootstrap';

import { FileTree } from './js/view/file_tree/file_tree';


const dialog = remote.dialog;


class DH_Parser extends React.Component {
    constructor() {
        super();

        this.state = {
            path: ''
        };
    }

    componentDidMount() {
        const dir_path = dialog.showOpenDialog({properties: ['openDirectory']});
        if (dir_path !== undefined && dir_path.length > 0) {
            this.setState({
                path: dir_path[0]
            });
        }
    }

    render() {
        return (
            <div className="container-fluid">
                    <FileTree path={this.state.path} />
            </div>
        );
    }
}


const domContainer = document.querySelector('#main_container');
ReactDOM.render(<DH_Parser />, domContainer);
