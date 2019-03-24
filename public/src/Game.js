var gameState = {
    create: function() {
		
		this.game.stage.disableVisibilityChange = true;
		
	    game.add.tileSprite(0, 0, 1440,1373, 'background');

	    game.world.setBounds(0, 0, 1440,1373);

		var self = this;
		
		this.lock = true;
		
		this.lock2 = true;
		
		this.socket = io();
		
		this.otherPlayers = this.add.group();
		
		this.holesGroup = this.add.group();
		
		this.socket.on('currentPlayers', function (players) {
			Object.keys(players).forEach(function (id) {
				if (players[id].playerId === self.socket.id)
				{
					self.player = game.add.sprite(players[id].x, players[id].y, 'player');
					self.player.tint = players[id].color;
					game.physics.enable(self.player, Phaser.Physics.ARCADE);
					self.player.anchor.set(0.5);
					self.player.inputEnabled = true;
					text = game.add.text(0, 0, playerName);
					text.fixedToCamera = true;
					text.cameraOffset.setTo(0, 0);
					text.addColor(players[id].color);

					self.socket.emit('updateName', {name : playerName});
				}
				else {
					const otherPlayer = game.add.sprite(players[id].x, players[id].y, 'player');
					otherPlayer.tint = players[id].color;
					game.physics.enable(otherPlayer, Phaser.Physics.ARCADE);
					otherPlayer.playerId = players[id].playerId;
					
					otherPlayer.name = game.add.text(players[id].x+15, players[id].y-15, players[id].name);
					otherPlayer.name.fontSize = 20;
					otherPlayer.name.anchor.set(0.5);
					otherPlayer.name.align = 'center';
					self.otherPlayers.add(otherPlayer);
				}
			});
		});
		
		this.socket.on('newPlayer', function (playerInfo) {
			const otherPlayer = game.add.sprite(playerInfo.x, playerInfo.y, 'player');
			otherPlayer.tint = playerInfo.color;
			game.physics.enable(otherPlayer, Phaser.Physics.ARCADE);
			otherPlayer.playerId = playerInfo.playerId;
			
			otherPlayer.name = game.add.text(playerInfo.x+15, playerInfo.y-15, playerInfo.name);
			otherPlayer.name.fontSize = 20;
			otherPlayer.name.anchor.set(0.5);
			otherPlayer.name.align = 'center';
			self.otherPlayers.add(otherPlayer);
		});
		
		this.socket.on('disconnect', function (playerId) {
			self.otherPlayers.forEach(function (otherPlayer) {
				if (playerId === otherPlayer.playerId)
				{
					otherPlayer.destroy();
					otherPlayer.name.destroy();
				}
			});
		});

		this.socket.on('playerMoved', function (playerInfo) {
			self.otherPlayers.forEach(function (otherPlayer) {
				if (playerInfo.playerId === otherPlayer.playerId)
				{
					otherPlayer.x = playerInfo.x;
					otherPlayer.y = playerInfo.y;
					otherPlayer.name.x = playerInfo.x+15;
					otherPlayer.name.y = playerInfo.y-15;
				}
			});
		});
		
		this.socket.on('holes', function (holes){
			Object.keys(holes).forEach(function (id) {
				hole = game.add.sprite(holes[id].x,holes[id].y,'hole',19);
				game.physics.enable(hole, Phaser.Physics.ARCADE);
				hole.anchor.set(0.5);
				hole.body.setCircle(5,(-5 + 0.5 * hole.width / hole.scale.x),(-5 + 0.5 * hole.height / hole.scale.y));
				anim = hole.animations.add('anim');
				hole.smoothed = false;
				anim.play(20,true);
				self.holesGroup.add(hole);
			});
		});

		this.socket.on('pow', function (data){
			if (data.player.playerId === self.socket.id){
				
				self.lock = false;
				
				var distance = Math.sqrt(Math.pow((self.player.x - data.x),2) + Math.pow((self.player.y - data.y),2));
				var force = (150 - distance)*15;
				var angle = Math.atan2(self.player.y - data.y, self.player.x - data.x);
				
				self.player.body.velocity.x = Math.cos(angle) * force;
				self.player.body.velocity.y = Math.sin(angle) * force;
				
				game.time.events.add(500, function () {
					self.lock = true;
				});
			}
		});

		this.cursors = this.input.keyboard.createCursorKeys();
    },
	die: function(){
		
		dietext = game.add.text(0, 0, "YOU DIED, CONGRATZ !");
		dietext.fontSize = 50;
		dietext.fontSize = 50;
		dietext.stroke = 'white';
		dietext.strokeThickness = 4;
		dietext.fixedToCamera = true;
		dietext.cameraOffset.setTo(game.width/2-300, game.height/2-150);
		
		this.lock = false;
		this.lock2 = false;
		this.player.body.velocity = 0;
		game.time.events.add(3000, function () {
			game.state.start('menu',true,false);
			document.location.reload(true);
		});
	},
	shoot: function(){
		self = this;
		game.time.events.add(1250, function () {
			self.lock2 = true;
		});
	},
    update: function() {



		if(this.player)
		{
			if (this.lock)
			{
				game.physics.arcade.moveToPointer(this.player, 200);
				if (this.player.input.pointerOver())
				{
					this.player.body.velocity.setTo(0, 0);
				}
			}
			
			game.camera.focusOn(this.player);

			var x = this.player.body.position.x;
			var y = this.player.body.position.y;

			if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y))
			{
				this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y });
			}
			
			this.player.oldPosition = {
				x: this.player.x,
				y: this.player.y,
				rotation: this.player.rotation
			};
			
			if(this.lock2 && game.input.activePointer.leftButton.isDown)
			{
				this.lock2 = false;
				this.shoot();
				console.log("boom");
				this.socket.emit('ispow');
			}
			
			game.physics.arcade.overlap(this.player, this.holesGroup, this.die, null, this);
		}
    }
};