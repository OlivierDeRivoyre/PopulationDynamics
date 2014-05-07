var isDebug = true;

var canvas;
var world;
var screen;
var gui;
var tickNumber = 0;

window.onload = function() {
	

	var canvasWidth = window.innerWidth-5;
	var canvasHeight = window.innerHeight-5;
	canvas = document.getElementById('layer');	
	canvas.width  = canvasWidth; 
	canvas.height = canvasHeight; 
	
	
	canvas.onclick = mouseDown;
	canvas.onmousemove = mouseMove;
	screen = new Screen(canvas);
	world = new World(screen); 
	gui = new Gui(world, canvas);
	world.mouseCoord = {x:-1, y:-1};
	
	//Main loop:
	setInterval(function() {
		tickNumber++;
		world.tick(tickNumber);
		gui.tick(tickNumber);
		screen.clear();
		world.drawAll(screen);	
		gui.draw(canvas, screen.rendering);
	}, 40);

	
}

function getRelativeCoord(mouseEvent){
    var mouseX, mouseY; 
	mouseX = mouseEvent.clientX - canvas.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft;;
	mouseY = mouseEvent.clientY - canvas.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;;
    return {x:mouseX, y:mouseY};
}

function mouseDown(e) 
{ 
    var canvasPoint = getRelativeCoord(e);
	gui.onClick(canvasPoint);
} 
function mouseMove(e) 
{ 
    var canvasPoint = getRelativeCoord(e);
	world.mouseCoord = canvasPoint;
}

//Sounds
var last_playAudioDie = Date.now() - 50000;
function playAudioDie(){
	if(Date.now() - last_playAudioDie > 5000){
		last_playAudioDie = Date.now()
		document.getElementById('audioDie').play();
	}
}
var last_playAudioKiss = Date.now() - 50000;
function playAudioKiss(){
	if(Date.now() - last_playAudioKiss > 5000){
		last_playAudioKiss = Date.now()
		document.getElementById('audioKiss').play();
	}
}
var last_playAudioMiamMiam = Date.now() - 300000;
function playAudioMiamMiam(){
	if(Date.now() - last_playAudioMiamMiam > 60000){
		last_playAudioMiamMiam = Date.now()
		document.getElementById('audioMiamMiam').play();
	}
}
var last_playAudioPloupPloup = Date.now() - 50000;
function playAudioPloupPloup(){
	if(Date.now() - last_playAudioPloupPloup > 500){
		last_playAudioPloupPloup = Date.now()
		document.getElementById('audioPloupPloup').play();
	}
}
var last_playAudioSimplePloup = Date.now() - 50000;
function playAudioSimplePloup(){
	if(Date.now() - last_playAudioSimplePloup > 500){
		last_playAudioSimplePloup = Date.now()
		document.getElementById('audioSimplePloup').play();
	}
}



