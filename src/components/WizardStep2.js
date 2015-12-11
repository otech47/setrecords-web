import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';

import PreviewPlayer from './PreviewPlayer';
import Notification from './Notification';
import {Motion, spring, presets} from 'react-motion';

var WizardStep2 = React.createClass({
    getInitialState: function() {
        return {
            current_audio: null,
            current_track: null,
            is_playing: false,
            open: false
        };
    },

    componentWillUnmount: function() {
        if (this.state.current_audio) {
            URL.revokeObjectURL(this.state.current_audio);
        }
    },

    componentDidMount: function() {
        var player = ReactDOM.findDOMNode(this.refs.player);
        player.onended = (function(e) {
            this.setState({
                current_audio: null,
                current_track: null,
                is_playing: false
            });
        }).bind(this);
    },

    render: function() {
        var hideButton = this.props.songs.length >= 1 ? '' : 'hidden';
        return (
            <div className="flex-column wizard-step" id='WizardStep2'>
                <audio ref='player' src={this.state.current_audio}/>
                <div className="flex-row step-buttons hidden">
                    <Dropzone ref='dropzone' className="hidden" onDrop={this.props.addSongFile} multiple={false} />
                </div>
                <Motion style={{
                    opacity: spring(this.state.open ? 1 : 0, presets.gentle),
                    visibility: this.state.open ? 'visible' : 'hidden'
                }}>
                    {
                        ({opacity, visibility}) =>
                        <Notification dismiss={() => this.setState({open: false})} style={{
                            opacity: `${opacity}`,
                            visibility: `${visibility}`
                        }}>
                            Please upload at least one file to continue
                        </Notification>
                    }
                </Motion>

                <div className='flex-row upload'>
                    <button className="step-button" onClick={this.browse}>
                        Upload
                    </button>
                    <p>MP3/WAV only. Multiple files will be joined.</p>
                </div>

                <PreviewPlayer songs={this.props.songs} removeSong={this.removeSong}
                isPlaying={this.state.is_playing} currentTrack={this.state.current_track}
                play={this.play}
                pause={this.pause} />

                <button className={`step-button ${hideButton}`} onClick={this.submitStep}>
                    Continue
                </button>
            </div>
        );
    },

    browse: function(event) {
        this.refs.dropzone.open();
    },

    removeSong: function(index) {
        if (index == this.state.current_track) {
            URL.revokeObjectURL(this.state.current_audio);
            this.setState({
                current_track: null,
                current_audio: null,
                is_playing: false
            });
        } else {
            var newCurrent = (index > this.state.current_track ? this.state.current_track : this.state.current_track - 1);
            this.setState({
                current_track: newCurrent
            });
        }
        this.props.removeSong(index);
    },

    play: function(index) {
        var player = ReactDOM.findDOMNode(this.refs.player);
        if (index == this.state.current_track) {
            this.setState({
                is_playing: true
            }, function() {
                player.play();
            });
        } else {
            if (this.state.current_audio) {
                URL.revokeObjectURL(this.state.current_audio);
            }
            var newAudio = URL.createObjectURL(this.props.songs[index].file);
            this.setState({
                current_audio: newAudio,
                is_playing: true,
                current_track: index
            }, function() {
                player.play();
            });
        }
    },

    pause: function() {
        var player = ReactDOM.findDOMNode(this.refs.player);
        this.setState({
            is_playing: false
        }, () => {
            player.pause();
        });
    },

    submitStep: function() {
        if (this.props.songs.length == 0) {
            this.setState({
                open: true
            });
        } else if (this.props.songs.length > 1) {
            var confirm = window.confirm('You have uploaded more than one file. Joining them will take additional time. Is this ok?');
            if (confirm == true) {
                this.props.stepForward();
            }
        } else {
            this.props.stepForward();
        }
    }
});

module.exports = WizardStep2;
