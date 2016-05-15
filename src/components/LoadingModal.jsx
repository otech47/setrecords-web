import Base from './Base';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import React from 'react';

export default class LoadingNotification extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dialog title={this.props.modal.title} modal={true} open={this.props.modal.open} contentStyle={{width: '50%'}} bodyStyle={{textAlign: 'center'}} >
                {this.props.modal.message}
                <CircularProgress />
            </Dialog>
        )
    }
};
