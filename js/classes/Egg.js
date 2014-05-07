
var imgEgg1 = LoadImage('img/egg1.png');
var imgEgg2 = LoadImage('img/egg2.png');

function Egg(startCoord, creatureType, creatureIndex, creatureImg){
	this.coord = startCoord;
	this.img = imgEgg1;
	if(creatureType == 2){
		this.img = imgEgg2;
	}
	this.creatureType = creatureType;
	this.creatureImg = creatureImg;
	this.creatureIndex = creatureIndex;
	this.numberOfCreatures = 1;
	this.progressPercent = 0;
	this.angus = 0;
	this.energy = 1;	
}
Egg.prototype.tick = function(tickNumber, world){	
	this.progressPercent = Math.min(100, this.progressPercent + 0.20);	
	if(this.progressPercent == 100){		
		//born!		
		for(var i = 0; i < this.numberOfCreatures; i++){
			var creature = new Creature(this.coord, this.creatureType, this.creatureIndex, this.creatureImg);
			creature.energy = this.energy / this.numberOfCreatures;
			world.addAnimation(creature, 30 + this.creatureType);
		}
		this.isActive = false;
		return;
		
	}
}
Egg.prototype.draw = function(screen){	
	screen.drawImg(this.img, this.coord, this.angus);
	if(this.isMouseOver){
		//energy
		screen.fillRect({x: this.coord.x - 32, y : this.coord.y + 24,}, 64.0 * this.energy / 100, 4, 'rgba(0, 255, 0, 0.5)');		
		screen.strokeRect({x: this.coord.x - 32, y : this.coord.y + 24,}, 64, 4, 'rgba(50, 205, 50, 0.5)');
		//progress percent
		screen.fillRect({x: this.coord.x - 32, y : this.coord.y + 28,}, 64.0 * this.progressPercent / 100, 4, 'rgba(200, 150, 120, 0.5)');		
		screen.strokeRect({x: this.coord.x - 32, y : this.coord.y + 28,}, 64, 4, 'rgba(150, 120, 70, 0.5)');	
	}
}







