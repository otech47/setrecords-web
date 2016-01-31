import Base from './Base';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog from 'material-ui/lib/dialog';
import React from 'react';

export default class LoadingNotification extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dialog title={this.props.title} modal={true} open={this.props.open} contentStyle={{width: '50%'}} bodyStyle={{textAlign: 'center'}} >
                <CircularProgress />
            </Dialog>
        )
    }
}
