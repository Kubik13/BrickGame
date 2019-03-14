var g_canvas = document.getElementById("game_canvas");
var ctx = g_canvas.getContext("2d");

var s_canvas = document.getElementById("side_canvas");
var side_ctx = s_canvas.getContext("2d");


var x = g_canvas.width / 4;
var y = g_canvas.height / 2;
var ballRadius = 5; // радиус шарика
var vectorX = 1; // направление по х
var vectorY = 1; // направление по y
var speedX = 1.6; // смещение по х
var speedY = 1.4; // смещение по y
var startTime = new Date; //отметка времени старта
var endTime = 0;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (g_canvas.width - paddleWidth) / 2;
var paddleY = g_canvas.height - paddleHeight;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var hitPad = 0;
var score = 0;
var lives = 3;
var playOn = true; // идет игра или нет

var brickRowCount = 6;
var brickColumnCount = 7;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickPadding = 5;
var brickWidth = ((g_canvas.width - brickOffsetLeft * 2 - brickPadding * (brickColumnCount-1)) / brickColumnCount);
var brickHeight = brickWidth / 3;



var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - g_canvas.offsetLeft;
    if(relativeX > paddleWidth / 2 && relativeX < g_canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function buttons(){
	side_ctx.beginPath();
	side_ctx.rect(10,460,80,30);
	side_ctx.rect(10,420,80,30);
	side_ctx.fillStyle = "grey";
	side_ctx.fill();
	side_ctx.closePath();
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight && b.status ==1) {
                vectorY = -vectorY;
                b.status = 0;
                score++;
                if(score == brickRowCount*brickColumnCount) {
                    alert("YOU WIN!");
                    document.location.reload();
                    
                }
            }
        }
    }
}

function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
	ctx.strokeStyle = 'blue';
	ctx.stroke();
	ctx.closePath();
}

function drawPaddle(){
	ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}

function textInfo(){
	//ctx.font = '10px Arial';
	//ctx.fillStyle = 'black';
	//ctx.fillText('x - ' + Math.round(x), 20, 30);
	//ctx.fillText('y - ' + Math.round(y), 20, 40);
	//ctx.fillText('seconds - ' + (Math.round((endTime - startTime) / 1000)), 20,50); // миллисекунды проиденные с начала
	//ctx.fillText('right arrow - ' + rightPressed, 20, 60); 
	//ctx.fillText('left arrow - ' + leftPressed, 20, 70); 
	//ctx.fillText('up arrow - ' + upPressed, 20, 80); 
	//ctx.fillText('down arrow - ' + downPressed, 20, 90); 
	//ctx.fillText('pad hits - ' + hitPad, 20, 100);
	var log = document.getElementById("log");
	log.value = "x - " + Math.round(x) + "\n" + "y - " + Math.round(y) + "\n";
	log.value += "seconds - " + Math.round((endTime - startTime) / 1000) + "\n";
	log.value += "right arrow - " + rightPressed + "\n" + "left arrow - " + leftPressed + "\n";
	log.value += "pad hits - " + hitPad + "\n";
}

function drawScoreLives(){
	side_ctx.clearRect(0, 0, s_canvas.width, s_canvas.height);
	side_ctx.font = '20px Arial';
	side_ctx.fillStyle = 'blue'
	side_ctx.fillText ('score: ' + score, 10,30);
	side_ctx.fillText ('lives: ' + lives, 10,70);
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
	ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	collisionDetection();

	if ((x > g_canvas.width - ballRadius) || (x < ballRadius)) {vectorX = -vectorX}
	if (y < ballRadius) {vectorY = -vectorY}
	if ((y > g_canvas.height - (ballRadius + paddleHeight)) 
		&& (x > paddleX) 
		&& (x < paddleX + paddleWidth)) {
			vectorY = -vectorY; 
			speedX +=0.1; 
			speedY +=0.1; 
			hitPad += 1;
		}
	if (y > g_canvas.height - ballRadius) {
		lives--;
		if (lives == -1) { //если OK то игра начинается заново, перезагрузка странички
			if (playOn = confirm('Game Over! another play?') == true) {
				document.location.reload();	
			}
			else {
				playOn = false; //если CANCEL то игра стоп
			}
		}	
		else {
			vectorY = -vectorY;
		}
	}

	
	x = x + speedX * vectorX;
	y = y + speedY * vectorY;
	if(rightPressed && paddleX < g_canvas.width-paddleWidth) {
    	paddleX += 5;
	}
	if(leftPressed && paddleX > 0) {
    	paddleX -= 5;
	}
	//if (upPressed && paddleY > 0) { 
	//	paddleY -= 5;
	//}
	//if (downPressed && paddleY < g_canvas.height - paddleHeight) {
	//	paddleY += 5;
	//}
	endTime = new Date; 
	textInfo();
	if (playOn == true) {requestAnimationFrame(draw)} // если игра идет запускается draw снова

	drawScoreLives();
	buttons();
}

draw();



