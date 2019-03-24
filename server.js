var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
 
var players = {};

var holes = {}

for(var i = 0; i < 15; i++){
	holes[i] = {
		x: Math.floor(Math.random() * 1240) + 100,
		y: Math.floor(Math.random() * 1173) + 100,
	};
}

app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	
	players[socket.id] = {
		x: Math.floor(Math.random() * 1390) + 50,
		y: Math.floor(Math.random() * 1323) + 50,
		playerId: socket.id,
		name: "Player",
		color: Math.random() * 0xffffff,
		pow : false,
	};
	
	socket.on('updateName', function (playerName) {
		players[socket.id].name = playerName.name;
		console.log('+ ' + players[socket.id].name + ' is connected ');
		socket.broadcast.emit('newPlayer', players[socket.id]);
	});
	
	socket.emit('currentPlayers', players);
	
	socket.on('disconnect', function () {
		console.log('- ' + players[socket.id].name + ' disconnected');
		delete players[socket.id];
		io.emit('disconnect', socket.id);
	});
	
	socket.on('ispow', function () {
		//condition pour envoyer qu'a un seul joueur
		players[socket.id].pow = true;
		Object.keys(players).forEach(function (id2){
			if(players[socket.id].x - 150 < players[id2].x
			&& players[socket.id].x + 150 > players[id2].x
			&& players[socket.id].y + 150 > players[id2].y 
			&& players[socket.id].y - 150 < players[id2].y
			&& players[socket.id] != players[id2])
			{
				socket.broadcast.emit('pow',{ x: players[socket.id].x, y: players[socket.id].y, player : players[id2] });
			}
		});
		players[socket.id].pow = false;
	});
	
	socket.on('playerMovement', function (movementData) {
		players[socket.id].x = movementData.x;
		players[socket.id].y = movementData.y;
		players[socket.id].rotation = movementData.rotation;
		socket.broadcast.emit('playerMoved', players[socket.id]);
	});
	
	socket.emit('holes', holes);
	
});
 
server.listen(3000, '0.0.0.0', function () {
	console.log(`Listening on ${server.address().port}`);
});