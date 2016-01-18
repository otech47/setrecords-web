var React = require('react');
var Router = require('react-router')
var Route = Router.Route;
var constants = require('../constants/constants');

var MockSetTile = React.createClass({
    render: function() {
        var setData = this.props.setData;
        var backgroundImageURL = setData.main_eventimageURL;
        if (setData.is_radiomix && setData.episode_imageURL) {
            backgroundImageURL = setData.episode_imageURL;
        }
        var episodeImage = this.props.episodeImage;
        return (
        <button className="set-tile" onClick={this.props.onClick} >
            <img className="event-image" src={(episodeImage.length > 0 ? episodeImage[0].preview : constants.S3_ROOT_FOR_IMAGES+backgroundImageURL)} />
            <div className="flex-column tile-controls">
                <div className="flex-column flex-2x set-info">
                    <div>{setData.artist}</div>
                    <div>{setData.event}{(setData.episode && setData.episode.length > 0) ? " - " + setData.episode : ""}</div>
                </div>
                <div className="divider"></div>
                <div className="flex-row flex set-stats">
                    <div className="flex-fixed play-count set-flex">
                        <i className="fa fa-play"> {setData.popularity}</i>
                    </div>
                    <div className="flex-fixed set-length set-flex">
                        <i className="fa fa-clock-o">{setData.set_length}</i>
                    </div>
                </div>
            </div>
        </button>
        );
    }
});

module.exports = MockSetTile;
