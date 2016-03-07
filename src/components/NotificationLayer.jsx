import React from 'react';

import Base from './Base';

export default class NotificationLayer extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        var notificationComponent;
        var message = this.props.appState.get('notificationMessage');
        switch(this.props.appState.get('notification') !== null) {
            case 'loading':
            notificationComponent = (<LoadingNotification title={message} open={true} />);
            break;

            default:
            break;
        }

        return (
            <div id='NotificationLayer'>
                {notificationComponent}
            </div>
        );
    }
}
