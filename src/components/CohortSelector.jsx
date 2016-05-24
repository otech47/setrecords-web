import React from 'react';

import Base from './Base';

export default class CohortSelector extends Base {
    constructor(props) {
        super(props);

        this.state = {
            cohort: 'daily'
        };
    }

    render() {
        return (
            <div id='CohortSelector' className='row'>
                <div onClick={this.changeCohort.bind(this, 'daily')} className={this.state.cohort == 'daily' ? 'active':''}>
                    <p>day</p>
                </div>

                <div onClick={this.changeCohort.bind(this, 'weekly')} className={this.state.cohort == 'weekly' ? 'active':''}>
                    <p>week</p>
                </div>

                <div onClick={this.changeCohort.bind(this, 'monthly')} className={this.state.cohort == 'monthly' ? 'active':''} name='monthly'>
                    <p>month</p>
                </div>
            </div>
        )
    }

    changeCohort(newCohort) {
        if (this.props.ready) {
            this.setState({
                cohort: newCohort
            });

            this.props.onChange({artistId: this.context.artistId, cohort: this.state.cohort});
        }
    }
}

CohortSelector.contextTypes = {
    artistId: React.PropTypes.number
};
