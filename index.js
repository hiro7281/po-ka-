// Include libraries
var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
var path = require('path');

// SocketIO
var io = require('socket.io')(http);

// Include static files
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
})

app.get('/game', function(req, res){
  res.sendFile(__dirname + '/index.html');
})

app.get('/robby', function(req, res){
  res.sendFile(__dirname + '/robby.html');
})

const CARD={
	"Daiich":0,
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
var joiner = [];
var cards = [1,1,1,2,
				0,0,0,0,
				0,0,0,0]
var all = [1,1,4,5,
			2,4,1,5,
			1,2,3,3]


io.on('connection', function(socket){
	socket.on('login_req', (data) => {
		socket.emit('login_res');
		joiner.push({name: data.name, id:socket.id});
	})
	socket.on('joiner_req', (data) => {
		socket.emit('login_res', {data: joiner});
	})
	socket.on('start', (data) => {
		var num = 3;
		var extra = 0;
		switch (num) {
			case 3:
				extra = 7;
				break;
			case 4:
				cards[4]++;
				extra = 10;
				break;
			case 5:
				extra = 14;
				cards[4]++;
			case 6:
				extra = 16;
				cards[4]++;
				cards[2]++;
				cards[4]++;
			default:
				console.log("人が足りません！")
				break;
		}
		var remain = all.map((num, index) => {
			return(num-cards[index])
		})
		var sum = 0;
		remain.forEach(function(elm) {
		    sum += elm;
		});
		for(var k=0; k<extra; k++){
			var ran = Math.floor( Math.random() * sum );
			for(var i=0; i<12; i++){
				ran = ran -remain[i];
				if(ran < 1){
					remain[i]--;
					cards[i]++;
					break;
				}
			}
		}
		console.log(cards);
		console.log(remain);
		var tefuda = new Array(num);
		for(var i = 0; i < num; i++){
			tefuda[i] = new Array(12).fill(0);
		}
		var nokori = cards.reduce((a,x) => a+=x,0);
		var nokori_li = [];
		cards.forEach((card, index) => {
			for(var i = 0; i< card; i++){
				nokori_li.push(index);
			}
		})
		var rand = 0, res = 0;
		for(var i = 0; i < 4; i++){
			for(var j=0; j<num; j++){
				rand = Math.floor( Math.random() * nokori_li.length );
				res = nokori_li[rand];
				tefuda[j][res] = tefuda[j][res] + 1;
				nokori--;
				nokori_li.splice(res, 1);
				cards[res]--;
			}
		}
		var nokori = cards.reduce((a,x) => a+=x,0);
		var li = [];
		cards.forEach((card, index) => {
			for(var i = 0; i< card; i++){
				li.push(index);
			}
		})
		console.log(tefuda);

		for(var i = 0; i < num; i++){
			io.to(joiner[i].id).emit("tefuda", {tefuda: tefuda[i]});
		}
	})
})


http.listen(3000, function(){
    console.log('Listening on *:3000');
});