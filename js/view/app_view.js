'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { remote } from 'electron';

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
                <div className="row">
                    <div className="col-md-3 p-0 pl-1">
                        <FileTree path={this.state.path} />
                    </div>
                    <div className="col bg-success">456</div>
                </div>
            </div>
        );
    }
}


const domContainer = document.querySelector('#main_container');
ReactDOM.render(<DH_Parser />, domContainer);
