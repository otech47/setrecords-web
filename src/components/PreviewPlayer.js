var React = require('react');
import _ from 'underscore';
import UtilityFunctions from '../mixins/UtilityFunctions';
import PreviewTrack from './PreviewTrack';
import moment from 'moment';

var PreviewPlayer = React.createClass({
    mixins: [UtilityFunctions],
    render: function() {
        var previewTracks = _.map(this.props.songs, (function(song, index) {
            if (this.props.isPlaying && this.props.currentTrack == index) {
                var isPlaying = true;
            }
            var duration = this.secondsToMinutes(song.duration);
            return (<PreviewTrack
                title={song.file.name}
                duration={duration}
                key={song.name + '_' + song.file.size} isPlaying={isPlaying}
                removeSong={this.props.removeSong.bind(null, index)} play={this.props.play.bind(null, index)}
                pause={this.props.pause} />);
        }).bind(this));

        return (
            <div className='flex-column' id='PreviewPlayer'>
                {previewTracks}
            </div>
        );
    }
});

module.exports = PreviewPlayer;
