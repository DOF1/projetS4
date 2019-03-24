var bootState = {
	create: function() {
		this.game.stage.disableVisibilityChange = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = false;
		this.game.state.start('Preloader');
		this.game.stage.backgroundColor = "##2F8CCD";
	}
};