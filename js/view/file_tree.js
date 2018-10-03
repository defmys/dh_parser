'use strict';

import React from 'react';


export class FileTree extends React.Component {
    render() {
        return (<span>{this.props.path}</span>);
    }
}
