import React from 'react';
import Base from './Base';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

export default class MessageModal extends Base {
    constructor(props) {
        super(props);
        this.autoBind('handleClose');
    }

    render() {
        const actions = [
            <FlatButton label="OK" primary={true} onClick={this.handleClose} />
        ];

        return (
            <div>
                <Dialog open={this.props.open} actions={actions} modal={false} onRequestClose={this.handleClose} >
                    {this.props.message}
                </Dialog>
            </div>
        )
    }

    handleClose() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                messageModal: ''
            }
        });
    }
}
