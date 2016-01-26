import React from 'react';
import _ from 'underscore';
import Dropzone from 'react-dropzone';
import MockSetTileImproved from './MockSetTileImproved';
import Icon from './Icon';
import ReactDatalist from './ReactDatalist';

var TrackWizardStep3 = React.createClass({
    componentDidMount: function () {
        this.getDatalists();
    },

    render() {
        var {stepForward, deepLinkState, set_id, image, tags, setLength, event, ...other} = this.props;
        var showUploadButton = false;
        var tagComponent ='';

        if (set_id == -1) {
            showUploadButton = true;

            var tagButton = (
                <div className='featured-artist flex-row'>
                    <h3>Genres</h3>
                    <button onClick={this.props.addTag}>
                        <Icon className='center'>add</Icon>
                    </button>
                </div>
            );

            if (tags.length > 0) {
                var tagFields = _.map(tags, (function(tag, index) {
                    return (
                        <div className='flex-row artist-field' key={index}>
                            <input type='text' list='tags-datalist' valueLink={deepLinkState(['tags', index])} placeholder='Genre Name' />
                            <i className='fa fa-times warning center' onClick={this.props.removeTag.bind(null, index)}/>
                        </div>
                    );
                }).bind(this));

                tagComponent = (
                    <div>
                        {tagFields}
                        <ReactDatalist listId='tags-datalist' options={this.props.tagList} sort={'ASC'} />
                    </div>
                );
            }

            var titleComponent = (
                <div>
                    <h3>Set Title</h3>
                    <input type='text' valueLink={deepLinkState(['event'])} />
                </div>
            );
        }

        return (
            <div className='flex-column wizard-step' id='WizardStep4'>
                <p>Enter your track information.</p>
                <div className='flex-row'>

                    <div className='flex-column flex-fixed'>
                        {titleComponent || ''}

                        <div>
                            <h3>Track Title</h3>
                            <input type='text' valueLink={deepLinkState(['trackName'])} />
                        </div>
                        <div>
                            <h3>Artist</h3>
                            <input type='text' valueLink={deepLinkState(['trackArtist'])} />
                        </div>

                        {tagButton}
                        {tagComponent}
                    </div>

                    <div className='flex-column flex-fixed' style={{alignItems: 'center'}}>
                        <MockSetTileImproved image={this.props.image} artists={[this.props.originalArtist]} event={this.props.event} setLength={this.props.setLength} popularity={this.props.popularity} />

                        <Dropzone
                            ref='dropzone'
                            onDrop={this.props.addImage}
                            className='hidden'
                            multiple={false} />
                        <button className={(showUploadButton ? '':' invisible')} onClick={this.browse}>
                            Upload an image...
                        </button>
                    </div>
                </div>
                <button className='step-button' onClick={this.submitStep}>
                    Continue
                </button>
            </div>
        );
    },

    browse: function(event) {
        this.refs.dropzone.open();
    },

    getDatalists: function () {
        var query = `{
            tags {
                optionName: tag
            },
        }`;

        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/graph';
        $.ajax({
            type: 'get',
            url: requestUrl,
            data: {
                query: query
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done( (res) => {
            // console.log(res);
            this.props.loadDatalists({
                tagList: res.payload.tags
            });
        })
        .fail( (err) => {
            // console.log(err);
        });
    },

    submitStep: function(event) {
        var errors = [];

        if (this.props.trackArtist.length < 1) {
            errors.push('Artist field cannot be empty.');
        }

        if (this.props.trackName.length < 1) {
            errors.push('Track Title field cannot be empty.');
        }

        if (this.props.event.length < 1) {
            errors.push('Set Title cannot be empty.');
        }

        if (errors.length == 0) {
            this.props.stepForward();
        } else {
            alert('Please correct the following errors, then click Continue:\n' + errors.join('\n'));
        }
    }
});

module.exports = TrackWizardStep3;
