var preloaderState = {
	preload: function() {
        game.load.image("player", "img/player.png");
        game.load.image("background", "img/fond.jpg");
		game.load.spritesheet("hole", "img/hole.png", 72, 72, 19);
		
	},
	create: function() {
		console.log("preloaderState :: create");
		game.state.start('menu');
	}
};