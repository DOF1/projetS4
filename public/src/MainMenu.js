var menuState = {
	create: function() {
		console.log("menuState :: create");
		/*
		MENU DU JEU AVEC LES BOUTTONS ETC
		*/
		game.stage.backgroundColor = '#FFFFFF';
		text = game.add.text(game.world.centerX, game.world.centerY-100, "PULSE");
		text.anchor.set(0.5);
		text.align = 'center';
		text.fontSize = 50;
	
		window.onkeyup = keyup;

		var inputTextValue;

		function keyup(e) 
		{
		  inputTextValue = e.target.value;
		  if (e.keyCode == 13) {
			playerName = inputTextValue;
			element = document.getElementById("nameTxt");
			element.parentNode.removeChild(element);
			game.state.start('game');
		  }
		}
	}
};