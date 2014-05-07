var img_score = LoadImage('img/score.png');
var img_best = LoadImage('img/best.png');
var img_numbers = new Array();
for(var i = 0; i <=9; i++){
	img_numbers[i] = LoadImage('img/' + i + '.png');
}

function Gui(world, canvas){
	this.world = world;
	this.canvas = canvas;	
	this.lastTime = Date.now();
	this.drawCount = 0;
	this.fps = 25;
	this.competances = new Array();
	for(var i = 0; i < imgPlants.length; i++){
		this.competances.push(new Competance(0, i, imgPlants[i], i));
	}
	for(var i = 0; i < imgHerbivores.length; i++){
		this.competances.push(new Competance(1, i, imgHerbivores[i], 3 + i));
	}
	for(var i = 0; i < imgCarnivores.length; i++){
		this.competances.push(new Competance(2, i, imgCarnivores[i], 5 + i));
	}
	this.playerActionBar = this.createActionbar();
}
Gui.prototype.createActionbar = function(){
	var competanceSize = 64;
	var nbCompetancePerLine = this.competances.length;
	if(this.competances.length * competanceSize  + 128 > this.canvas.width){
		competanceSize = 48;
	}
	if(this.competances.length * competanceSize  + 128 > this.canvas.width){
		competanceSize = 32;
	}
	if(this.competances.length * competanceSize  + 128 > this.canvas.width){	
		nbCompetancePerLine = Math.floor((this.competances.length + 1) / 2);
	}
	var actionBar = new Control(
		{x:5, y:this.canvas.height - 64 - 5},
		{x:5 + nbCompetancePerLine * competanceSize, y:this.canvas.height - 5}
		);
	
	for(var i = 0; i < this.competances.length; i++){
		var cellX = i % nbCompetancePerLine;
		var cellY = Math.floor(i / nbCompetancePerLine);
		var compTopLeft = {
			x: actionBar.topLeftCoord.x + cellX  * competanceSize, 
			y:actionBar.topLeftCoord.y + cellY * competanceSize};
		var compControl = new Control(
			compTopLeft,
			{x:compTopLeft.x + competanceSize,
			y:compTopLeft.y + competanceSize});
		actionBar.controls.push(compControl);
		compControl.world = this.world;
		compControl.competance = this.competances[i];
		compControl.competanceIndex = i;
		compControl.ondraw = function(canvas, rendering, control){
			var competance = control.competance;
			rendering.fillStyle = "rgba(255, 255, 255, 1)";
			rendering.fillRect(control.topLeftCoord.x, control.topLeftCoord.y, competanceSize, competanceSize);				
			rendering.drawImage(competance.img, control.topLeftCoord.x, control.topLeftCoord.y, competanceSize, competanceSize);
			rendering.strokeStyle = competance.borderColor;
			rendering.strokeRect(control.topLeftCoord.x+1, control.topLeftCoord.y+1, competanceSize-2, competanceSize-2);			
			var cooldownPercent = competance.cooldownPercent;			
			if(cooldownPercent > 0){				
				rendering.fillStyle = "rgba(0, 0, 0, 0.6)";
				rendering.fillRect(control.topLeftCoord.x, control.topLeftCoord.y, competanceSize, competanceSize);
				rendering.fillStyle = "rgba(0, 0, 0, 0.9)";
				rendering.fillRect(control.topLeftCoord.x, control.topLeftCoord.y, competanceSize, competanceSize * cooldownPercent/100);				
			}
		}		
	}	
	return actionBar;
}


Gui.prototype.showDps = function(canvas, rendering)
{
	if(!isDebug){
		return;
	}
	this.drawCount++;
	var now = Date.now();
	var duration = now - this.lastTime;
	if(duration > 1000){
		this.fps = Math.round(this.drawCount * 1000 / duration, 2);
		this.drawCount = 0;
		this.lastTime = now;
	}
	rendering.font="8px Arial";
	rendering.fillStyle = 'gray';
	rendering.fillText("fps: " + this.fps, canvas.width - 28, canvas.height - 8);
	//rendering.fillText(this.fps,  30, 16);	
}

Gui.prototype.showScore = function(canvas, rendering)
{
	var x = canvas.width - 24;
	var valueToDisplay = Math.floor(this.world.currentScore);
	do{
		x = x - 18;
		var img = img_numbers[valueToDisplay%10];
		rendering.drawImage(img, x, 16, 12, 16);
		valueToDisplay = Math.floor(valueToDisplay / 10);		
	} while(valueToDisplay != 0);	
	rendering.drawImage(img_score, x - 48 - 6, 16, 48, 16);
	
	x = canvas.width - 24;
	valueToDisplay = Math.floor(this.world.bestScore);
	do{
		x = x - 18;
		var img = img_numbers[valueToDisplay%10];
		rendering.drawImage(img, x, 40, 12, 16);
		valueToDisplay = Math.floor(valueToDisplay / 10);		
	} while(valueToDisplay != 0);	
	rendering.drawImage(img_best, x - 48 - 6, 40, 48, 16);	
}
Gui.prototype.draw = function(canvas, rendering)
{	
	rendering.fillStyle = "rgb(70, 20, 30)";
	rendering.fillRect(0, canvas.height - 64 - 10, canvas.width, 64+10);			
	this.playerActionBar.draw(canvas, rendering);
	this.showDps(canvas, rendering);	
	this.showScore(canvas, rendering);
}
Gui.prototype.tick = function(tickNumber){
	for(var i = 0; i < this.competances.length; i++){
		this.competances[i].tick(tickNumber);
	}
}
Gui.prototype.onClick = function(canvasPoint, worldpoint){
	var button = this.playerActionBar.getControl(canvasPoint);
	if(button != null){
		if(button.competance != null){
			button.competance.tryCast(world, canvasPoint);			
		}		
	}
}

Gui.prototype.onMouseMove = function(canvasPoint, worldpoint){
	   this.world.mouse = worldpoint;
}





