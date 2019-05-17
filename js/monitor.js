
function wait() {
	setMonitorClass("wait");
	$(".contenedor_avatar").hide();
	clearActions();
}

function play(avatar) {
	setMonitorClass("play");
	$("#" + avatar).show();
}

function action(action) {
	$("." + action).show();
}

function clearActions() {
	$(".contenedor").hide();
}

function youWin() {
	setMonitorClass("youWin");
}

function gameOver() {
	setMonitorClass("gameOver");
}

function setMonitorClass(className) {
	$("#monitor").removeClass();
	$("#monitor").addClass(className);
}
