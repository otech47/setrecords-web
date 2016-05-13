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
            <Dialog title={this.props.title} modal={true} open={true} contentStyle={{width: '50%'}} bodyStyle={{textAlign: 'center'}} >
                {this.props.message}
                <CircularProgress />
            </Dialog>
        )
    }
};
