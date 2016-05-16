import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';

import Base from './Base';

export default class InfoModal extends Base {
    constructor(props) {
        super(props);
        this.autoBind('closeModal');
    }

    render() {
        var actions = [
            <FlatButton type='submit' onClick={this.closeModal} labelStyle={styles.buttonText} style={styles.button} backgroundColor='#22A7F0' label='Ok' />
        ];

        return (
            <Dialog title={this.props.modal.title} open={this.props.modal.open} contentStyle={{width: '50%'}} bodyStyle={{textAlign: 'center'}} actions={actions} >
                {this.props.modal.message}
            </Dialog>
        )
    }

    closeModal(e) {
        e.preventDefault()
        this.context.push({
            infoModal: {
                open: false
            }
        });
    }
};

InfoModal.contextTypes = {
    push: React.PropTypes.func
};

const styles = {
    button: {
        color: 'white',
        height: '3rem',
        margin: '0.5rem'
    },

    buttonText: {
        fontSize: '1.25rem'
    },

    disabledButton: {
        backgroundColor: '#BDC3C7',
        height: '3rem',
        margin: '0.5rem'
    },

    floatingLabel: {
        color: '#22a7f0',
        fontSize: '1.25rem'
    },

    input: {
        color: 'black',
        fontSize: '1.5rem'
    }
}
