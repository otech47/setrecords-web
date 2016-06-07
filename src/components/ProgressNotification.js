import Base from './Base';
import CircularProgress from 'material-ui/lib/circular-progress';
import LinearProgress from 'material-ui/lib/linear-progress';
import Dialog from 'material-ui/lib/dialog';
import React from 'react';

export default class ProgressNotification extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dialog title={this.props.title} modal={true} open={this.props.open} contentStyle={{width: '50%'}} bodyStyle={{textAlign: 'center'}} >
                {this.props.message ?
                    <h3>{this.props.message}</h3>
                    :
                    null
                }
                {this.props.progress ?
                    <div>
                        <p>{(this.props.percentageComplete).toFixed(1) + '%'}</p>
                        <LinearProgress mode='determinate' value={this.props.percentageComplete} />
                    </div>
                    :
                    <CircularProgress />
                }

            </Dialog>
        )
    }
}
