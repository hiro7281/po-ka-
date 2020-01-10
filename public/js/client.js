var socket = io('/');

const CARD={
	"Daiichi":0,
	"Hannin":1,
	"Tantei":2,
	"Aribai":3,
	"Takurami":4,
	"Uwasa":5,
	"Inu":6,
	"Torihiki":7,
	"Shonen":8,
	"Panpi":9,
	"Jouhou":10,
	"Mokugeki":11
};

const KEYS = Object.keys(CARD);

var myNum = 0;
var joiner = [];

window.onload = function(){
	socket.on("tefuda", function(data){
		joiner = data.joiner;
		var id_str = "tefuda";
		var tefuda = data.tefuda;
		var num = 0;
		for(var i = 0; i < 12; i++){
			if(tefuda[i] >0){
				$(id_str+num.toString()).html(KEYS[i]);
				tefuda[i]--;
				i = -1;
			}
		}
		myNum = data.num;
		if(tefuda.[0] > 0) {
			socket.emit("daiichi", {num: myNum})
		}
	});

	socket.on("turn", function(data){
		var player = joiner.find(j => {return j.num == data.num})
		$("#player_turn").html(player.name)
		if(player.num == myNum){
			$("general").html("使うカードを選んでください");
		}
	})

	// document.getElementById("start").onclick = function() {
	// 	socket.emit('start');
	// 	window.location.href = '/game';
	// };
}