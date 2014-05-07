

function Seed(img, plantIndex, startCoord, fromUser){
	this.coord = startCoord;
	this.img = img;
	this.plantIndex = plantIndex;
	this.bornTick = tickNumber;
	this.angus =  Math.random() * 2 * Math.PI;
	this.spin = 0;
	this.speed = 0.60;
	this.energy = 10;
	this.energyConsomation = 0.25;
	this.travelTime = 8 + this.plantIndex * 2;
	this.imgZoom = 0.30;
	if(fromUser){
		this.speed = 2.0;
	}
	this.alpha = 1.0;
}
Seed.prototype.isFreeSpace = function(world){
	var anims = world.getAnimationsAt(this.coord, 64, this);
	for(var i = 0; i < anims.length; i++){
		if(anims[i].isPlant != undefined){
			return false;
		}
	}
	return true;
}
Seed.prototype.tick = function(tickNumber, world){
	this.spin += 0.05;
	this.energy -= (this.energyConsomation / 25);
	this.energyConsomation += 0.01;//became older and older	
	if(this.energy < 0){
		this.isDead = true;
	}
	if(this.isDead){
		this.alpha = Math.max(0, this.alpha - 0.05);
		if(this.alpha == 0){
			this.isActive = false;
		}
		return;
	}	
	if(this.energy < 1 ||  tickNumber > this.bornTick + 25 * this.travelTime){		
		if(this.isFreeSpace(world)){
			//born!
			var plant = new Plant(this.img, this.plantIndex, this.coord);
			plant.angus = this.angus + this.spin;
			plant.imgZoom = this.imgZoom;
			plant.energy = this.energy;
			world.addAnimation(plant, 10);
			this.isActive = false;
			return;
		}
	}


	this.coord = {x: this.coord.x + this.speed * Math.cos(this.angus),
			y: this.coord.y + this.speed * Math.sin(this.angus)};
	var resetAngus = false;		
	if(this.coord.x < 32){
		resetAngus = true;
		this.coord.x = 32;
	}
	if(this.coord.x + 32 > world.width ){
		resetAngus = true;
		this.coord.x = world.width  - 32;
	}
	if(this.coord.y < 32){
		resetAngus = true;
		this.coord.y = 32;
	}
	if(this.coord.y + 32 > world.height ){
		resetAngus = true;
		this.coord.y = world.height  - 32;
	}
	if(resetAngus){
		this.angus =  Math.random() * 2 * Math.PI;
	}	
}
Seed.prototype.draw = function(screen){	
	screen.drawZoomImg(this.img, this.coord, this.angus + this.spin, this.imgZoom, this.alpha);
	if(this.isMouseOver){	
		screen.fillRect({x: this.coord.x - 32, y : this.coord.y + 24,}, 64.0 * this.energy / 100, 4, 'rgba(0, 255, 0, 0.5)');		
		screen.strokeRect({x: this.coord.x - 32, y : this.coord.y + 24,}, 64, 4, 'rgba(50, 205, 50, 0.5)');
	}
}







