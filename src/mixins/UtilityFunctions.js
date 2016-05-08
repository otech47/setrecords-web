import _ from 'underscore';

var UtilityFunctions = {
    cloneObject: function(obj) {
        var self = this;
        var clonedObject = {};
        _.each(obj, function(value, key) {
            if (value == null) {
                return null;
            } else if (typeof value == 'object') {
                clonedObject[key] = self.cloneObject(value);
            } else {
                clonedObject[key] = value;
            }
        });
        return clonedObject;
    },
    numberWithSuffix : function(number) {
        if (Math.abs(number) >= 1000) {
            var endings = ['', 'K', 'M', 'B', 'T'];
            var count = 0;
            while (Math.abs(number) > 1000.00) {
                number = number / 1000.00;
                count++;
            }
            var output = number.toFixed(1);
            output = output + endings[count];
            return output;

        } else {
            return number;
        }
    },
    secondsToMinutes: function(seconds) {
        var minutes = 0;
        while (seconds > 60) {
            seconds -= 60;
            minutes++;
        }
        var minutesString = minutes.toString();
        if (minutesString.length < 2) {
            minutesString = '0' + minutesString;
        }

        if (seconds < 10) {
            return minutesString + ':0' + seconds.toFixed();
        } else {
            return minutesString + ':' + seconds.toFixed();
        }
    },
    timeStringToSeconds: function(str) {
        var timeArray = str.split(':');
        return parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    }
};

module.exports = UtilityFunctions;
