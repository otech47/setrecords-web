import React from 'react';

import Base from './Base';

export default class MetricsGraph extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='metrics-panel' id='MetricsGraph'>
                MetricsGraph
            </div>
        );
    }
}

    // lineGraph() {
    //     if ((this.state.plays || this.state.views || this.state.favorites) && this.state.loaded) {
    //         var dateGrouping;
    //         var dateFormat;
    //
    //         switch (this.state.cohort) {
    //             case 'daily':
    //                 dateGrouping = 'M[/]D[/]YYYY';
    //                 dateFormat = 'M[/]D';
    //                 break;
    //             case 'weekly':
    //                 dateGrouping = 'w[/]YYYY';
    //                 dateFormat = 'M[/]D';
    //                 break;
    //             case 'monthly':
    //                 dateGrouping = 'M[/]YYYY';
    //                 dateFormat = 'M[/]YY';
    //                 break;
    //         }
    //         var metrics = this.props.setmineMetrics;
    //         var labels = [];
    //         var datasets = [];
    //         for (var i = 0; i < metrics.plays.overtime.length; i++) {
    //             labels.push(moment(metrics.plays.overtime[i].date).format(dateFormat));
    //         }
    //         var colors = ['#9b59b6', '#22a7f0', '#36d7b7'];
    //         var counter = 0;
    //         var self = this;
    //
    //         _.each(metrics, function(value, key) {
    //             if (self.state[key]) {
    //                 var points = _.map(value.overtime, function(entry) {
    //                     return entry.count;
    //                 });
    //                 datasets.push({
    //                     label: key,
    //                     data: points,
    //                     strokeColor: colors[counter],
    //                     pointColor: colors[counter]
    //                 });
    //             }
    //             counter++;
    //         });
    //
    //         var chartData = {
    //             labels: labels,
    //             datasets: datasets
    //         };
    //
    //         var chartOptions = {
    //             bezierCurve: false,
    //             datasetFill: false,
    //             scaleLineColor: '#313542',
    //             scaleLineWidth: 2,
    //             scaleFontSize: 16,
    //             scaleFontColor: '#313542',
    //             scaleShowGridLines: false
    //         };
    //
    //
    //         return (<LineChart data={chartData} className='linechart' options={chartOptions} redraw />);
    //     }
    //     else {
    //         return (<p className='not-found'>Click a metric above to show its graph</p>);
    //     }
    // },
