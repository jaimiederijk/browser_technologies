'use strict';
//(function(){

	var htmlElements = {
		javascriptWarning: document.querySelector('#javascript'),
		gameSection : document.querySelector('#pong_game'),
		prestart : document.querySelector('#prestart'),
		canvas: document.querySelector('#canvas'),
		court: document.querySelector('#court'),
		ball: document.querySelector('#ball'),
		player1: document.querySelector('#player1'),
		player2: document.querySelector('#player2'),
		button : document.querySelector('#startbutton')
	};

	var app = {
		init: function() {			
			if (htmlElements.javascriptWarning.classList) { 
			    htmlElements.javascriptWarning.classList.add("hidden");
			} else {
			    htmlElements.javascriptWarning.className = "hidden"; // For IE9 and earlier
			}
			ui.createStartButton();
		}

	};

	var ui = {
		createStartButton : function () { // show button if javascript is available
			htmlElements.button.classList.remove("hidden");

			htmlElements.button.addEventListener ("click", function() {
				pong.init();
			});
		}
	};

	var pong = {
		init: function() {
			htmlElements.canvas.classList.remove("hidden");
			htmlElements.prestart.classList.add("hidden");
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
			height:600,//H = window.innerHeight, // Window's height
			playersSpeed : 5, // Ball object
			players : [2], // Array containing two paddles
			mouse : {}, // Mouse object to store it's current position
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
		},
		draw : function () {
			this.variables.ctx.fillStyle = "black";
			this.variables.ctx.fillRect(0, 0, this.variables.width,  this.variables.height);
			for(var i = 0; i < this.variables.players.length; i++) {
				var p = this.variables.players[i];
				
				this.variables.ctx.fillStyle = "white";
				this.variables.ctx.fillRect(p.x, p.y, p.w, p.h);
			}
			
			pong.ball.draw();
			pong.update();
		},
		createPlayer : function (pos) {
			// Height and width
			this.h = 200;
			this.w = 5;
			this.targetPos = pong.variables.height /2 - this.h /2;
			// Paddle's position
			this.y = this.targetPos;//pong.variables.height /2 - this.h /2;
			this.x = (pos == "left") ? 0 : pong.variables.width - this.w;
			
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
		update : function() {
			var height = pong.variables.height;
			var width = pong.variables.width;
			// Update scores
			//updateScore(); 
			
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
			}		
			// }
			
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
				// Collide with walls, If the ball hits the top/bottom,
				// walls, run gameOver() function
				if(pong.ball.x + pong.ball.r > width) {
					pong.ball.x = width - pong.ball.r;
					pong.gameOver();
				} 
				
				else if(pong.ball.x < 0) {
					pong.ball.x = pong.ball.r;
					pong.gameOver();
				}
				
				// If ball strikes the vertical walls, invert the 
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
			
			//points++;
			//increaseSpd();
			
			
			//particlePos.x = ball.x;
			//flag = 1;
		},
		btnClick : function (e) {
			var mx = e.pageX,
			my = e.pageY;
			if(mx >= pong.restartBtn.x && mx <= pong.restartBtn.x + pong.restartBtn.w) {
				pong.ball.x = 20;
				pong.ball.y = 20;
				pong.points = 0;
				pong.ball.vx = 4;
				pong.ball.vy = 8;
				pong.animLoop();
				
			} 
			else if (mx>pong.variables.width/2) {
				//right player
				pong.variables.players[2].targetPos = my-pong.variables.players[2].h/2;
			} else if (mx<pong.variables.width/2) {
				//left player
				pong.variables.players[1].targetPos = my-pong.variables.players[1].h/2;
			}
			
		},
		gameOver : function () {
			pong.cancelRequestAnimFrame.call(window, pong.variables.init);
			pong.restartBtn.draw();
		},
		animLoop : function () {
			pong.variables.init = pong.requestAnimFrame.call(window, pong.animLoop);
			pong.draw();
		}

	};

	var sections = {

	};





	app.init();




//})();

