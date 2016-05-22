'use strict';
(function(){

	var htmlElements = {
		javascriptWarning: document.getElementById('javascript'),
		gameSection : document.getElementById('pong_game'),
		prestart : document.getElementById('prestart'),
		canvas: document.getElementById('canvas'),
		court: document.getElementById('court'),
		ball: document.getElementById('ball'),
		player1: document.getElementById('player1'),
		player2: document.getElementById('player2'),
		button : document.getElementById('startbutton')
	};

	var app = {
		init: function() {			
			if (htmlElements.javascriptWarning.classList) { 
			    htmlElements.javascriptWarning.classList.add("hidden");
			} else {
			    htmlElements.javascriptWarning.className = "hidden"; // For IE9 and earlier
			}
			ui.createStartButton();
			ui.KeyListenerProto();
		}

	};

	var touchCanvas;

	var ui = {
		createStartButton : function () { // show button if javascript is available
			if (htmlElements.canvas.getContext && htmlElements.canvas.getContext('2d')) {
				if (htmlElements.button.classList) { 
				    htmlElements.button.classList.remove("hidden");
				} else {
				    htmlElements.button.className = htmlElements.button.className.replace(/\bmystyle/g, ""); // For IE9 and earlier
				}

				//htmlElements.button.addEventListener ("click", 
				if (htmlElements.button.addEventListener) {
				  htmlElements.button.addEventListener('click',function() {
						pong.init();
					}, false); 
				} else if (htmlElements.button.attachEvent)  {
				  	htmlElements.button.attachEvent('onclick', function() {
						pong.init();
					});
				}
			};
			
		},
		touchListener : function(element) {//http://blog.mailson.org/2013/02/simple-pong-game-using-html5-and-canvas/
			this.touches = [];
		    this.touchMoveListener = function(touch) {
		    	pong.touchCheck(touch);
		    };
		 
		    element.addEventListener("touchstart", (function(e) {
		        e.preventDefault();
		        for (var i = 0; i < e.changedTouches.length; i++) {
		            var touch = e.changedTouches[i];
		            this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY};
		            
		        }
		    }).bind(this));
		 
		    element.addEventListener("touchmove", (function(e) {
		        e.preventDefault();
		        for (var i = 0; i < e.changedTouches.length; i++) {
		            var touch = e.changedTouches[i];
		            var previousTouch = this.touches[touch.identifier];
		            this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY};
		 
		            var offset = {x: touch.clientX - previousTouch.x, y: touch.clientY - previousTouch.y}
		            this.touchMoveListener({x: touch.clientX, y: touch.clientY, offset: offset});
		        }
		    }).bind(this));
		 
		    element.addEventListener("touchend", (function(e) {
		        e.preventDefault();
		        
		        for (var i = 0; i < e.changedTouches.length; i++) {
		            delete this.touches[e.changedTouches[i].identifier];
		        }
		    }).bind(this));
		},
		KeyListener :function() {//http://blog.mailson.org/2013/02/simple-pong-game-using-html5-and-canvas/
		    this.pressedKeys = [];
		 
		    this.keydown = function(e) {
		        this.pressedKeys[e.keyCode] = true;
		    };
		 
		    this.keyup = function(e) {
		        this.pressedKeys[e.keyCode] = false;
		    };
		 
		    document.addEventListener("keydown", this.keydown.bind(this));
		    document.addEventListener("keyup", this.keyup.bind(this));


		},
		KeyListenerProto : function() {
			this.KeyListener.prototype.isPressed = function(key)
			{
			    return this.pressedKeys[key] ? true : false;
			};
			 
			this.KeyListener.prototype.addKeyPressListener = function(keyCode, callback)
			{
			    document.addEventListener("keypress", function(e) {
			        if (e.keyCode == keyCode)
			            callback(e);
			    });
			};	
		}
		
	};

	var pong = {
		//inspired by http://cssdeck.com/labs/ping-pong-game-tutorial-with-html5-canvas-and-sounds
		init: function() {
			if (htmlElements.canvas.classList) { 
			    htmlElements.canvas.classList.remove("hidden");
			    htmlElements.prestart.classList.add("hidden");
			} else {
			    htmlElements.canvas.className = htmlElements.button.className.replace(/\bmystyle/g, ""); // For IE9 and earlier
			    htmlElements.prestart.className = "hidden";
			}
			
			pong.createCanvas();
			pong.animLoop();
		},
		requestAnimFrame : (function() {
			return  window.requestAnimationFrame       || 
					window.webkitRequestAnimationFrame || 
					window.mozRequestAnimationFrame    || 
					window.oRequestAnimationFrame      || 
					window.msRequestAnimationFrame     ||  
					function( callback ){
						return window.setTimeout(callback, 1000 / 60);
					}
		})(),
		cancelRequestAnimFrame : ( function() {
			return window.cancelAnimationFrame          ||
			window.webkitCancelRequestAnimationFrame    ||
			window.mozCancelRequestAnimationFrame       ||
			window.oCancelRequestAnimationFrame     ||
			window.msCancelRequestAnimationFrame        ||
			clearTimeout
		})(),
		variables: {
			ctx : htmlElements.canvas.getContext("2d"), // Create canvas context
			width: htmlElements.gameSection.offsetWidth,//W = window.innerWidth, // Window's width
			targetMax : htmlElements.gameSection.offsetHeight,
			height:htmlElements.gameSection.offsetHeight,//H = , // Window's height
			playersSpeed : 5, // Ball object
			players : [2], // Array containing two paddles
			mouse : {}, // Mouse object to store it's current position
			keys: new  ui.KeyListener(),
			points : 0, // Varialbe to store points
			fps : 60 // Max FPS (frames per second)
			
		},
		createCanvas : function () {
			htmlElements.canvas.width = this.variables.width;
			htmlElements.canvas.height = this.variables.height;


			this.variables.players.push(new pong.createPlayer("left"));
			this.variables.players.push(new pong.createPlayer("right"));

			this.addListeners()
		},
		addListeners : function () {
			htmlElements.canvas.addEventListener("mousedown", pong.btnClick, true);
			touchCanvas = new ui.touchListener(htmlElements.canvas);
		},
		draw : function () {
			this.variables.ctx.fillStyle = "black";
			this.variables.ctx.fillRect(0, 0, this.variables.width,  this.variables.height);
			this.variables.ctx.beginPath();
			this.variables.ctx.moveTo(this.variables.width/2,0);
			this.variables.ctx.lineTo(this.variables.width/2, this.variables.height);
			this.variables.ctx.stroke();

			for(var i = 0; i < this.variables.players.length; i++) {
				var p = this.variables.players[i];
				
				this.variables.ctx.fillStyle = "white";
				this.variables.ctx.fillRect(p.x, p.y, p.w, p.h);
			}
			this.scoreBoard.draw();
			pong.ball.draw();
			pong.update();
		},
		createPlayer : function (pos) {
			// Height and width
			this.h = 200;
			this.w = 5;
			this.score = 0;
			this.targetPos = pong.variables.height /2 - this.h /2;
			// Paddle's position
			this.y = this.targetPos;//pong.variables.height /2 - this.h /2;
			this.x = (pos == "left") ? 0 : pong.variables.width - this.w ;
			
		},
		ball : {
			x: 50,
			y: 50, 
			r: 5,
			c: "white",
			vx: 4,
			vy: 8,
			
			// Function for drawing ball on canvas
			draw: function() {
				pong.variables.ctx.beginPath();
				pong.variables.ctx.fillStyle = this.c;
				pong.variables.ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
				pong.variables.ctx.fill();
			}
		},
		restartBtn : {
			w : 100,
			h : 50,
			x : 200,
			y : 200,
			
			draw: function() {
				this.x = pong.variables.width/2 - 50;
				this.y = pong.variables.height/2 - 50;

				pong.variables.ctx.strokeStyle = "white";
				pong.variables.ctx.lineWidth = "2";
				pong.variables.ctx.strokeRect(this.x, this.y, this.w, this.h);
				
				pong.variables.ctx.font = "18px Arial, sans-serif";
				pong.variables.ctx.textAlign = "center";
				pong.variables.ctx.textBaseline = "middle";
				pong.variables.ctx.fillStlye = "white";
				pong.variables.ctx.fillText("Restart", pong.variables.width/2, pong.variables.height/2 - 25 );
			}
			
			
		},
		scoreBoard : {
			w : 100,
			h : 50,
			x : 200,
			y : 200,
			
			draw: function() {
				this.x = pong.variables.width/2 - 50;
				this.y = 0;

				pong.variables.ctx.strokeStyle = "white";
				pong.variables.ctx.lineWidth = "2";
				pong.variables.ctx.strokeRect(this.x, this.y, this.w, this.h);
				
				pong.variables.ctx.font = "18px Arial, sans-serif";
				pong.variables.ctx.textAlign = "center";
				pong.variables.ctx.textBaseline = "middle";
				pong.variables.ctx.fillStlye = "white";
				pong.variables.ctx.fillText(pong.variables.players[1].score+ " - " +pong.variables.players[2].score , pong.variables.width/2, 25 );
			}			
		},
		update : function() {
			var height = pong.variables.height;
			var width = pong.variables.width;

			this.checkKeys();

			this.movePaddles();
			
			
			// Move the ball
			pong.ball.x += pong.ball.vx;
			pong.ball.y += pong.ball.vy;
			
			// Collision with paddles
			var p1 = pong.variables.players[1];
			var p2 = pong.variables.players[2];
			
			
			// If the ball strikes with paddles,
			// invert the y-velocity vector of ball,
			// increment the points, play the collision sound,
			// save collision's position so that sparks can be
			// emitted from that position, set the flag variable,
			// and change the multiplier
			if(pong.collides(pong.ball, p1)) {
				pong.collideAction(pong.ball, p1);
			}
						
			else if(pong.collides(pong.ball, p2)) {
				pong.collideAction(pong.ball, p2);
			} 
			
			else {
				// Collide with walls, If the ball hits the sides
				if(pong.ball.x + pong.ball.r > width) {
					pong.ball.x = width - pong.ball.r;
					pong.score(1)
				} 
				
				else if(pong.ball.x < 0) {
					pong.ball.x = pong.ball.r;
					pong.score(2);
				}
				
				// If ball strikes the walls, invert the 
				// x-velocity vector of ball
				if(pong.ball.y + pong.ball.r > height) {
					pong.ball.vy = -pong.ball.vy;
					pong.ball.y = height - pong.ball.r;
				}
				
				else if(pong.ball.y -pong.ball.r < 0) {
					pong.ball.vy = -pong.ball.vy;
					pong.ball.y = pong.ball.r;
				}
			}
			
		},
		checkKeys : function () {
			if (this.variables.keys.isPressed(83)) { // DOWN sw
		        this.variables.players[1].targetPos+=5;
		    } else if (this.variables.keys.isPressed(87)) { // UP
		        this.variables.players[1].targetPos-=5;
		    }
		 
		    if (this.variables.keys.isPressed(40)) { // DOWN
		        this.variables.players[2].targetPos+=5;
		    } else if (this.variables.keys.isPressed(38)) { // UP
		        this.variables.players[2].targetPos-=5;
		    }
		},
		touchCheck : function (touch) {
			
			var mx = touch.x;
			
			if (mx>pong.variables.width/2) {
				//right player
				pong.variables.players[2].targetPos = pong.variables.players[2].targetPos + touch.offset.y; //my-pong.variables.players[2].h/2;
				if (pong.variables.players[2].targetPos<0) {
					pong.variables.players[2].targetPos=0
				} else if (pong.variables.players[2].targetPos>pong.variables.targetMax-pong.variables.players[2].h) {
					pong.variables.players[2].targetPos=pong.variables.targetMax-pong.variables.players[2].h;
				}
			} else if (mx<pong.variables.width/2) {
				//left player
				pong.variables.players[1].targetPos = pong.variables.players[1].targetPos + touch.offset.y;//my-pong.variables.players[1].h/2;
				if (pong.variables.players[1].targetPos<0) {
					pong.variables.players[1].targetPos=0
				} else if (pong.variables.players[1].targetPos>pong.variables.targetMax-pong.variables.players[1].h) {
					pong.variables.players[1].targetPos=pong.variables.targetMax-pong.variables.players[1].h;
				}
			}
			
		},
		movePaddles : function() {
			// Move the paddles on mouse move
			// if(mouse.x && mouse.y) {
			for(var i = 1; i < pong.variables.players.length; i++) {
				var p = pong.variables.players[i];
				if (p.y!=p.targetPos) {
					if (p.targetPos>p.y) {
						if (p.targetPos-p.y<pong.variables.playersSpeed) {//overshoots target
							p.y+=p.targetPos-p.y;
						} else {
							p.y+=pong.variables.playersSpeed;
						}
					}else {
						if (p.y-p.targetPos<pong.variables.playersSpeed) {//overshoots target
							p.y-=p.y-p.targetPos;
						} else {
							p.y-=pong.variables.playersSpeed;
						}
						
					}
				};
			};	
		},
		score : function (player) {
			this.variables.players[player].score++;
			this.scoreBoard.draw();
			this.gameOver();
		},
		collides: function (b,p) {
			if(b.y + pong.ball.r >= p.y && b.y - pong.ball.r <=p.y + p.h) {
				if(b.x >= (p.x - p.w) && p.x > 0){
					pong.variables.paddleHit = 1;
					return true;
				}
				
				else if(b.x <= p.w && p.x == 0) {
					pong.variables.paddleHit = 2;
					return true;
				}
				
				else return false;
			}
		},
		collideAction : function (ball, p) {
			ball.vx = -ball.vx;
			
			if(pong.variables.paddleHit == 1) {
				ball.x = p.x - p.w;
				
			}
			
			else if(pong.variables.paddleHit == 2) {
				ball.x = p.w + ball.r;
					
			}
		},
		btnClick : function (e) {
			var mx = e.clientX,
			my = e.clientY;
		
			if (mx>pong.variables.width/2) {
				//right player
				pong.variables.players[2].targetPos = my-pong.variables.players[2].h/2;
			} else if (mx<pong.variables.width/2) {
				//left player
				pong.variables.players[1].targetPos = my-pong.variables.players[1].h/2;
			}
			
		},
		restart : function () {
			pong.ball.x = 20;
			pong.ball.y = 20;
			pong.points = 0;
			pong.ball.vx = 4;
			pong.ball.vy = 8;
		},
		gameOver : function () {
			this.restart()
		},
		animLoop : function () {
			pong.variables.init = pong.requestAnimFrame.call(window, pong.animLoop);
			pong.draw();
		}

	};

	var sections = {

	};

	app.init();

})();

