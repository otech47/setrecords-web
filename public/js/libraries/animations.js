function fadeTransition(toHide, toShow, callback) {
	toHide = $(toHide);
	toShow = $(toShow);
	$.each(toHide, function(index, value) {
		var delay = $(value).css("transition-duration");
		delay = delay.substring(0, delay.length - 1);
		delay = parseFloat(delay)*1000;
		$(value).addClass("hidden-fade");
		window.setTimeout(function() {
			$(value).addClass("hidden");
			if(toShow != null) {
				toShow.removeClass("hidden");
				window.setTimeout(function() {
					toShow.removeClass("hidden-fade");
					if(callback) {
						var showDelay = toShow.css("transition-duration");
						showDelay = showDelay.substring(0, showDelay.length - 1);
						showDelay = parseInt(showDelay)*1000;
						window.setTimeout(function() {
							callback();
						}, showDelay);
					}
				},10);
			}
		}, delay);
	});
}

function fadeOut(toHide, callback) {
	toHide = $(toHide);
	$.each(toHide, function(index, value) {
		var delay = $(value).css("transition-duration");
		delay = delay.substring(0, delay.length - 1);
		delay = parseFloat(delay)*1000;
		$(value).addClass("hidden-fade");
		window.setTimeout(function() {
			$(value).addClass("hidden");
			if(callback) {
				callback();
			}
		}, delay);
	});
}

function fadeIn(toShow, callback) {
	toShow = $(toShow);
	if(toShow != null) {
		toShow.removeClass("hidden");
		window.setTimeout(function() {
			toShow.removeClass("hidden-fade");
			if(callback) {
				var showDelay = toShow.css("transition-duration");
				showDelay = showDelay.substring(0, showDelay.length - 1);
				showDelay = parseInt(showDelay)*1000;
				window.setTimeout(function() {
					callback();
				}, showDelay);
			}
		},10);
	}
}