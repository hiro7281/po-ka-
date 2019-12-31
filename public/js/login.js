var socket = io('/');

window.onload = function(){
	socket.on('login_res', function(data){
		if(data.permit == "y"){
			window.location.href = '/robby';
		}
	})
	document.getElementById("login_button").onclick = function() {
		var name = document.getElementById('name').value;
		socket.emit('login_req', {name: name});
	};
}