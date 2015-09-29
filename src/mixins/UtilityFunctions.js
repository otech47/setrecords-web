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
	}
};
module.exports = UtilityFunctions;