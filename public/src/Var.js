console.log("lecture Var.js");
var config = {
	type: Phaser.AUTO,
	parent: 'gameDiv',
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 0 }
		}
	}
};
var game = new Phaser.Game(config);

var player;
var playerName;


game.state.add('preload', preloaderState);
game.state.add('menu', menuState);
game.state.add('game', gameState);

game.state.start('preload');