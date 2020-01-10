var socket = io('/');

window.onload = function(){
	socket.on("joiner_res", function(data){
		$("#attend").html(data.data.join(", "));
	});

	socket.emit("joiner_req");

	document.getElementById("start").onclick = function() {
		socket.emit('start');
		window.location.href = '/game';
	};
}