import React from 'react';

import Base from './Base';
import LoadingNotification from './LoadingNotification';

export default class NotificationLayer extends Base {
    constructor(props) {
        super(props);

        this.library = {
            loading: LoadingNotification
        }
    }

    render() {
        var status = this.props.notification.status;

        return (
            <div id='NotificationLayer'>
                {
                    (status && this.library[status]) ?
                    React.createElement(this.library[status], {notification: this.props.notification})
                    :
                    null
                }
            </div>
        );
    }
}
