/** Prakhar Sahay 12/10/2016

*/


// Autoplay Policy compliance
$(document).mousedown(function () {
	$("#audio").get(0).play();
});


// Make the worm move towards the cursor.

$(document).mousedown(function (evt) {
	worm.seek(evt.pageX, evt.pageY);
	// worm2.seek(evt.pageX, evt.pageY);
});

$(document).mousemove(function (evt) {
	worm.retarget(evt.pageX, evt.pageY);
	// worm2.retarget(evt.pageX, evt.pageY);

});

$(document).mouseup(function () {
	worm.stop();
	// worm2.stop();
});

var worm = new WormGraphics();
// var worm2 = new WormGraphics();
